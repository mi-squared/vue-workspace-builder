require('dotenv').config()

let base_path = '/interface/modules/custom_modules/vue-workspace-builder'
if (process.env.APP_BASE_URL) {
    base_path = process.env.APP_BASE_URL + base_path
}
if (process.env.NODE_ENV === 'production') {
    base_path = base_path + '/dist'
}

module.exports = {
    publicPath: base_path,
    devServer: {
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        proxy: 'http://cpr6-dev.test:8888'
    }
}
