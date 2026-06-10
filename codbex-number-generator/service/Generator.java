package service;

import gen.codbex_number_generator.data.settings.NumberEntity;
import gen.codbex_number_generator.data.settings.NumberRepository;

import org.eclipse.dirigible.engine.java.annotations.Inject;

import java.util.List;
import java.util.Map;

public class Generator {

    @Inject
    private NumberRepository numberRepository;

    public String generate(Integer id) {
        try {
            NumberEntity entity = numberRepository.findOne(id)
                .orElseThrow(() ->
                    new RuntimeException("Entity with id " + id + " not found"));

            return generateNumber(entity);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String generateByType(String genType) {
        try {
            List < NumberEntity > entities = numberRepository.query(
                "from NumberEntity e where e.Type = :type",
                Map.of("type", genType)
            );

            if (entities.isEmpty()) {
                throw new RuntimeException(
                    "Entity with type " + genType + " not found");
            }

            return generateNumber(entities.get(0));

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String generateNumber(NumberEntity entity) {
        entity.Value = entity.Value + 1;
        numberRepository.update(entity);

        String prefix = entity.Prefix != null ? entity.Prefix : "";

        int totalLength = entity.Length != null ? entity.Length : 0;
        int numericLength = Math.max(0, totalLength - prefix.length());

        String paddedValue = String.format(
            "%0" + numericLength + "d",
            entity.Value
        );

        return prefix + paddedValue;
    }
}