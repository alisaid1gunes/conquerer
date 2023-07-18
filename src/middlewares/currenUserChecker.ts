import {Action} from 'routing-controllers';

export function currentUserChecker(action: Action) {

    const user = action.request.user

    return user;
}