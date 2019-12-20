import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { LabelingAddImage, LabelingRemoveImage, selectImages, selectLabels, selectCategories } from '../../../store/labeling';
import { Picture } from '../../../../shared/models';

@Component({
    selector: 'app-labeling-image-list',
    templateUrl: './labeling-image-list.component.html'
})

export class LabelingImageListComponent implements OnInit, OnDestroy {

    @ViewChild('uploader', { static: false }) uploader: ElementRef;
    private ngUnsubscribe: Subject<any> = new Subject();
    public images: Picture[];

    constructor(
        private sanitizer: DomSanitizer,
        private store: Store<any>,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.store.select(selectImages).pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(images => {
            this.images = images;
        });
    }

    uploadImage(event) {
        for (let i = 0; i < event.target.files.length; i++) {
            let file = event.target.files[i];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.store.dispatch(new LabelingAddImage(new Picture({
                    id: uuid(),
                    name: file.name,
                    content: String(reader.result)
                })));
            };
        }
        this.uploader.nativeElement.value = '';
    }

    removeImage(imageId, event) {
        event.preventDefault();
        this.store.dispatch(new LabelingRemoveImage(imageId));
    }

    downloadLabels() {
        this.store.select(selectLabels).pipe(
            withLatestFrom(
                this.store.select(selectCategories)
            ),
            takeUntil(this.ngUnsubscribe)
        ).subscribe(([labels, categories]) => {
            let exportData = this.images.map(image => ({
                imageId: image.id,
                filename: image.name,
                labels: []
            }));
            labels.forEach(label => {
                let index = exportData.findIndex(data => data.imageId == label.imageId);
                let category = categories.find(data => data.id == label.categoryId);
                exportData[index].labels.push({
                    ...label,
                    category
                })
            });
            let blob = new Blob([JSON.stringify(exportData)], { type: 'text/json' });
            this.http.get(window.URL.createObjectURL(blob), { responseType: 'blob' })
                .subscribe(data => saveAs(data, `${new Date().getTime()}.json`))
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
