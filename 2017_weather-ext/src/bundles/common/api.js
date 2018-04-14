const api = (function () {
    const log = getLogger('api'),
          // FIXME replace with real API key below:
          urlPrefix = 'http://api.wunderground.com/api/{WUNDERGROUND_API_KEY}/';

    function request (url) {
        return fetch(urlPrefix + url)
            .then(response => response.json())
            .then(json => {
                log(url, json);
                return json;
            });
    }

    function makePlace (location) {
        return {
            l: location.l,
            country: location.country_name,
            city: location.city,
            lat: location.lat,
            lon: location.lon
        };
    }

    function makeConditions (conds) {
        const result = {
            icon: {
                type: conds.icon,
                url: conds.icon_url
            },
            temp: {
                c: conds.temp_c,
                f: conds.temp_f
            },
            feelslike: {},
            dewpoint: {
                c: conds.dewpoint_c,
                f: conds.dewpoint_f
            },
            pressure: {
                in: conds.pressure_in,
                mb: conds.pressure_mb
            },
            wind: {
                type: conds.wind_string,
                degrees: conds.wind_degrees,
                dir: conds.wind_dir,
                kph: conds.wind_gust_kph,
                mph: conds.wind_gust_mph
            }
        };

        if (Math.round(result.temp.c) !== parseInt(conds.feelslike_c, 10)) {
            result.feelslike.c = conds.feelslike_c;
        }
        if (Math.round(result.temp.f) !== parseInt(conds.feelslike_f, 10)) {
            result.feelslike.f = conds.feelslike_f;
        }

        return result;
    }

    return {
        locate () {
            return request('geolookup/q/autoip.json')
                .then(json => json.location)
                .then(makePlace);
        },

        lookup (lat, lon) {
            return request('geolookup/q/' + lat + ',' + lon + '.json');
        },

        conditions (place) {
            return request('conditions' + place.l + '.json')
                .then(json => json.current_observation)
                .then(makeConditions);
        },

        forecast (place) {
            return request('forecast' + place.l + '.json')
                .then(json => json.forecast.simpleforecast.forecastday);
        }
    };
}());
