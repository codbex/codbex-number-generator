import { NumberRepository } from "../gen/codbex-number-generator/data/Settings/NumberRepository";

export class NumberGeneratorService {

    private readonly numberRepository = new NumberRepository();

    public generate(id: number): string | undefined {
        try {
            const entity = this.numberRepository.findById(id);

            if (!entity) {
                throw new Error(`Entity with id ${id} not found`);
            }

            entity.Value! += 1;
            this.numberRepository.update(entity);

            const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
            const result: string = (entity.Prefix ? entity.Prefix : "")
                + zeroPad(entity.Value!, entity.Length!
                    - (entity.Prefix ? entity.Prefix.length : 0));

            return result;

        } catch (error: any) {
            console.error(error);
        }
    }

    public generateByType(genType: string): string | undefined {
        try {

            const entity = this.numberRepository.findAll()
                .filter(item => item.Type === genType).at(0);

            if (!entity) {
                throw new Error(`Entity with type ${genType} not found`);
            }

            entity.Value! += 1;
            this.numberRepository.update(entity);

            const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
            const result: string = (entity.Prefix ? entity.Prefix : "")
                + zeroPad(entity.Value!, entity.Length!
                    - (entity.Prefix ? entity.Prefix.length : 0));

            return result;

        } catch (error: any) {
            console.error(error);
        }
    }

}