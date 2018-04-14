import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import * as actions from '../actions';
import * as api from '../api';


export default function* storiesSaga () {
    yield takeLatest(actions.REFRESH, refresh);
}

function* refresh () {
    try {
        yield fetchTopStoriesIfNeeded();
        const topStoryIds = yield select(state => state.topStoryIds);

        const selectedStoryIds = select10RandomStories(topStoryIds);
        yield fetchStoriesIfNotCached(selectedStoryIds);
        const selectedStories = yield select(state => {
            return selectedStoryIds.map(id => state.storiesById[id]);
        });

        const userIds = Object.keys(
            selectedStories.reduce((ids, story) => {
                ids[story.by] = true;
                return ids;
            }, {})
        );
        yield fetchUsersIfNotCached(userIds);

        yield put(actions.selectStories(selectedStoryIds));
    } catch (e) {
        console.error(e);
        yield put(actions.receivedErrors(e));
    }
}

function* fetchTopStoriesIfNeeded () {
    const hasStories = yield select(state => state.topStoryIds);

    if (!hasStories) {
        const topStoryIds = yield call(api.fetchTopStories);
        yield put(actions.fetchedTopStories(topStoryIds));
    }
}

function* fetchStoriesIfNotCached (ids) {
    const stories = yield select(state => state.storiesById);

    const notCachedStoryIds = ids.filter(id => !stories.hasOwnProperty(id));

    if (notCachedStoryIds.length > 0) {
        const newStories = yield all(
            notCachedStoryIds.map(id => call(api.fetchNewsItemById, id))
        );
        yield put(actions.fetchedStories(newStories));
    }
}

function* fetchUsersIfNotCached (ids) {
    const users = yield select(state => state.usersById);

    const notCachedUserIds = ids.filter(id => !users.hasOwnProperty(id));

    if (notCachedUserIds.length > 0) {
        const newUsers = yield all(
            notCachedUserIds.map(id => call(api.fetchUserById, id))
        );
        yield put(actions.fetchedUsers(newUsers));
    }
}


function getRandomInt (max, min = 0) {
    return Math.round(Math.random() * max) + min;
}

function select10RandomStories (arr) {
    const amount = 10;

    const storiesCopy = arr.slice();
    let i = 0;
    const retVal = [];

    while (i++ < amount) {
        const idx = getRandomInt(storiesCopy.length);
        retVal.push(storiesCopy.splice(idx, 1)[0]);
    }
    return retVal;
}
