import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import Konva from 'konva';
import { SimpleModalService } from "ngx-simple-modal";
import { v4 as uuid } from 'uuid';

import { LabelingToolComponent, ILabelingToolComponent } from '../labeling-tool/labeling-tool.component';
import { LabelingLabelModalComponent } from '../labeling-label-modal/labeling-label-modal.component';
import { LabelingAddLabel } from '../../../store/labeling';
import { GeometryService } from '../../../../shared/services';
import { Label } from '../../../../shared/models';

@Component({
    selector: 'app-labeling-tool-triangle-label',
    templateUrl: './labeling-tool-triangle-label.component.html'
})

export class LabelingToolTriangleLabelComponent extends LabelingToolComponent implements ILabelingToolComponent {

    selector: Konva.RegularPolygon;

    constructor(
        store: Store<any>,
        geometryService: GeometryService,
        simpleModalService: SimpleModalService
    ) {
        super(store, geometryService, simpleModalService);
        this.selector = new Konva.RegularPolygon({ stroke: 'black', dash: [3, 3], strokeWidth: 1, name: 'selector', radius: 0, sides: 3 });
        this.name = 'toolTriangleLabel';
    }

    resizeSelector(position) {
        let distance = this.geometryService.getPointsDistance(position.start, position.current);
        let angle = this.geometryService.getPointsAngle(position.start, position.current);
        this.selector.radius(distance);
        this.selector.rotation(angle);
        this.selector.x(position.start.x);
        this.selector.y(position.start.y);
    }

    use(options) {
        return new Promise((resolve, reject) => {
            let modal = this.simpleModalService.addModal(LabelingLabelModalComponent);
            modal.pipe(
                takeUntil(this.ngUnsubscribe)
            ).subscribe(categoryId => {
                if (categoryId) {
                    let label = new Label({
                        ...options,
                        id: uuid(),
                        categoryId: categoryId,
                        x: this.selector.x(),
                        y: this.selector.y(),
                        shape: 'RegularPolygon',
                        radius: this.selector.radius(),
                        rotation: this.selector.rotation(),
                        sides: this.selector.sides()
                    });
                    this.store.dispatch(new LabelingAddLabel(label));
                }
                this.selector.visible(false);
                resolve();
            });
        });
    }

}
