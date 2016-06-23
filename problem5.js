var done = defineProblem(5, 'spy(fn)');

function create_spy_fn(fn) {
    return function decorated() {
        if (!decorated.hasOwnProperty('callCount')) {
            decorated.callCount = 0;
        }
        decorated.callCount++;
        return fn.apply(this, arguments);
    };
}

var spiedObj = {
    method: function(arg1, arg2) {
        return arg1 + arg2;
    }
}

function spiedFn(arg1, arg2, arg3) {
    return arg1 + arg2 + arg3;
};

spiedObj.method = create_spy_fn(spiedObj.method);
var decoratedFn = create_spy_fn(spiedFn);

var i;
i = 42;
while (i--) {
    console.log('spiedObj.method(1, 2) ===', spiedObj.method(1, 2));
}
i = 7;
while (i--) {
    console.log('spiedFn(1, 2, 3) ===', decoratedFn(1, 2, 3));
}

console.log('spiedObj.method() invoked', spiedObj.method.callCount, 'times');
console.log('spiedFn() invoked', decoratedFn.callCount, 'times');

done();
