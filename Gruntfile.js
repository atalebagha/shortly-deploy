module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        src: ['/public/temp/*.js'],
        force: true
      }
    },
    concat: {
       options: {
         separator: ';',
       },
       public: {
         src: 'public/client/*.js',
         dest: 'public/temp/app.js'
       }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'index.js',
      }
    },

    uglify: {
      options: {
          mangle: {
            except: ['jQuery', 'Backbone', 'handlebars', 'underscore']
          }
        },

        my_target: {
          files: {
            'public/dist/app.min.js': ['public/temp/app.js']
          }
        }
    },

    jshint: {
      files: [
        'public/client/*.js',
        'app/**/*.js',
        'Gruntfile.js',
        'index.js',
        'server.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'jshint',
          'concat',
          'uglify',
          'clean'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin'],
        options: {
          livereload: true,
        }
      }
    },

    upload: {
      tasks: ['build'],
    },
    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest', 'jshint'
  ]);

  grunt.registerTask('build', [ 'test', 'concat', 'uglify','cssmin','clean:build'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      var heroku = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'heroku'
      });
      heroku.stdout.pipe(process.stdout);
      heroku.stderr.pipe(process.stderr);
        // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      'concat', 'uglify','cssmin','clean:build'
    // add your deploy tasks here
  ]);


};
