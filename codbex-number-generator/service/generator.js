import { NumberRepository } from "../gen/codbex-number-generator/dao/Numbers/NumberRepository";
export class NumberGeneratorService {
    constructor() {
        this.repository = new NumberRepository();
    }
    generate(id) {
        try {
            const entity = this.repository.findById(id);
            if (entity) {
                entity.Value += 1;
                this.repository.update(entity);
                const zeroPad = (num, places) => String(num).padStart(places, '0');
                const result = (entity.Prefix ? entity.Prefix : "") + zeroPad(entity.Value, entity.Length - (entity.Prefix ? entity.Prefix.length : 0));
                return result;
            }
            else {
                throw new Error("Number not found");
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}
