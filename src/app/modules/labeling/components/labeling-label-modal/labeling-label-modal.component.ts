import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SimpleModalComponent } from "ngx-simple-modal";
import { Store, select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { RandomColor } from 'angular-randomcolor';
import { TagInputComponent } from 'ngx-chips';

import { LabelingAddCategory, selectCategories, selectCategory } from '../../../store/labeling';
import { Category } from '../../../../shared/models';

export interface ConfirmModel {}
@Component({
    selector: 'app-labeling-label-modal',
    templateUrl: './labeling-label-modal.component.html'
})
export class LabelingLabelModalComponent extends SimpleModalComponent<ConfirmModel, string> implements ConfirmModel, OnInit, OnDestroy, AfterViewInit {

    @ViewChild('input', { static: false }) input: TagInputComponent;
    private ngUnsubscribe: Subject<any> = new Subject();
    public categoryId: string;
    public categories: Category[] = [];
    public labelCategory: Category[] = [];

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
                this.labelCategory = [category];
            });
        }
        this.store.select(selectCategories).pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(categories => {
            this.categories = categories;
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.input.inputForm.input.nativeElement.focus();
        }, 50);
    }

    confirm() {
        this.result = this.labelCategory[0].id;
        this.close();
    }

    addCategory(newCategory) {
        let existingCategory = this.categories.find(category => category.name.toLowerCase() == newCategory.name.toLowerCase());
        if(existingCategory) {
            this.labelCategory = [existingCategory];
            this.confirm();
            return;
        }
        this.labelCategory = [new Category({
            id: uuid(),
            name: newCategory.name.toLowerCase(),
            color: RandomColor.generateColor()
        })]
        this.store.dispatch(new LabelingAddCategory(new Category(this.labelCategory[0])));
        this.confirm();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
