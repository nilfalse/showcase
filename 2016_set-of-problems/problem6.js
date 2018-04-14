var done = defineProblem(6, 'rotate matrix');

function rotate90(matrix) {
    var l = matrix.length;
    var n = Math.ceil(l / 2);
    var tmp = null;
    for(var i = 0; i < n; i++) {
        for (var j = i; j < l - i - 1; j++) {
            tmp = matrix[i][j];
            matrix[i][j] = matrix[l - j - 1][i];
            matrix[l - j - 1][i] = matrix[l - i - 1][l - j - 1];
            matrix[l - i - 1][l - j - 1] = matrix[j][l - i - 1];
            matrix[j][l - i - 1] = tmp;
        }
    }
}

function printMatrix(matrix) {
    function printRow(row) {
        return '[ ' + row.join(', ') + ' ]';
    }
    console.debug(matrix.map(printRow).join('\n'));
}

var matrix = [
    [11, 12, 13, 14],     // => [41, 31, 21, 11]
    [21, 22, 23, 24],     // => [42, 32, 22, 12]
    [31, 32, 33, 34],     // => [43, 33, 23, 13]
    [41, 42, 43, 44]      // => [44, 34, 24, 14]
];

console.log('matrix:');
printMatrix(matrix);

console.log('rotate(matrix):');
rotate90(matrix);
printMatrix(matrix);

done();
