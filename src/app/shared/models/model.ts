export class Model {

    id: string;

    constructor({
        id
    }: {
            id: string;
        }) {
        this.id = id;
    }

    assignValues(values) {
        Object.keys(values).forEach(key => {
            let value = values[key];
            if (value !== undefined) this[key] = value;
        });
    }

}
