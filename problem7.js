var done = defineProblem(7, 'math sign between 1 to 9 to equal 100');

var signs = ['+', '-', ''];

var combinations = [];
signs.forEach(function(sign1) {
    signs.forEach(function(sign2) {
        signs.forEach(function(sign3) {
            signs.forEach(function(sign4) {
                signs.forEach(function(sign5) {
                    signs.forEach(function(sign6) {
                        signs.forEach(function(sign7) {
                            signs.forEach(function(sign8) {
                                combinations.push(
                                    '1' + sign1 + '2' + sign2 + '3' + sign3 +
                                    '4' + sign4 + '5' + sign5 + '6' + sign6 +
                                    '7' + sign7 + '8' + sign8 + '9');
                            });
                        });
                    });
                });
            });
        });
    });
});

combinations.filter(function(combination) {
    var fn = new Function('return ' + combination);
    if (100 === fn()) {
        console.log('100 = ' + combination);
    }
});

done();
