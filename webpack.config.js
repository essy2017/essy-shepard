'use strict';

var webpack   = require('webpack');
var path      = require('path');

module.exports = [
  {
    resolve: {
      extensions: ['.js', '.jsx']
    },

    entry: path.join(__dirname, 'index.jsx'),

    output: {
      filename: 'shepard.min.js'
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: ['node_modules'],
          use: [
            'babel-loader'
          ]
        }
      ]
    },

    mode: 'development',

    stats: {
      colors: true
    }
  }
];
