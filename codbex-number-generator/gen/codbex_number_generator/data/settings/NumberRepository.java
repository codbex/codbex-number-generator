package gen.codbex_number_generator.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class NumberRepository extends JavaRepository<NumberEntity> {

    public NumberRepository() {
        super(NumberEntity.class);
    }
}
