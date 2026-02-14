import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { NumberEntity } from './NumberEntity'

@Component('NumberRepository')
export class NumberRepository extends Repository<NumberEntity> {

    constructor() {
        super((NumberEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<NumberEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-number-generator-Settings-Number', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-number-generator-Settings-Number').send(JSON.stringify(data));
    }
}
