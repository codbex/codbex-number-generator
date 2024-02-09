import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface NumberEntity {
    readonly Id: number;
    Type?: string;
    Prefix?: string;
    Value?: number;
    Length?: number;
}

export interface NumberCreateEntity {
    readonly Type?: string;
    readonly Prefix?: string;
    readonly Value?: number;
    readonly Length?: number;
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
            Value?: number | number[];
            Length?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Type?: string | string[];
            Prefix?: string | string[];
            Value?: number | number[];
            Length?: number | number[];
        };
        contains?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Value?: number;
            Length?: number;
        };
        greaterThan?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Value?: number;
            Length?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Value?: number;
            Length?: number;
        };
        lessThan?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Value?: number;
            Length?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Type?: string;
            Prefix?: string;
            Value?: number;
            Length?: number;
        };
    },
    $select?: (keyof NumberEntity)[],
    $sort?: string | (keyof NumberEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface NumberEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<NumberEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
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
            },
            {
                name: "Prefix",
                column: "NUMBER_PREFIX",
                type: "VARCHAR",
            },
            {
                name: "Value",
                column: "NUMBER_VALUE",
                type: "INTEGER",
            },
            {
                name: "Length",
                column: "NUMBER_LENGTH",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(NumberRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: NumberEntityOptions): NumberEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): NumberEntity | undefined {
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
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_NUMBER",
            entity: entity,
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

    public count(): number {
        return this.dao.count();
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


    private async triggerEvent(data: NumberEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-number-generator/Numbers/Number", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-number-generator/Numbers/Number").send(JSON.stringify(data));
    }
}