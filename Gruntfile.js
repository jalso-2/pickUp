const grunt = require('grunt');
require('load-grunt-tasks')(grunt);

grunt.initConfig({
  clean: ['dist/**'],
  babel: {
    options: {
      sourceMap: true,
      presets: ['es2015'],
    },
    dist: {
      // http://rockyj.in/2015/05/24/es6_with_babel_grunt.html
      files: [{
        expand: true,
        cwd: 'src',
        src: ['server/**/*.js'],
        dest: 'dist',
        ext: '.js',
      }],
    },
  },
  shell: {
    devServer: {
      command: 'npm run dev',
    },
    prodServer: {
      command: 'npm start',
    },
  },
  watch: {
    scripts: {
      files: 'src/**/*.js',
      tasks: ['default'],
      options: {
        debounceDelay: 500,
      },
    },
  },
  eslint: {
    options: {
      ignorePattern: 'src/client/bower_components/**/*.js',
    },
    src: ['src/server/**/*.js', 'src/client/app/**/*.js'],
  },
});

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-contrib-watch');
// grunt.loadNpmTasks('grunt-contrib-eslint');
grunt.loadNpmTasks('gruntify-eslint');

grunt.registerTask('prod', [
  'clean',
  'eslint',
  'babel',
  'shell:prodServer',
]);

grunt.registerTask('dev', [
  'clean',
  'eslint',
  'babel',
  'shell:devServer',
]);

grunt.registerTask('bypass', [
  'clean',
  'babel',
  'shell:prodServer',
]);
