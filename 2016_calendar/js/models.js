function CalendarRowModel (events) {
    this.stacks = events.reduce(function (stacks, event) {
        var hasFoundStack = stacks.some(function (stack) {
            var lastEventInStack = stack[stack.length - 1];

            if (!event.isOverlapping(lastEventInStack)) {
                stack.push(event);
                return true;
            }
        });
        if (!hasFoundStack) {
            stacks.push([event]);
        }

        return stacks;
    }, []);
}


function CalendarEventModel (attrs) {
    if (!CalendarEventModel._lastId) {
        CalendarEventModel._lastId = 0;
    }
    this.eid = ++CalendarEventModel._lastId;

    this.start = attrs.start;
    this.end = attrs.end;

    this.headline = attrs.headline;
    this.location = attrs.location;
}

CalendarEventModel.prototype.isOverlapping = function CalendarEventModel__isOverlapping (other) {
    return this.start < other.end;
};
