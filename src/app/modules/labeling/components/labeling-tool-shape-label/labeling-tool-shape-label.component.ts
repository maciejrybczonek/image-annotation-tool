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
    selector: 'app-labeling-tool-shape-label',
    templateUrl: './labeling-tool-shape-label.component.html'
})

export class LabelingToolShapeLabelComponent extends LabelingToolComponent implements ILabelingToolComponent {

    selector: Konva.Line;
    debounce: number;
    isDebounced: boolean = false;

    constructor(
        store: Store<any>,
        geometryService: GeometryService,
        simpleModalService: SimpleModalService
    ) {
        super(store, geometryService, simpleModalService);
        this.selector = new Konva.Line({ stroke: 'black', dash: [3, 3], strokeWidth: 1, name: 'selector', closed: true, points: [] });
        this.name = 'toolShapeLabel';
    }

    resizeSelector(position) {
        if(this.isDebounced) {
            return;
        }
        this.isDebounced = true;
        this.debounce = setTimeout(() => { // limit points number
            let points = this.selector.points();
            this.selector.points(points.concat([position.current.x, position.current.y]));
            clearTimeout(this.debounce);
            this.isDebounced = false;
        }, 40);
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
                        shape: 'Line',
                        points: this.selector.points(),
                        closed: true
                    });
                    this.store.dispatch(new LabelingAddLabel(label));
                }
                this.selector.visible(false);
                this.selector.points([])
                resolve();
            });
        });
    }

}
