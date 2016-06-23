var done = defineProblem(1, 'Array#duplicate()');

Array.prototype.duplicate = function duplicate() {
    this.push.apply(this, this);
    return this;
};

var list = [1, 2, 3, 4];
list.duplicate();
console.log(list);

done();
