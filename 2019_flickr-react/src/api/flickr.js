import * as jsonp from './_jsonp';

const FEED_URL = 'https://www.flickr.com/services/feeds/photos_public.gne';

const defaultParams = {
  format: 'json',
  tags: '',
};

export const getFeed = (tags = [], tagmode = 'all') => {
  const tagModeParam = tagmode === 'all'
    ? null
    : { tagmode };

  return jsonp.request(FEED_URL, {
    ...defaultParams,
    ...tagModeParam,
    tags: tags.join(','),
  });
}
