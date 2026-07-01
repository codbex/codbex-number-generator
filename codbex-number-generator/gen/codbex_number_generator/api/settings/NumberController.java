package gen.codbex_number_generator.api.settings;

import gen.codbex_number_generator.data.settings.NumberEntity;
import gen.codbex_number_generator.data.settings.NumberRepository;

import org.eclipse.dirigible.components.api.security.UserFacade;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.http.Body;
import org.eclipse.dirigible.sdk.http.Controller;
import org.eclipse.dirigible.sdk.http.Delete;
import org.eclipse.dirigible.sdk.http.Get;
import org.eclipse.dirigible.sdk.http.PathParam;
import org.eclipse.dirigible.sdk.http.Post;
import org.eclipse.dirigible.sdk.http.Put;
import org.eclipse.dirigible.sdk.http.QueryParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Controller
@Documentation("codbex-number-generator - Number Controller")
public class NumberController {

    private static final Set<String> FILTER_FIELDS = Set.of("Id", "Type", "Prefix", "Length", "Value");

    private final NumberRepository repository;

    public NumberController(NumberRepository repository) {
        this.repository = repository;
    }

    @Get
    @Documentation("List Number")
    public List<NumberEntity> getAll(@QueryParam("$limit") Integer limit,
                                      @QueryParam("$offset") Integer offset) {
        checkPermissions("read");
        int actualLimit = limit != null ? limit.intValue() : 20;
        int actualOffset = offset != null ? offset.intValue() : 0;
        List<NumberEntity> result = repository.findAll(actualLimit, actualOffset);
        return result;
    }

    @Get("/count")
    @Documentation("Count Number")
    public Map<String, Long> count() {
        checkPermissions("read");
        return Map.of("count", repository.count());
    }

    @Post("/count")
    @Documentation("Count Number with filter")
    public Map<String, Long> countWithFilter(@Body Map<String, Object> filter) {
        checkPermissions("read");
        return Map.of("count", (long) runFilter(filter).size());
    }

    @Post("/search")
    @Documentation("Search Number")
    public List<NumberEntity> search(@Body Map<String, Object> filter) {
        checkPermissions("read");
        List<NumberEntity> result = runFilter(filter);
        return result;
    }

    @Get("/{id}")
    @Documentation("Get Number by id")
    public NumberEntity getById(@PathParam("id") Integer id) {
        checkPermissions("read");
        NumberEntity entity = repository.findOne(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Number not found"));
        return entity;
    }

    @Post
    @Documentation("Create Number")
    public NumberEntity create(@Body NumberEntity entity) {
        checkPermissions("write");
        validate(entity);
        return repository.save(entity);
    }

    @Put("/{id}")
    @Documentation("Update Number by id")
    public NumberEntity update(@PathParam("id") Integer id, @Body NumberEntity entity) {
        checkPermissions("write");
        entity.Id = id;
        validate(entity);
        return repository.update(entity);
    }

    @Delete("/{id}")
    @Documentation("Delete Number by id")
    public void deleteById(@PathParam("id") Integer id) {
        checkPermissions("write");
        if (repository.findOne(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Number not found");
        }
        repository.deleteById(id);
    }

    private List<NumberEntity> runFilter(Map<String, Object> filter) {
        StringBuilder hql = new StringBuilder("from NumberEntity e");
        Map<String, Object> params = new LinkedHashMap<>();
        boolean first = true;
        if (filter != null && filter.get("equals") instanceof Map<?, ?> equals) {
            for (Map.Entry<?, ?> entry : equals.entrySet()) {
                String field = requireKnownField(String.valueOf(entry.getKey()));
                String paramName = "p" + params.size();
                hql.append(first ? " where e." : " and e.").append(field).append(" = :").append(paramName);
                params.put(paramName, entry.getValue());
                first = false;
            }
        }
        if (filter != null && filter.get("conditions") instanceof List<?> conditions) {
            for (Object raw : conditions) {
                if (!(raw instanceof Map<?, ?> condition)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter condition");
                }
                String field = requireKnownField(String.valueOf(condition.get("propertyName")));
                String operator = String.valueOf(condition.get("operator")).toUpperCase(Locale.ROOT);
                Object value = condition.get("value");
                String paramName = "p" + params.size();
                String clause = switch (operator) {
                    case "EQ" -> "e." + field + " = :" + paramName;
                    case "IN" -> {
                        if (!(value instanceof Collection<?>)) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IN value must be a list for field: " + field);
                        }
                        yield "e." + field + " in (:" + paramName + ")";
                    }
                    case "LIKE" -> "e." + field + " like :" + paramName;
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported operator: " + operator);
                };
                hql.append(first ? " where " : " and ").append(clause);
                params.put(paramName, value);
                first = false;
            }
        }
        return repository.query(hql.toString(), params);
    }

    private static String requireKnownField(String field) {
        if (!FILTER_FIELDS.contains(field)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown filter field: " + field);
        }
        return field;
    }

    private void checkPermissions(String op) {
        if ("read".equals(op) && !(UserFacade.isInRole("codbex-number-generator.Numbers.NumberReadOnly") || UserFacade.isInRole("codbex-number-generator.Numbers.NumberFullAccess"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if ("write".equals(op) && !UserFacade.isInRole("codbex-number-generator.Numbers.NumberFullAccess")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static void validate(NumberEntity entity) {
        if (entity.Type != null && entity.Type.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Type' exceeds the maximum length of 50");
        }
        if (entity.Prefix != null && entity.Prefix.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Prefix' exceeds the maximum length of 20");
        }
    }
}
