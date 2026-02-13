import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('NumberEntity')
@Table('CODBEX_NUMBER')
@Documentation('Number entity mapping')
export class NumberEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'NUMBER_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Type')
    @Column({
        name: 'NUMBER_TYPE',
        type: 'string',
        length: 50,
    })
    public Type!: string;

    @Documentation('Prefix')
    @Column({
        name: 'NUMBER_PREFIX',
        type: 'string',
        length: 20,
    })
    public Prefix!: string;

    @Documentation('Length')
    @Column({
        name: 'NUMBER_LENGTH',
        type: 'integer',
        nullable: true,
    })
    public Length?: number;

    @Documentation('Value')
    @Column({
        name: 'NUMBER_VALUE',
        type: 'integer',
        nullable: true,
    })
    public Value?: number;

}

(new NumberEntity());
