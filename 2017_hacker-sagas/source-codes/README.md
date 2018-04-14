# Hacker News
## Description

Demo: [nilfalse.github.io/showcase/hacker-sagas](https://nilfalse.github.io/showcase/hacker-sagas/)

List of Hacker News, utilizing the open _hacker news_ API provided by Ycombinator.

Fetches random 10 stories from the list of Top Stories, then presents these stories sorted _by story score_ ascendingly.

Uses following endpoints:
- https.//hacker-news.firebaseio.com/v0/topstories.json
- https.//hacker-news.firebaseio.com/v0/item/[id].json
- https.//hacker-news.firebaseio.com/v0/user/[id].json

Every item includes the following content:
- Story title
- Story URL
- Story timestamp
- Story score
- Author id (screen name)
- Author karma score

Written in React with Redux where all side-effects put into redux-saga.

## Development

Get started with:

    npm install
    npm start

Then point your browser to [localhost:3000](http://localhost:3000/).

## Deploying

In order to get production build of the code run:

    npm run build

Your bundle of static code will then appear in `./build/` subfolder.

That folder can then be deployed to GitHub Pages and the likes.

