function CalendarRootView (data) {
    this._data = data;
}

CalendarRootView.prototype.render = function CalendarRootView__render (root) {
    root.innerHTML = '';

    this._data.forEach(function (row) {
        row.stacks.forEach(function (stack, idx) {
            stack.forEach(function (eventModel) {
                var event = new CalendarEventView(eventModel);
                root.appendChild(event.render(idx, row.stacks.length));
            });
        });
    });
};
