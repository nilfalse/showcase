function extend(dest, src) {
	var k;
	for (k in src) {
		if (src.hasOwnProperty(k)) {
			dest[k] = src[k];
		}
	}
}

function Predicate(predicate, isNegative) {
	if (! (this instanceof Predicate)) {
		return new Predicate(predicate, isNegative);
	}
	this.predicate = predicate;
	if (isNegative) {
		this.negative = true;
	} else {
		this.not = new Predicate(predicate, !isNegative);
	}
	return this;
}

extend(Predicate.prototype, {
	valueOf: function() { return this.predicate; },
	to: function(comparator) {
		var rv;
		switch (comparator.operation) {
		case 'eq':
			rv = this.valueOf() === comparator.predicate.valueOf();
			break;
		default:
			throw new Error('Unexpected comparator operation "' + comparator.operation + '"');
			break;
		}
		return this.negative ? !rv : rv;
	}
});

function Operation(oper, predicate) {
	if (! (this instanceof Operation)) {
		return new Operation(oper, predicate);
	}
	this.operation = oper;
	this.predicate = new Predicate(predicate);
}

function expect(predicate) {
	return new Predicate(predicate);
}

function eq(predicate) {
	return new Operation(eq.name, predicate);
}

