/**
 * sails hook for gengo.js
 */
module.exports = function (sails) {
  var _ = require('lodash'),
      gengo,
      core = require('gengojs'),
			pack = require('gengojs-default-pack'),
      domain = require('domain');
  return {
    defaults:{
      gengo: {
        backend:{
          directory: '/config/locales/',
		  		extension: '.json'
        },
        header:{
          "supported":['en', 'es', 'fr', 'de', 'ja'],
          "default": 'en-US'
        }
      }
    },
    routes:{
      before:{
        'all /*':function localize (req, res, next){
          gengo(req, res, next);
        }
      }
    },
	// Initalize gengojs
    initialize: function (next) {
			function debug(level){
        var i18n = sails.config.i18n;
        var enabled = i18n.debug ? i18n.debug.enabled : true, 
            namespaces = i18n.debug ? i18n.debug.namespaces : undefined;
        if(enabled !== false)
  				return ' ' + (namespaces ||
  					[
  						'core',
  						'parser', 
  						'router', 
  						'api', 
  						'localize', 
  						'header', 
  						'backend'
  					]).map(function(item){
  					return 'gengo.' + item + ':' + level;
  				}).join(' ');
        else return '';
  			}
      		// Hackily include gengo's debugger
			var debugLevel = process.env.DEBUG || '';
			switch (sails.config.log.level) {
				case 'silly':
				case 'verbose':
				case 'debug':
					debugLevel += debug(sails.config.log.level);
					break;
				case 'info':
					debugLevel += debug(sails.config.log.level);
					break;
				case 'blank':
					break;
				case 'warn':
					debugLevel += debug(sails.config.log.level);
					break;
				case 'error':
					debugLevel += debug(sails.config.log.level);
					break;
				case 'crit':
				case 'silent':
					break;
				default:
					break;
			}
		process.env.DEBUG = debugLevel;
		domain.create()
				// Catch
				.on('error', function(error) {
					sails.log.error(error);
				})
				// Try
				.run(function() {
					gengo = core(_.defaultsDeep(sails.config.i18n || {}, {
						backend:{
							directory: sails.config.appPath + sails.config.gengo.backend.directory,
							extension: sails.config.gengo.backend.extension
						},
						header:{
							supported:sails.config.gengo.header.supported,
							"default": sails.config.gengo.header.default
						}
					}), (function(){
						var plugins = sails.config.i18n.plugins;
						if(_.isFunction(plugins))
							return plugins();
						if(_.isArray(plugins))
							return plugins;
						return pack();
					})());
					// Clone gengo's API
					var api = core.clone();
          sails.gengo = api;
          _.forOwn(api, function (value, key) {
            sails[key] = value;
          });
				});
      return next();
    }
  };
};