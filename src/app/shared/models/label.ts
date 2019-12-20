import { Model } from './model';
export class Label extends Model {

    imageId: string;
    categoryId: string;
    shape: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radiusY?: number;
    radiusX?: number;
    offsetY?: number;
    offsetX?: number;
    rotation?: number;
    radius?: number;
    sides?: number;
    points?: number[];
    closed?: boolean;

    constructor({
        id,
        imageId,
        categoryId,
        shape,
        x,
        y,
        width,
        height,
        radiusY,
        radiusX,
        offsetY,
        offsetX,
        rotation,
        radius,
        sides,
        points,
        closed
    }: {
            id: string;
            imageId: string;
            categoryId: string;
            shape: string;
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            offsetY?: number;
            offsetX?: number;
            radiusY?: number;
            radiusX?: number;
            rotation?: number;
            radius?: number;
            sides?: number;
            points?: number[];
            closed?: boolean;
        }) {
        super({ id });
        this.assignValues({
            imageId,
            categoryId,
            x,
            y,
            shape,
            width,
            height,
            offsetY,
            offsetX,
            radiusY,
            radiusX,
            rotation,
            radius,
            sides,
            points,
            closed
        });
    }

}
