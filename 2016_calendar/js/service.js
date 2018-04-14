function CalendarService () {}

CalendarService.splitToRows = function CalendarService__splitToRows (models) {
    var events = models.slice().sort(function (a, b) {
        return a.start - b.start;
    });

    return events.reduce(function (rows, model) {
        var row = rows[rows.length - 1] || [];
        var overlapsCurrentRow = row.some(model.isOverlapping.bind(model));

        if (overlapsCurrentRow) {
            row.push(model);
        } else {
            rows.push([model]);
        }

        return rows;
    }, []);
};
