const storage = (function () {
    const log = getLogger('storage');

    function refresh () {
        let place, conditions, forecast;

        log('refresh');
        return Promise.resolve()
            .then(api.locate)
            .then(result => (place = result))

            .then(() => Promise.all([
                api.conditions(place),
                api.forecast(place)
            ]))
            .then(result => {
                conditions = result.shift();
                forecast = result.shift();
            })

            .then(() => {
                const result = {
                    place,
                    forecast,
                    conditions
                };

                return result;
            });
    }

    return {
        refresh: refresh,

        pull: cached(refresh, { minutes: 59 })
    };
}());
