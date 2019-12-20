import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { labelingReducer, LabelingEffects } from './labeling';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('labeling', labelingReducer),
        EffectsModule.forFeature([LabelingEffects])
    ],
    declarations: [],
    exports: [],
    entryComponents: [],
    providers: [
    ]
})

export class AppStoreModule { }
