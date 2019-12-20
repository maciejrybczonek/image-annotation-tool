import { Model } from './model';
export class Category extends Model {

    id: string;
    name: string;
    color: string;

    constructor({
        id,
        name,
        color
    }: {
        id: string;
        name: string;
        color: string;
        }) {
        super({ id });
        this.assignValues({
            name,
            color
        });
    }

}
