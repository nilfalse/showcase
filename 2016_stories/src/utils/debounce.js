export default function debounce(fn, timeout, ctx = null) {
    var timeoutId = null;

    return function() {
        if (null !== timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        timeoutId = setTimeout(fn.bind(ctx, ...arguments), timeout);
    };
}
