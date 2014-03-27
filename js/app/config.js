require.config({
  paths: {
    // backbone: '../../bower_components/backbone/backbone',
    jquery: '../vendor/jquery',
    'jquery.gmap3': '../vendor/jquery.gmap3',
    quo : '../vendor/quo.debug',
    lungo : '../vendor/lungo',
    handlebars: '../vendor/handlebars',
    // 'handlebars': '../vendor/handlebars.runtime',
    underscore: '../vendor/underscore',
    async: '../vendor/async',
  },
  shim: {
    jquery: {
      exports: 'jQuery'
    },
    'jquery.gmap3': {
      deps: [
        'jquery'
      ]
    },
    quo: {
      exports: '$$'
    },
    lungo : {
      deps : [
        'quo'
      ],
      exports : 'Lungo'
    },
    underscore: {
      exports: '_'
    },
    // backbone: {
    //   deps: [
    //     'jquery',
    //     'underscore'
    //   ],
    //   exports: 'Backbone'
    // },
    handlebars: {
      exports: 'Handlebars'
    }
  }
});

/* Require the initial module */
require(['app']);