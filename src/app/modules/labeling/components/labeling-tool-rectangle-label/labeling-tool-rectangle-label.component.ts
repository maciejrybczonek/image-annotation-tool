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
    selector: 'app-labeling-tool-rectangle-label',
    templateUrl: './labeling-tool-rectangle-label.component.html'
})

export class LabelingToolRectangleLabelComponent extends LabelingToolComponent implements ILabelingToolComponent {

    selector: Konva.Rect;

    constructor(
        store: Store<any>,
        geometryService: GeometryService,
        simpleModalService: SimpleModalService
    ) {
        super(store, geometryService, simpleModalService);
        this.selector = new Konva.Rect({ stroke: 'black', dash: [3, 3], strokeWidth: 1, name: 'selector' });
        this.name = 'toolRectangleLabel';
    }

    resizeSelector(position) {
        let selectedArea = this.geometryService.getSelectedArea(position.start, position.current);
        this.selector.width(selectedArea.width);
        this.selector.height(selectedArea.height);
        this.selector.x(selectedArea.x);
        this.selector.y(selectedArea.y);
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
                        x: this.selector.x(),
                        y: this.selector.y(),
                        width: this.selector.width(),
                        height: this.selector.height(),
                        categoryId: categoryId,
                        shape: 'Rect'
                    });
                    this.store.dispatch(new LabelingAddLabel(label));
                }
                this.selector.visible(false);
                resolve();
            });
        });
    }

}
