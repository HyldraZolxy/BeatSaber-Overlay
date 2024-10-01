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
                    ecma: 2022,
                    mangle: {
                        toplevel: true
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