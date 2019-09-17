module.exports = {
    publicPath: './',
    productionSourceMap: false,
    lintOnSave: false,
    devServer: {
        port: 8080,
        https:false,
        hotOnly: false,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://home.yufengtek.com/',
               /*  target: 'http://home.yufengtek.com/', */
                changeOrigin: true
            }
        }
    }
}