import { ObjectiveType } from '@app/classes/objective/objective-type';

export const DEFAULT_PRIVATE_OBJECTIVE = {
    title: '',
    description: '',
    points: 0,
    type: ObjectiveType.PRIVATE,
    checked: false,
    done: false,
    code: -1,
};
