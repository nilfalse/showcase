export const REFRESH = 'REFRESH';
export const FETCHED_TOP_STORIES = 'FETCHED_TOP_STORIES';
export const FETCHED_STORIES = 'FETCHED_STORIES';
export const FETCHED_USERS = 'FETCHED_USERS';
export const SELECTED_STORIES = 'SELECTED_STORIES';
export const ERRORS = 'ERRORS';

export function refresh () {
    return {
        type: REFRESH
    };
}

export function receivedErrors (errors) {
    return {
        type: ERRORS,
        errors
    };
}

export function fetchedTopStories (ids) {
    return {
        type: FETCHED_TOP_STORIES,
        ids
    };
}

export function fetchedStories (stories) {
    return {
        type: FETCHED_STORIES,
        stories
    };
}

export function fetchedUsers (users) {
    return {
        type: FETCHED_USERS,
        users
    }
}

export function selectStories (ids) {
    return {
        type: SELECTED_STORIES,
        ids
    };
}
