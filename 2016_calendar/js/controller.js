function layOutDay (events) {
    var models = events.map(function (raw) {
        return new CalendarEventModel(raw);
    });

    var day = CalendarService.splitToRows(models).map(function (row) {
        return new CalendarRowModel(row);
    });

    new CalendarRootView(day).render(document.querySelector('.events'));
}
