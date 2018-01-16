module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            src: {
                files: [
                    { src: 'server.js', dest: 'src/' },
                    { src: 'package.json', dest: 'src/' },
                    { cwd: 'Client/', expand: true, src: ['**/*.**'], dest: 'src/Client' },                   
                    { cwd: 'ServerCode/', expand: true, src: ['**/*.js'], dest: 'src/ServerCode' },
                    { cwd: 'ServerCode/', expand: true, src: ['**/*.json'], dest: 'src/ServerCode' },
                    { cwd: 'Entity/', expand: true, src: ['**/*.js'], dest: 'src/Entity' },
                    { cwd: 'Views/', expand: true, src: ['**'], dest: 'src/Views' }
                ]
            }
        },
        watch: {
            files: ['server.js', 'Client/**', 'ServerCode/*.js', 'Modal/*.js', 'Views/**'],
            tasks: ['copy:src']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['copy:src', 'watch']);
}