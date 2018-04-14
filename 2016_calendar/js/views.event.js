function CalendarEventView (model) {
    this._model = model;
}

CalendarEventView.prototype.totalWidth = 600;  // px
CalendarEventView.prototype.hourHeight =  60;  // px

CalendarEventView.prototype.render = function CalendarEventView__render (position, total) {
    var model = this._model;

    var container = document.createElement('li');
    container.className = 'events__item';

    container.style.top = this.getTop(model.start);
    container.style.left = this.getLeft(position, total);
    container.style.width = this.getWidth(total);

    // FIXME: better to get rid of markup from code
    container.innerHTML =
        '<div class="events__item-wrap" style="height: ' + this.getHeight(model.end - model.start) + ';">' +
        '<h2 class="events__item-headline">' + model.headline + '</h2>' +
        '<p class="events__item-location">' + model.location + '</p>' +
        '</div>';

    return container;
};

CalendarEventView.prototype.getTop = function CalendarEventView__getTop (start) {
    var minuteHeight = this.hourHeight / 60;
    return (start * minuteHeight) + 'px';
};

CalendarEventView.prototype.getLeft = function CalendarEventView__getLeft (position, total) {
    var width = this.totalWidth / total;
    return (position * width) + 'px';
};

CalendarEventView.prototype.getWidth = function CalendarEventView__getWidth (fraction) {
    return (this.totalWidth / fraction) + 'px';
};

CalendarEventView.prototype.getHeight = function CalendarEventView__getHeight (duration) {
    var minuteHeight = this.hourHeight / 60;
    return (duration * minuteHeight) + 'px';
};
