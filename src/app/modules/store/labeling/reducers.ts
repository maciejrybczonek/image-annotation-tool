import { ActionReducerMap } from '@ngrx/store';
import {
    LABELING_ADD_IMAGE,
    LABELING_REMOVE_IMAGE,
    LABELING_ADD_LABEL,
    LABELING_UPDATE_LABEL,
    LABELING_REMOVE_LABEL,
    LABELING_SET_ACTIVE_TOOL,
    LABELING_ADD_CATEGORY,
    LABELING_UPDATE_CATEGORY,
    LABELING_REMOVE_CATEGORY,
    LabelingAddImage,
    LabelingRemoveImage,
    LabelingAddLabel,
    LabelingUpdateLabel,
    LabelingRemoveLabel,
    LabelingSetActiveTool,
    LabelingAddCategory,
    LabelingUpdateCategory,
    LabelingRemoveCategory
} from './actions';

import { Picture, Label, Category } from '../../../shared/models';

export interface State {
    images: Picture[];
    labels: Label[];
    activeTool: string;
    categories: Category[];
}

export const labelingReducer: ActionReducerMap<State> = {
    images, labels, activeTool, categories
};

export function images(state = [], action: LabelingAddImage & LabelingRemoveImage): Picture[] {
    switch (action.type) {
        case LABELING_ADD_IMAGE:
            return [
                action.image,
                ...state
            ];
        case LABELING_REMOVE_IMAGE:
            return state.length ? state.filter(image => image.id !== action.imageId ? image : false) : state;
        default:
            return state;
    }
}

export function labels(state = [], action: LabelingAddLabel & LabelingUpdateLabel & LabelingRemoveLabel & LabelingRemoveImage & LabelingRemoveCategory): Label[] {
    switch (action.type) {
        case LABELING_ADD_LABEL:
            return [
                action.label,
                ...state
            ];
        case LABELING_UPDATE_LABEL:
            return state.map(label => {
                if (label.id == action.label.id) {
                    return action.label
                }
                return label;
            });
        case LABELING_REMOVE_LABEL:
            return state !== null ? state.filter(label => label.id !== action.labelId ? label : false) : state;
        case LABELING_REMOVE_IMAGE:
            return state !== null ? state.filter(label => label.imageId !== action.imageId ? label : false) : state;
        case LABELING_REMOVE_CATEGORY:
            return state.map(label => {
                if (label.categoryId == action.categoryId) {
                    label.categoryId = null;
                    return label
                }
                return label;
            });
        default:
            return state;
    }
}

export function activeTool(state = 'toolRectangleLabel', action: LabelingSetActiveTool): string {
    switch (action.type) {
        case LABELING_SET_ACTIVE_TOOL:
            return action.toolName
        default:
            return state;
    }
}

export function categories(state = [], action: LabelingAddCategory & LabelingUpdateCategory & LabelingRemoveCategory): Category[] {
    switch (action.type) {
        case LABELING_ADD_CATEGORY:
            return [
                action.category,
                ...state
            ];
        case LABELING_UPDATE_CATEGORY:
            return state.map(category => {
                if (category.id == action.category.id) {
                    return action.category
                }
                return category;
            });
        case LABELING_REMOVE_CATEGORY:
            return state !== null ? state.filter(category => category.id !== action.categoryId ? category : false) : state;
        default:
            return state;
    }
}
