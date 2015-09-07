// Стандартный экспорт модуля в nodejs
module.exports = function(grunt) {

    // Инициализация конфига GruntJS (конфигурация проекта)
    grunt.initConfig({

        // package.json
        pkg: grunt.file.readJSON('package.json'),

        // Переменные каталогов проекта
        project: {
            app: ['public'],
            assets: ['<%= project.app %>/assets'],
            css: ['<%= project.assets %>/sass/main.scss'],
            libs: ['<%=project.app %>/libs'],
            js: ['<%= project.assets %>/js']
        },

        // Настройки сервера
        express: {
            dev: {
                options: {
                    script: 'server.js'
                }
            }
        },

        // Склеивание JS файлов
        concat: {
            dist: {
                src: [
                    '<%= project.js %>/*.js',
                    '<%= project.libs %>/*.js'
                ],
                dest: '<%= project.js %>/build/production.js'                  // production
            }
        },

        // Сжатие общего JS файла
        uglify: {
            // options: {
            //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            // },
            build: {
                src: '<%= project.js %>/build/production.js',                  // production
                dest: '<%= project.js %>/build/production.min.js'              // production min
            }
        },

        // SASS
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    require: 'susy'
                },
                files: {
                    '<%= project.assets %>/css/main.css': '<%= project.css %>'
                }
            }
        },

        // Autoprefixer
        autoprefixer: {

            options: {
                browsers: ['> 1%', 'last 2 versions', 'ie 9']
            },

            single_file: {
                src: '<%= project.assets %>/css/build/allscss.css',
                dest: '<%= project.assets %>/css/build/allscss-autoprefixer.css'
            }

        },

        // Минимизация CSS
        cssmin: {
            combine: {
                files: {
                    '<%= project.assets %>/css/build/production.min.css': [
                        '<%= project.assets %>/css/build/allscss-autoprefixer.css'
                    ]
                }
            }
        },

        // Слежение за изменениями        
        watch: {
            css: {
                files: [
                    '<%= project.assets %>/sass/{,*/}*.{scss,sass}'
                ],
                tasks: ['sass'],
                options: {
                    spawn: false,
                }
            },
            scripts: {
                files: [
                    '<%= project.js %>/*.js',
                    '<%= project.libs %>/*.js'
                ],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                }
            }
        }

    });

    // Загрузка модулей, которые предварительно установлены
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Эти задания будут выполнятся сразу после команды grunt
    grunt.registerTask('default', ['express', 'sass', 'watch']);

};