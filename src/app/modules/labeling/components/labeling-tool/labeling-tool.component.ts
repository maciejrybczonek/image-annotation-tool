import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Konva from 'konva';
import { SimpleModalService } from "ngx-simple-modal";

import { LabelingSetActiveTool, selectActiveTool } from '../../../store/labeling';
import { GeometryService } from '../../../../shared/services';

export interface ILabelingToolComponent {
    onInit: EventEmitter<any>;
    ngUnsubscribe: Subject<any>;
    selector: Konva.Ellipse|Konva.RegularPolygon|Konva.Rect|Konva.Line;
    name: string;
    isActive: boolean;
    supportSelecting: boolean;
    activateTool();
    resizeSelector(position: {
        start: {
            x: number;
            y: number;
        };
        current: {
            x: number;
            y: number;
        }
    });
    use(options: {});
}

@Component({
    template: ''
})
export class LabelingToolComponent implements OnInit, OnDestroy {

    @Output('onInit') onInit = new EventEmitter<any>();
    ngUnsubscribe: Subject<any> = new Subject();
    selector: Konva.Ellipse|Konva.RegularPolygon|Konva.Rect|Konva.Line;
    name: string;
    isActive: boolean = false;
    supportSelecting: boolean = true;

    constructor(
        public store: Store<any>,
        public geometryService: GeometryService,
        public simpleModalService: SimpleModalService
    ) { }

    ngOnInit() {
        this.onInit.emit(this);
        this.store.select(selectActiveTool).pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(activeToolName => {
            this.isActive = activeToolName == this.name;
        });
    }

    activateTool() {
        this.store.dispatch(new LabelingSetActiveTool(this.name));
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
