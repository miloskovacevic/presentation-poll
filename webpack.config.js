/**
 * Created by Milos on 11/29/2015.
 */

module.exports = {
    entry: "./app-client.js",
    output: {
        filename: "public/bundle.js"
    },
    module: {
        loaders: [
            {
                exclude: /(node_modules | app-server.js)/,
                loader: 'babel',
                query:
                {
                    presets:['react']
                }
            }
        ]
    }
};
