module.exports = function(grunt){
  grunt.initConfig({
    copy: {
    },
    _clean: {
      tmp: ['tmp']
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.renameTask('clean', '_clean');

  grunt.registerTask('default', ['copy', '_clean:tmp']);
  grunt.registerTask('clean', ['_clean']);
};