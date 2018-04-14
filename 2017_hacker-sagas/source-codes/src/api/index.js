function request (url) {
    return fetch(url).then(r => r.json());
}


export function fetchTopStories () {
    return request('https://hacker-news.firebaseio.com/v0/topstories.json');
}

export function fetchNewsItemById (id) {
    return request(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
}

export function fetchUserById (id) {
    return request(`https://hacker-news.firebaseio.com/v0/user/${id}.json`);
}
