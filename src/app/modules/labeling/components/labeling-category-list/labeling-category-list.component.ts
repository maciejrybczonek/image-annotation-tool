import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { SimpleModalService } from "ngx-simple-modal";

import { LabelingCategoryModalComponent } from '../labeling-category-modal/labeling-category-modal.component';
import { LabelingAddCategory, selectCategories } from '../../../store/labeling';
import { Category } from '../../../../shared/models';

@Component({
    selector: 'app-labeling-category-list',
    templateUrl: './labeling-category-list.component.html'
})

export class LabelingCategoryListComponent implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<any> = new Subject();
    public categories: Category[];

    constructor(
        private store: Store<any>,
        private simpleModalService: SimpleModalService
    ) { }

    ngOnInit() {
        this.store.select(selectCategories).pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(categories => {
            this.categories = categories;
        });
    }

    editCategory(categoryId) {
        let modal = this.simpleModalService.addModal(LabelingCategoryModalComponent, {
            categoryId: categoryId
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
