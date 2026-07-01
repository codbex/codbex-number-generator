package gen.codbex_number_generator.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class NumberRepository extends JavaRepository<NumberEntity> {

    public NumberRepository() {
        super(NumberEntity.class);
    }

    @Override
    public NumberEntity save(NumberEntity entity) {
        NumberEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-number-generator-Settings-Number", Json.stringify(saved));
        return saved;
    }

    @Override
    public NumberEntity update(NumberEntity entity) {
        NumberEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-number-generator-Settings-Number-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Number-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public NumberEntity updateWithoutEvent(NumberEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(NumberEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-number-generator-Settings-Number-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        NumberEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-number-generator-Settings-Number-deleted", Json.stringify(entity));
        }
    }
}
