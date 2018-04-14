import * as actions from '../actions';


export default function rootReducer (state = {
    isFetching: false,
    storiesToShow: []
}, action) {
    switch (action.type) {
    case actions.REFRESH:
        return Object.assign({}, state, {
            isFetching: true,
            storiesById: state.storiesById || {},
            usersById: state.usersById || {},
            storiesToShow: state.storiesToShow || []
        });

    case actions.FETCHED_TOP_STORIES:
        return Object.assign({}, state, {
            topStoryIds: action.ids
        });

    case actions.FETCHED_STORIES:
        const newStories = action.stories.reduce((state, story) => {
            state[story.id] = story;
            return state;
        }, Object.assign({}, state.storiesById));

        return Object.assign({}, state, {
            storiesById: newStories
        });

    case actions.FETCHED_USERS:
        const newUsers = action.users.reduce((state, user) => {
            state[user.id] = user;
            return state;
        }, Object.assign({}, state.usersById));

        return Object.assign({}, state, {
            usersById: newUsers
        });

    case actions.SELECTED_STORIES:
        const stories = action.ids.map(id => {
            const story = state.storiesById[id];

            return {
                id,
                story,
                author: state.usersById[story.by]
            };
        });

        // sort ascendingly
        stories.sort((a, b) => a.story.score - b.story.score);

        return Object.assign({}, state, {
            isFetching: false,
            storiesToShow: stories
        });

    case actions.ERRORS:
        return Object.assign({}, state, {
            isFetching: false,
            errors: action.errors
        });

    default:
        return state;
    }
}
