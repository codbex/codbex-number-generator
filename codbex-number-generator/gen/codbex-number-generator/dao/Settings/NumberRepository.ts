import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";

export interface NumberEntity {
    readonly Id: number;
    Type: string;
    Prefix: string;
    Length?: number;
    Value?: number;
}

export interface NumberCreateEntity {
    readonly Type: string;
    readonly Prefix: string;
    readonly Length?: number;
    readonly Value?: number;
}

export interface NumberUpdateEntity extends NumberCreateEntity {
    readonly Id: number;
}

export interface NumberEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Type?: string | string[];
            Prefix?: string | string[];
            Length?: number | number[];
            Value?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Type?: string | string[];
            Prefix?: string | string[];
            Length?: number | number[];
            Value?: number | number[];
        };
        contains?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Length?: number;
            Value?: number;
        };
        greaterThan?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Length?: number;
            Value?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Length?: number;
            Value?: number;
        };
        lessThan?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Length?: number;
            Value?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Length?: number;
            Value?: number;
        };
    },
    $select?: (keyof NumberEntity)[],
    $sort?: string | (keyof NumberEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface NumberEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<NumberEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface NumberUpdateEntityEvent extends NumberEntityEvent {
    readonly previousEntity: NumberEntity;
}

export class NumberRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_NUMBER",
        properties: [
            {
                name: "Id",
                column: "NUMBER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Type",
                column: "NUMBER_TYPE",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Prefix",
                column: "NUMBER_PREFIX",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Length",
                column: "NUMBER_LENGTH",
                type: "INTEGER",
            },
            {
                name: "Value",
                column: "NUMBER_VALUE",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(NumberRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: NumberEntityOptions = {}): NumberEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: NumberEntityOptions = {}): NumberEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: NumberCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_NUMBER",
            entity: entity,
            key: {
                name: "Id",
                column: "NUMBER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: NumberUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_NUMBER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "NUMBER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: NumberCreateEntity | NumberUpdateEntity): number {
        const id = (entity as NumberUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as NumberUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_NUMBER",
            entity: entity,
            key: {
                name: "Id",
                column: "NUMBER_ID",
                value: id
            }
        });
    }

    public count(options?: NumberEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_NUMBER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: NumberEntityEvent | NumberUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-number-generator-Settings-Number", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-number-generator-Settings-Number").send(JSON.stringify(data));
    }
}
