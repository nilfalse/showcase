module.exports = {
    files: [ './dist/**/*.{js,css}', './public/**/*.{html,htm,css,js}' ],
    server: {
        baseDir: ['public', 'dist'],
        routes: {
            '/node_modules': 'node_modules'
        },
        middleware: { 
            1: require('connect-history-api-fallback')({index: '/index.html'})
        }
    },
    reloadOnRestart: true
}
