import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [{
    path: '',
    loadChildren: './modules/labeling/labeling.module#LabelingModule',
}, {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
}];
