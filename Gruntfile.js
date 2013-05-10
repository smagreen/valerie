module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "clean": [
            "build",
            "distribution"
        ],
        "copy": {
            "build": {
                "files": [
                    {
                        "expand": true,
                        "cwd": "build",
                        "src": ["*.js"],
                        "dest": "distribution/"
                    }
                ]
            }
        },
        "concat": {
            "core": {
                "src": [
                    "license.js",
                    "code/core/valerie.js",
                    "code/core/valerie.validationResult.js",
                    "code/core/valerie.utils.js",
                    "code/core/valerie.formatting.js",
                    "code/core/valerie.passThroughConverter.js",
                    "code/core/valerie.knockout.extras.js",
                    "code/core/valerie.dom.js",
                    "code/core/valerie.knockout.js",
                    "code/core/valerie.knockout.bindings.js"
                ],
                "dest": "build/valerie-for-knockout-core.js"
            },
            "full": {
                "src": [
                    "build/valerie-for-knockout-core.js",
                    "code/full/valerie.numericHelper.js",
                    "code/full/valerie.converters.js",
                    "code/full/valerie.rules.js",
                    "code/full/valerie.knockout.fluent.converters.js",
                    "code/full/valerie.knockout.fluent.rules.js"
                ],
                "dest": "build/valerie-for-knockout.js"
            },
            "en-gb": {
                "src": [
                    "build/valerie-for-knockout.js",
                    "code/localisation/en-gb/core.js",
                    "code/localisation/en-gb/full.js",
                    "code/localisation/en-gb/valerie.converters.en-gb.js",
                    "code/localisation/en-gb/valerie.knockout.fluent.converters.en-gb.js"
                ],
                "dest": "build/valerie-for-knockout-en-gb.js"
            }
        },
        "jshint": {
            files: {
                src: [
                    "build/*.js"
                ]
            }
        },
        "uglify": {
            "options": {
                "banner": '/* valeriejs - MIT license - (c) egrove Ltd (egrove.co.uk) */\n'
            },
            "build": {
                "files": [
                    {
                        "expand": true,
                        "cwd": "distribution",
                        "src": "*.js",
                        "dest": "distribution/",
                        "ext": ".min.js"
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", [
        "clean",
        "concat:core",
        "concat:full",
        "concat:en-gb",
        "copy",
        "uglify",
        "jshint"
    ]);
}
