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
    selector: 'app-labeling-tool-ellipse-label',
    templateUrl: './labeling-tool-ellipse-label.component.html'
})

export class LabelingToolEllipseLabelComponent extends LabelingToolComponent implements ILabelingToolComponent {

    selector: Konva.Ellipse;

    constructor(
        store: Store<any>,
        geometryService: GeometryService,
        simpleModalService: SimpleModalService
    ) {
        super(store, geometryService, simpleModalService);
        this.selector = new Konva.Ellipse({ stroke: 'black', dash: [3, 3], strokeWidth: 1, name: 'selector', radiusX: 0, radiusY: 0 });
        this.name = 'toolEllipseLabel';
    }

    resizeSelector(position) {
        let selectedArea = this.geometryService.getSelectedArea(position.start, position.current);
        this.selector.radiusX(selectedArea.width);
        this.selector.radiusY(selectedArea.height);
        this.selector.x(selectedArea.x+selectedArea.width);
        this.selector.y(selectedArea.y+selectedArea.height);
        this.selector.offsetX(selectedArea.width/2);
        this.selector.offsetY(selectedArea.height/2);
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
                        shape: 'Ellipse',
                        radiusX: this.selector.radiusX(),
                        radiusY: this.selector.radiusY(),
                        offsetX: this.selector.offsetX(),
                        offsetY: this.selector.offsetY()
                    })
                    this.store.dispatch(new LabelingAddLabel(label));
                }
                this.selector.visible(false);
                resolve();
            });
        });
    }

}
