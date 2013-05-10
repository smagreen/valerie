module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "concat": {
            "core": {
                "src": [
                    "license.js",
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
        "uglify": {
            "build": {
                "options": {
                    "banner": '/* valeriejs - MIT license - (c) egrove Ltd (egrove.co.uk) */\n'
                },
                "files": {
                    "distribution/valerie-for-knockout-core.min.js": [
                        "build/valerie-for-knockout-core.js"
                    ],
                    "distribution/valerie-for-knockout.min.js": [
                        "build/valerie-for-knockout.js"
                    ],
                    "distribution/valerie-for-knockout-en-gb.min.js": [
                        "build/valerie-for-knockout-en-gb.js"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", [
        "concat:core",
        "concat:full",
        "concat:en-gb",
        "uglify"
    ]);
}
