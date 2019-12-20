import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    LabelingDashboardComponent,
    LabelingImageDetailsComponent
} from './components';

const routes: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: LabelingDashboardComponent,
        }, {
            path: ':imageId',
            component: LabelingImageDetailsComponent
        }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LabelingRoutingModule { }
