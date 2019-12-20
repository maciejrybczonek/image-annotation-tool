import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './reducers';

const getState = createFeatureSelector<State>('labeling');
export const selectImages = createSelector(getState, (state: State): any => state.images);
export const selectImage = imageId => createSelector(getState, (state: State): any => {
    let image = state.images ? state.images.find(image => image.id == imageId) : null;
    return image || null;
});
export const selectImageLabels = imageId => createSelector(getState, (state: State): any => {
    return state.labels ? state.labels.filter(label => label.imageId == imageId) : [];
});
export const selectLabels = createSelector(getState, (state: State): any => state.labels);
export const selectActiveTool = createSelector(getState, ( state: State ): any => state.activeTool);
export const selectCategories = createSelector(getState, (state: State): any => state.categories);
export const selectCategory = categoryId => createSelector(getState, (state: State): any => {
    let category = state.categories ? state.categories.find(category => category.id == categoryId) : null;
    return category || null;
});
