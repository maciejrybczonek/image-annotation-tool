import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ComponentRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { takeUntil, filter, withLatestFrom } from 'rxjs/operators';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
import { KonvaComponent } from 'ng2-konva';
import Konva from 'konva';
import { SimpleModalService } from "ngx-simple-modal";
import { v4 as uuid } from 'uuid';

import { LabelingLabelModalComponent } from '../labeling-label-modal/labeling-label-modal.component';
import { LabelingUpdateLabel, LabelingRemoveLabel, selectImage, selectImageLabels, selectCategories } from '../../../store/labeling';
import { Picture, Label, Category } from '../../../../shared/models';

@Component({
    selector: 'app-labeling-image-details',
    templateUrl: './labeling-image-details.component.html'
})

export class LabelingImageDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('konva', { static: false }) konva: KonvaComponent;
    configStage: Observable<any> = of({});
    tools: any[] = [];
    labels: BehaviorSubject<any> = new BehaviorSubject([]);
    image: BehaviorSubject<any> = new BehaviorSubject([]);
    private ngUnsubscribe: Subject<any> = new Subject();
    private layerLabels: Konva.Layer;
    private layerImage: Konva.Layer;
    private canvas: Konva.Stage;
    private selecting: boolean = false;
    private mouseDown: boolean = false;
    private imageId: string;

    public get activeTool() {
        return this.tools.find(tool => tool.isActive);
    }

    constructor(
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router,
        private simpleModalService: SimpleModalService
    ) { }

    ngOnInit() {
        this.imageId = this.route.snapshot.params.imageId;
        this.store.select(selectImage(this.imageId)).pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(image => {
            if (image == null) {
                return this.router.navigate(['/']);
            }
            this.image.next(new Picture(image));
        });
        this.store.select(selectImageLabels(this.imageId)).pipe(
            takeUntil(this.ngUnsubscribe),
            withLatestFrom(
                this.store.select(selectCategories)
            )
        ).subscribe(([labels, categories]) => {
            this.labels.next(labels.map(label => {
                let category = categories.find(c => c.id == label.categoryId);
                return {
                    ...label,
                    fill: category ? category.color : '#808080',
                    categoryName: category ? category.name : 'No category'
                }
            }));
        });
    }

    ngAfterViewInit() {
        this.canvas = this.konva.getStage();
        this.layerLabels = new Konva.Layer();
        this.layerImage = new Konva.Layer();
        this.canvas.add(this.layerImage);
        this.canvas.add(this.layerLabels);
        this.handleImage();
        this.handleLabels();
        this.handleTooltip();
        this.handleSelecting();
        this.handleKeyboardEvents();
    }

    private handleImage() {
        this.image.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(image => {
            let source = new Image();
            source.src = image.content;
            source.onload = () => {
                let ratio = source.width / window.innerWidth;
                let width = window.innerWidth;
                let height = Math.round(source.height / ratio);
                let background = new Konva.Image({
                    x: 0,
                    y: 0,
                    image: source,
                    width: width,
                    height: height,
                    name: 'image'
                });
                this.canvas.width(width);
                this.canvas.height(height);
                this.canvas.draw();
                this.layerImage.add(background);
                this.layerImage.batchDraw();
            };
        });
    }

    private handleLabels() {
        this.labels.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(labels => {
            let viewLabels = this.layerLabels.find('.label');
            if(viewLabels.length > labels.length) { // remove deleted labels from view
                viewLabels.each(viewLabel => {
                    if(labels.findIndex(l => l.id == viewLabel.id) == -1) {
                        viewLabel.destroy();
                    }
                });
                this.destroyTransformer();
                this.hideTooltip();
            }
            for (let i = 0; i < labels.length; i++) {
                let label = labels[i];
                let viewLabel = this.layerLabels.findOne('#' + label.id);
                if(viewLabel) { // update rendered label
                    viewLabel.setAttrs(label);
                } else { // render label
                    let labelView = new Konva[label.shape]({
                        ...label,
                        listening: true,
                        opacity: 0.4,
                        draggable: true,
                        name: 'label'
                    });
                    this.registerLabelEvents(labelView);
                    this.layerLabels.add(labelView);
                }
            }
            this.layerLabels.draw();
        })
    }

    private registerLabelEvents(label) {
        label.on('dragstart', () => {
            this.hideTooltip();
        });
        label.on('dragend transformend', () => { // update store after label transform
            this.store.dispatch(new LabelingUpdateLabel(label.attrs));
        });
        label.on('mousedown touchstart', e => { // init label edit mode
            this.activateLabel(e.target);
        });
        label.on('dblclick', e => { // open category modal
            let modal = this.simpleModalService.addModal(LabelingLabelModalComponent, {
                categoryId: e.target.attrs.categoryId
            });
            modal.pipe(
                takeUntil(this.ngUnsubscribe)
            ).subscribe(categoryId => {
                if (categoryId) {
                    this.store.dispatch(new LabelingUpdateLabel(new Label({
                        ...label.attrs,
                        categoryId: categoryId
                    })));
                }
            });
        });
    }

    private activateLabel(label) {
        let tranformer = new Konva.Transformer();
        this.destroyTransformer();
        this.layerLabels.add(tranformer);
        tranformer.setAttr('labelId', label.id());
        tranformer.attachTo(label);
    }

    private handleTooltip() {
        let tooltip = new Konva.Label({
            name: 'tooltip'
        });
        let tag = new Konva.Tag({
            fill: 'black',
            pointerDirection: 'down',
            pointerWidth: 10,
            pointerHeight: 6,
            lineJoin: 'round',
            shadowColor: 'black',
            shadowBlur: 6,
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowOpacity: 0.2,
            cornerRadius: 99
        })
        tooltip.add(tag);
        let tooltipText = new Konva.Text({
            text: '',
            fontSize: 12,
            fill: 'white',
            lineHeight: .5,
            padding: 10,
            offsetY: -1
        })
        tooltip.add(tooltipText);
        this.layerLabels.add(tooltip);
        this.layerLabels.on('mousemove touchmove', e => {
            if (!e.target.hasName('label')) {
                return;
            }
            let mousePos = this.canvas.getPointerPosition();
            tooltip.position({
                x: mousePos.x,
                y: mousePos.y - 4
            });
            tooltipText.text(e.target.attrs.categoryName.toUpperCase());
            tag.fill(e.target.attrs.fill);
            tooltip.show();
            tooltip.moveToTop();
            this.layerLabels.draw();
        });
        this.layerLabels.on('mouseout', () => {
            tooltip.hide();
            this.layerLabels.draw();
        });
    }

    private handleSelecting() {
        let position = {
            start: { x: 0, y: 0 },
            current: { x: 0, y: 0 }
        }
        this.canvas.on('mousedown touchstart', e => {
            if (!e.target.hasName('image') || !this.activeTool || !this.activeTool.supportSelecting) {
                return;
            }
            this.destroyTransformer();
            this.mouseDown = true;
            position.start = { x: e.evt.layerX, y: e.evt.layerY };
            this.layerLabels.add(this.activeTool.selector);
        })
        this.canvas.on('mousemove touchmove', e => {
            if (!this.mouseDown) {
                return;
            }
            this.selecting = true;
            position.current = { x: e.evt.layerX, y: e.evt.layerY };
            this.activeTool.resizeSelector(position);
            this.activeTool.selector.visible(true);
            this.layerLabels.draw();
        })
        this.canvas.on('mouseup touchend', e => {
            this.mouseDown = false;
            if (!this.selecting) {
                return;
            }
            this.selecting = false;
            this.activeTool.use({ imageId: this.imageId }).then(() => {
                this.layerLabels.draw();
            });
        })
    }

    private handleKeyboardEvents() {
        window.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 27:
                    this.selecting = false;
                    this.mouseDown = false;
                    this.activeTool.selector.visible(false);
                    this.destroyTransformer();
                    break;
                case 8:
                    let transformer = this.canvas.findOne('Transformer');
                    if (transformer) {
                        this.store.dispatch(new LabelingRemoveLabel(transformer.attrs.labelId));
                    }
                    break;
            }
            this.layerLabels.draw();
        });
    }

    registerTool(tool) {
        this.tools.push(tool);
    }

    private destroyTransformer() {
        let transformer = this.layerLabels.findOne('Transformer');
        if (transformer) {
            transformer.destroy();
            this.layerLabels.draw();
        }
    }

    private hideTooltip() {
        let tooltip = this.layerLabels.findOne('.tooltip');
        if (tooltip && tooltip.visible()) {
            tooltip.visible(false);
            this.layerLabels.draw();
        }
    }

    highlightLabel(labelId) {
        let label = this.layerLabels.findOne('#' + labelId);
        if(label) {
            this.activateLabel(label)
            this.layerLabels.draw();
        }
    }

    removeLabel(labelId) {
        this.store.dispatch(new LabelingRemoveLabel(labelId));
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
