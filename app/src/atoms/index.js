
import { atom } from 'recoil';

export const routeTitleState = atom({
    key: 'routeState',
    default: 'Interview Prep Assistant',
});

export const assistantIdState = atom({
    key: 'assistantIdState',
    default: 'asst_XDtFo3J5Q7v6h63W7qojjM9J',
});
export const runState = atom({
    key: 'runState',
    default: undefined,
});