import { NumberRepository, NumberEntityOptions } from "../gen/codbex-number-generator/dao/Settings/NumberRepository";

export class NumberGeneratorService {

    private readonly repository = new NumberRepository();

    public generate(id: number) {
        try {
            const entity = this.repository.findById(id);
            if (entity) {
                entity.Value += 1;
                this.repository.update(entity);
                const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
                const result: String = (entity.Prefix ? entity.Prefix : "") + zeroPad(entity.Value, entity.Length - (entity.Prefix ? entity.Prefix.length : 0));
                return result;
            } else {
                throw new Error("Number not found");
            }
        } catch (error: any) {
            console.error(error);
        }
    }

}