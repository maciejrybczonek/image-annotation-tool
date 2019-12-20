import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KonvaModule } from 'ng2-konva';
import { TagInputModule } from 'ngx-chips';
import { RandomcolorModule } from 'angular-randomcolor';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleModalModule, defaultSimpleModalOptions } from 'ngx-simple-modal';

import {
    LabelingDashboardComponent,
    LabelingImageListComponent,
    LabelingImageDetailsComponent,
    LabelingLabelModalComponent,
    LabelingCategoryModalComponent,
    LabelingCategoryListComponent,
    LabelingToolComponent,
    LabelingToolRectangleLabelComponent,
    LabelingToolEllipseLabelComponent,
    LabelingToolHexagonLabelComponent,
    LabelingToolTriangleLabelComponent,
    LabelingToolShapeLabelComponent
} from './components';
import { LabelingRoutingModule } from './labeling-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        LabelingRoutingModule,
        KonvaModule,
        TagInputModule,
        RandomcolorModule,
        NgbTooltipModule,
        ColorPickerModule,
        SimpleModalModule.forRoot(
            { container: 'modal-container' },
            {
                animationDuration: 300,
                autoFocus: true,
                bodyClass: 'modal-open',
                closeOnClickOutside: true,
                closeOnEscape: true,
                wrapperClass: 'in',
                wrapperDefaultClasses: 'modal fade-anim'
            }
        )
    ],
    declarations: [
        LabelingDashboardComponent,
        LabelingImageListComponent,
        LabelingImageDetailsComponent,
        LabelingCategoryModalComponent,
        LabelingLabelModalComponent,
        LabelingCategoryListComponent,
        LabelingToolComponent,
        LabelingToolRectangleLabelComponent,
        LabelingToolEllipseLabelComponent,
        LabelingToolHexagonLabelComponent,
        LabelingToolTriangleLabelComponent,
        LabelingToolShapeLabelComponent
    ],
    entryComponents: [
        LabelingCategoryModalComponent,
        LabelingLabelModalComponent,
        LabelingToolRectangleLabelComponent,
        LabelingToolEllipseLabelComponent,
        LabelingToolHexagonLabelComponent,
        LabelingToolTriangleLabelComponent,
        LabelingToolShapeLabelComponent
    ],
    providers: []
})

export class LabelingModule { }
