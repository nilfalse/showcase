var done = defineProblem(3, 'breadth-first (queued) traversing of linked list');

var queue = [];

function tree_to_string_breadth(parent) {
    var rv = '';
    if (parent.left) {
        queue.push(parent.left);
    }
    if (parent.right) {
        queue.push(parent.right);
    }
    while(queue.length) {
        rv += ', ' + tree_to_string_breadth(queue.shift());
    }
    return parent.value + rv;
}

var node2 = { value: 2, left: null, right: null };
var node4 = { value: 4, left: null, right: null };
var node6 = { value: 6, left: null, right: null };
var node8 = { value: 8, left: null, right: null };
var node3 = { value: 3, left: node2, right: node4 };
var node7 = { value: 7, left: node6, right: node8 };
var node5 = { value: 5, left: node3, right: node7 };

console.log(tree_to_string_breadth(node5));

done();
