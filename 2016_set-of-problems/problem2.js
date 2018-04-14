var done = defineProblem(2, 'traversing linked list');

// the output will exactly match result defined in task
function tree_to_string(parent) {
    var rv = '';
    if (parent.left) {
        rv += tree_to_string(parent.left) + ', ';
    }
    if (parent.right) {
        rv += tree_to_string(parent.right) + ', ';
    }
    return rv + parent.value;
}

var node2 = { value: 2, left: null, right: null };
var node4 = { value: 4, left: null, right: null };
var node6 = { value: 6, left: null, right: null };
var node8 = { value: 8, left: null, right: null };
var node3 = { value: 3, left: node2, right: node4 };
var node7 = { value: 7, left: node6, right: node8 };
var node5 = { value: 5, left: node3, right: node7 };

console.log(tree_to_string(node5));

done();
