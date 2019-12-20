import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';


@Injectable()
export class LabelingEffects {

    constructor(
        private store: Store<any>,
        private actions: Actions
    ) { }



}
