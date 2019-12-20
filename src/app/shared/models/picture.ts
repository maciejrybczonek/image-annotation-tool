import { Model } from './model';
export class Picture extends Model {

    id: string;
    name: string;
    content: string;

    constructor({
        id,
        name,
        content
    }: {
        id: string;
        name: string;
        content: string;
        }) {
        super({ id });
        this.assignValues({
            name,
            content
        });
    }

}
