import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StoreModule, ActionReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';

import { environment } from '../environments/environment';
import { APP_ROUTES } from './routes';

import {
    AppComponent
} from './components';
import { AppStoreModule } from './modules/store/store.module';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: ['labeling'], removeOnUndefined: true, rehydrate: true, restoreDates: true })(reducer);
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(APP_ROUTES, {
            onSameUrlNavigation: 'ignore',
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
        }),
        StoreModule.forRoot({}, { metaReducers: [localStorageSyncReducer] }),
        EffectsModule.forRoot([]),
        !environment.production ? StoreDevtoolsModule.instrument({
            name: 'Image Annotation Tool'
        }) : [],
        AppStoreModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
