module.exports = function( grunt ) {

	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		/**
		 * Compile Coffee
		 */	
		coffee: {
			compile: {
				options: {
					sourceMap: true,
					bare: true
				},
				files: {
					'assets/coffee/output/admin.js': 'assets/coffee/admin.coffee',
					'assets/coffee/output/functions.js': 'assets/coffee/functions.coffee',
					'assets/coffee/output/responsive.js': 'assets/coffee/responsive.coffee'
				}
			}

		},

		/**
		 * Lint Coffee
		 */
	    coffeelint: {
			app: ['assets/coffee/functions.coffee', 'assets/coffee/responsive.coffee'],
			options: {
				'max_line_length': {
					'level': 'ignore'
				}
			}
	    },

		/**
		 * Compile SASS to CSS 
		 */	
		sass: {
			options: {
				style: 'nested'
			},
			dist: {
				files: {
					'assets/sass/output/admin.css': 'assets/sass/admin.scss',
					'assets/sass/output/editor.css': 'assets/sass/editor.scss',
					'assets/sass/output/style.css': 'assets/sass/style.scss'
				}
			}
		},

		scsslint: {
			allFiles: [
				'assets/sass/*.scss',
			],
			options: {
				config: 'assets/sass/lint/.scss-lint.yml',
				reporterOutput: 'assets/sass/lint/scss-lint-report.xml',
				colorizeOutput: true,
				force: true
			},
		},

		/**
		 * Watch things
		 */
		watch: {
			sass: {
				files: [
					'assets/sass/*',
					'assets/sass/lib/*'
				],
				tasks: [ 'sass' ],
				options: {
					livereload: true
				},
			},
			scsslint: {
				files: [
					'assets/sass/*'
				],
				tasks: [ 'scsslint' ],
				options: {
					livereload: true
				},
			},
			coffee: {
				files: [
					'assets/coffee/*'
				],
				tasks: [ 'coffee' ],
				options: {
					livereload: true
				},
			},
			coffeelint: {
				files: [
					'assets/coffee/*'
				],
				tasks: [ 'coffeelint' ],
				options: {
					livereload: true
				},				
			}
		}

	} );

	/**
	 * Load tasks
	 */
	grunt.loadNpmTasks( 'grunt-contrib-coffee' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-coffeelint' );
	grunt.loadNpmTasks( 'grunt-scss-lint' );

	/**
	 * Run tasks
	 */
	grunt.registerTask( 'default', [ 'coffee', 'coffeelint', 'sass', 'scsslint', 'watch' ] );

};