import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeometryService {

    constructor() { }

    public getSelectedArea(start, current) {
        let x = current.x, y = current.y, width = Math.abs(start.x - current.x), height = Math.abs(start.y - current.y);
        if (start.x < current.x) {
            x = start.x;
            width = Math.abs(current.x - start.x);
        }
        if (start.y < current.y) {
            y = start.y;
            height = Math.abs(current.y - start.y);
        }
        return {
            x, y, width, height
        }
    }

    public getPointsDistance(start, current) {
        let a = start.x - current.x;
        let b = start.y - current.y;
        return Math.sqrt(a * a + b * b);
    }

    public getPointsAngle(start, current) {
        return Math.atan2(start.y - current.y, start.x - current.x) * (180 / Math.PI);
    }

}
