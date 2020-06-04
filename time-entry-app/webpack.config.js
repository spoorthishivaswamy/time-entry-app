const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
var Dotenv = require("dotenv-webpack");
require("dotenv").config();

module.exports  = (env) => {
return {
    entry: './src/index.js',
    mode: 'development',
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/env"]
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                options: {minimize:true}
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    resolve: {extensions: ['*', '.js', '.jsx']},
    output: {
      path: path.resolve(__dirname, 'dist/'),
      publicPath: '/dist/',
      filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'public/'),
        port: 3000,
        publicPath: 'http://localhost:3000/dist/',
        hotOnly: true
    },
    // plugins: [new webpack.HotModuleReplacementPlugin()]
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: './index.html'
      }),
      new Dotenv({
      systemvars: true
    }),
    // new webpack.DefinePlugin({ 'process.env': JSON.stringify(dotenv.config().parsed) })
    ]
  }
};