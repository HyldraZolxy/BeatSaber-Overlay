const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    context: __dirname + "/js",
    entry: "./init.js",
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 2015,
                    mangle: {
                        toplevel: true,
                        properties: true
                    },
                    compress: {
                        drop_console: false
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ],
    },
};