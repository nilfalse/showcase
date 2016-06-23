var done = defineProblem(4, 'run_parallel(tasks)');

function run_parallel(tasks, var_arg) {
    var that = this;
    var args = [].slice(tasks, 1);
    return Promise.all(tasks.map(function(task) {
        try {
            return task.apply(that, args)
            .then(function(result) {
                return { value: result, success: true };
            }, function(err) {
                return { value: err, success: false };
            });
        } catch (o_O) {
            return { value: o_O, success: false };
        }
    }));
}

/**
 * Creates syntetic asyncronous task.
 * @param {Number} timeout measured in seconds
 * @param {Boolean} [mustThrow] indicates whether genereted task should eventually reject
 * @returns {Function} syntetic task function which just resolves or rejects after specified timeout
 */
function createAsyncTask(timeout, mustThrow) {
    var taskId = (createAsyncTask._lastTaskId || 0) + 1;
    createAsyncTask._lastTaskId = taskId;

    return function task() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var taskName = 'task ' + taskId;
                if (mustThrow) {
                    console.error('async ' + taskName + ' done');
                    reject('rejected value of ' + taskName);
                } else {
                    console.debug('async ' + taskName + ' done');
                    resolve('resolved value of ' + taskName);
                }
            }, timeout * 1000);
        });
    };
}

var tasks = [
    createAsyncTask(1.2, true),
    createAsyncTask(1.),
    createAsyncTask(1.5)
];

run_parallel(tasks)
    .then(function(total) {
        function val(task) {
            return task.value;
        }

        var erroneous = total.filter(function(task) {
            return !task.success;
        });
        var successful = total.filter(function(task) {
            return task.success;
        });

        console.log('All tasks have finished.');
        console.log('Here are total results (sorted):', total.map(val));
        console.log('Here are rejected only tasks results:', erroneous.map(val));
        console.log('Here are resolved only tasks results:', successful.map(val));
    }).then(done);
