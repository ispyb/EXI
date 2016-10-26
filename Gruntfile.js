/*jshint strict:false */
"use strict";

module.exports = function(grunt) {
   var config = {
		    dustjs: {},
   };
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      yuidoc: {
		    compile: {
		      name: '<%= pkg.name %>',
		      description: '<%= pkg.description %>',
		      version: '<%= pkg.version %>',
		      url: '<%= pkg.homepage %>',
		      options: {
			paths: 'js/',
			outdir: 'documentation'
		      }
		    }
	  },
      
    
    
    
	  concat : {
		  prod:{
			  files : {
				 'min/exi.js' 		            : [ "js/dust/**/*js", "js/core/**/*js"],  
                 'min/exi.mx.js' 		        : ["js/mx/**/*js"], 
                 'min/exi.saxs.js' 		        : ["js/saxs/**/*js"],           				
				 'min/bower_components.min.js'  : [ 
								                    "bower_components/jquery/dist/jquery.min.js",
                                                    "bower_components/lightbox2/dist/js/lightbox.min.js",
                                                    "bower_components/jquery-lazy/jquery.lazy.min.js", 
                                                    "bower_components/dustjs-linkedin/dist/dust-full.min.js",
                                                    "bower_components/dustjs-helpers/dist/dust-helpers.min.js",
                                                    "bower_components/lodash/lodash.js",
                                                    'bower_components/lightbox2/dist/js/lightbox.js',
                                                    "bower_components/Snap.svg/dist/snap.svg-min.js",
                                                    "bower_components/vis/dist/vis.min.js",		  
                                                    "bower_components/dygraphs/dygraph-combined.js", 
                                                    "bower_components/handsontable/dist/handsontable.full.min.js",
                                                    "bower_components/bootstrap/dist/js/bootstrap.js",
                                                    "bower_components/bootstrap-year-calendar/js/bootstrap-year-calendar.min.js",
                                                    "bower_components/moment/min/moment.min.js",  
                                                    "bower_components/pathjs-amd/dist/path.min.js",                                                    
                                                    "bower_components/exi-ui-utils/min/exi-ui-utils.min.js",
                                                    "bower_components/ispyb-js-api/min/ispyb-js-api.min.js",
                                                    "bower_components/exi-ui-viz/min/exi-ui-viz.min.js"                                                    								  								    								 
                ]
			  }
		  }
	  },
	  uglify : {
		  prod:{				
			  options: {},
			  files : {
				   'min/exi.min.js' 		: [				 
				                   		    'min/exi.js', 
                                            'min/exi.mx.js',
				                   		    'min/precompiled.templates.min.js'
				                   		   ],
                   'min/exi.saxs.min.js' 		: [				 
				                   		    'min/exi.js', 
                                            'min/exi.saxs.js',
				                   		    'min/precompiled.templates.min.js'
				                   		   ],                           
                  'min/lightbox.js' 		: [				 
				                   		    'bower_components/lightbox2/dist/js/lightbox.js'
				                   		    
				                   		   ],                            
			  }
		  }
	  },
	  cssmin: {
		 prod:{
			  options: {
			      shorthandCompacting: true,
			      roundingPrecision: -1
			  },
			    files: {
			          'min/exi.min.css': [                
                                            'bower_components/bootstrap/dist/css/bootstrap.min.css',                              
			                              	'css/templatelist.css', 
			                              	'css/beamlinesessionbox.css', 			                              	
			                              	'bower_components/vis/dist/vis.css',
                                            'bower_components/handsontable/dist/handsontable.full.css',                                             
			                              	'css/dygraph-custom.css', 
			                              	'css/exi.css', 
			                              	'css/calendar.css', 
			                              	'css/menu/mainmenu.css', 
			                              	'css/override.css', 
                                            'css/grid.css', 
                                            'bower_components/lightbox2/dist/css/lightbox.css',
                                            'bower_components/bootstrap-year-calendar/css/bootstrap-year-calendar.min.css'
                                            ]
			    }
		}
	},
	jshint: {
		 options: {
 		      reporter: require('jshint-stylish'),
		      jshintrc : '.jshintrc'
		 },
		 prod: [ 'js/core/**/*.js', 'js/mx/**/*.js', 'js/saxs/**/*.js']
	},
    plato: {
                  all : {
                    options : {
                    complexity : {
                        logicalor : true,
                        switchcase : true,
                        forin : true,
                        trycatch : true
                    }
                    },
                    files: {
                            'reports/all': ['js/**/*.js'],                           
                    }
                },
                mx: {
                    options : {
                    complexity : {
                        logicalor : true,
                        switchcase : true,
                        forin : true,
                        trycatch : true
                    }
                    },
                    files: {
                            'reports/mx': ['js/mx/**/*.js'],                           
                    }
                },
                saxs: {
                    options : {
                    complexity : {
                        logicalor : true,
                        switchcase : true,
                        forin : true,
                        trycatch : true
                    }
                    },
                    files: {
                            'reports/saxs': ['js/saxs/**/*.js'],                           
                    }
                },
                core: {
                    options : {
                    complexity : {
                        logicalor : true,
                        switchcase : true,
                        forin : true,
                        trycatch : true
                    }
                    },
                    files: {
                            'reports/core': ['js/core/**/*.js'],                           
                    }
                }
    },
	includeSource: {
	    	options: {
		      basePath: '',
		      baseUrl: '../'
		},
		dev: {
		      files: [{
		    	  		'saxs/dev.html': 'saxs/index.tpl.html'
		      },{
		    	  		'mx/dev.html'  : 'mx/index.tpl.html'
		      }]
		}
	},
	watch: {
	  scripts: {
		files: ['css/**/*css','templates/**/*js'],
		tasks: ['dev'],
		options: {
		  interrupt: true,
		},
	  },
	},
	 wiredep: {
	      target: {
	                    src: ['mx/dev.html', 'saxs/dev.html'], // point to your HTML file.
	      }
	},
	dustjs: {
	    compile: {
	      files: {
	                    'min/precompiled.templates.min.js': ['templates/**/*js']
	      }
	    }
	  }
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-include-source');  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-dustjs');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  /** TASKS */
  grunt.task.registerTask('doc', ['yuidoc:compile']);
  grunt.task.registerTask('report', ['plato:prod']);
  grunt.task.registerTask('default', [ 'dustjs', 'jshint:prod' ,  'concat:prod', 'uglify:prod', 'cssmin:prod', 'yuidoc:compile']);
  grunt.task.registerTask('dev', ['dustjs','includeSource:dev', 'cssmin:prod', 'wiredep']);
  
};
