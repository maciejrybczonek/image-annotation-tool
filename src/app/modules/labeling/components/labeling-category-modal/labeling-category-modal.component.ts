import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SimpleModalComponent } from "ngx-simple-modal";
import { Store, select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { RandomColor } from 'angular-randomcolor';

import { LabelingUpdateCategory, LabelingRemoveCategory, selectCategories, selectCategory } from '../../../store/labeling';
import { Category } from '../../../../shared/models';

export interface ConfirmModel {}
@Component({
    selector: 'app-labeling-category-modal',
    templateUrl: './labeling-category-modal.component.html'
})
export class LabelingCategoryModalComponent extends SimpleModalComponent<ConfirmModel, boolean> implements ConfirmModel, OnInit, OnDestroy {

    @ViewChild('input', { static: false }) input: ElementRef;
    private ngUnsubscribe: Subject<any> = new Subject();
    public categoryId: string;
    public category: Category;

    constructor(
        private store: Store<any>
    ) {
        super();
    }

    ngOnInit() {
        if(this.categoryId) {
            this.store.select(selectCategory(this.categoryId)).pipe(
                takeUntil(this.ngUnsubscribe)
            ).subscribe(category => {
                this.category = Object.assign({}, category);
            });
        }
    }

    confirm() {
        if(!this.category.name.length) {
            return;
        }
        this.store.dispatch(new LabelingUpdateCategory(this.category));
        this.result = true;
        this.close();
    }

    delete() {
        this.store.dispatch(new LabelingRemoveCategory(this.category.id));
        this.result = false;
        this.close();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
