const path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    files: [
      'src/**/*.ts*',
      'test/**/*.ts*',
    ],
    preprocessors: {
      "test/**/*.ts*": ['webpack', 'sourcemap'],
      'src/**/*.ts*': ['webpack', 'karma-typescript', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.ts$/,
            include: [
              path.resolve(__dirname, 'src'),
              path.resolve(__dirname, 'test')
            ],
            exclude: [
              /node_modules/
            ],
            loader: 'awesome-typescript-loader',
          },
          {
            test: /\.tsx$/,
            include: [
              path.resolve(__dirname, 'src'),
              path.resolve(__dirname, 'test')
            ],
            exclude: [
              /node_modules/
            ],
            loader: 'awesome-typescript-loader',
          }
        ]
      },
      resolve: {
        modules: [
          'node_modules',
        ],
        extensions: ['.ts', '.tsx', '.js'],
      },
      externals: {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      mode: 'development'
    },
    webpackServer: {
      noInfo: true
    },
    concurrency: Infinity,
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
  });
};
