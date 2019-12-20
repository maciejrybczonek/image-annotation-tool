import { Action } from '@ngrx/store';

function name(name: string): string {
    return '[LABELING] ' + name;
}

import { Picture, Label, Category } from '../../../shared/models';

export const
    LABELING_ADD_IMAGE = name('Add image'),
    LABELING_REMOVE_IMAGE = name('Remove image'),
    LABELING_ADD_LABEL = name('Add label'),
    LABELING_UPDATE_LABEL = name('Update label'),
    LABELING_REMOVE_LABEL = name('Remove label'),
    LABELING_SET_ACTIVE_TOOL = name('Set active tool'),
    LABELING_ADD_CATEGORY = name('Add category'),
    LABELING_UPDATE_CATEGORY = name('Update category'),
    LABELING_REMOVE_CATEGORY = name('Remove category');

export class LabelingAddImage implements Action {
    readonly type = LABELING_ADD_IMAGE;
	constructor(public image: Picture) { }
}

export class LabelingRemoveImage implements Action {
    readonly type = LABELING_REMOVE_IMAGE;
	constructor(public imageId: string) { }
}

export class LabelingAddLabel implements Action {
    readonly type = LABELING_ADD_LABEL;
	constructor(public label: Label) { }
}

export class LabelingUpdateLabel implements Action {
    readonly type = LABELING_UPDATE_LABEL;
	constructor(public label: Label) { }
}

export class LabelingRemoveLabel implements Action {
    readonly type = LABELING_REMOVE_LABEL;
	constructor(public labelId: string) { }
}

export class LabelingSetActiveTool implements Action {
    readonly type = LABELING_SET_ACTIVE_TOOL;
	constructor(public toolName: string) { }
}

export class LabelingAddCategory implements Action {
    readonly type = LABELING_ADD_CATEGORY;
	constructor(public category: Category) { }
}

export class LabelingUpdateCategory implements Action {
    readonly type = LABELING_UPDATE_CATEGORY;
	constructor(public category: Category) { }
}

export class LabelingRemoveCategory implements Action {
    readonly type = LABELING_REMOVE_CATEGORY;
	constructor(public categoryId: string) { }
}
