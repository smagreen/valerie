module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "clean": {
            "docs": [
                "latest/apidocs"
            ],
            "build": [
                "build"
            ]
        },
        "copy": {
            "updateLatest": {
                "files": [
                    {
                        "expand": true,
                        "cwd": "build",
                        "src": ["valerie*.js"],
                        "dest": "latest/code"
                    }
                ]
            },
            "updateRunner": {
                "files": [
                    {
                        "expand": true,
                        "cwd": ".grunt/grunt-contrib-jasmine",
                        "src": ["*"],
                        "dest": "code/tests/built/"
                    },
                    {
                        "src": ["_SpecRunner.html"],
                        "dest": "code/tests/built/SpecRunner.html"
                    },
                    {
                        "expand": true,
                        "cwd": "build",
                        "src": ["valerie*.js"],
                        "dest": "code/tests/built/"
                    }
                ]
            }
        },
        "concat": {
            "core": {
                "src": [
                    "code/valerie/core/valerie.namespace.js",
                    "code/valerie/core/valerie.utils.js",
                    "code/valerie/core/valerie.formatting.js",
                    "code/valerie/core/valerie.dom.js",
                    "code/valerie/core/valerie.koExtras.js",
                    "code/valerie/core/valerie.converters.js",
                    "code/valerie/core/valerie.validationResult.js",
                    "code/valerie/core/valerie.validationState.js",
                    "code/valerie/core/valerie.modelValidationState.js",
                    "code/valerie/core/valerie.propertyValidationState.js",
                    "code/valerie/core/ko.computed.fn.js",
                    "code/valerie/core/ko.observable.fn.js",
                    "code/valerie/core/ko.bindingHandlers.js",
                    "code/valerie/core/valerie.koBindingsHelper.js"
                ],
                "dest": "build/valerie-core.js"
            },
            "full": {
                "src": [
                    "build/valerie-core.js",
                    "code/valerie/full/valerie.numericHelper.js",
                    "code/valerie/full/valerie.converters.full.js",
                    "code/valerie/full/valerie.rules.js",
                    "code/valerie/full/valerie.propertyValidationState-fluentConverters.js",
                    "code/valerie/full/valerie.propertyValidationState-fluentRules.js"
                ],
                "dest": "build/valerie.js"
            },
            "en": {
                "src": [
                    "build/valerie.js",
                    "code/valerie/localisation/en/core-en.js",
                    "code/valerie/localisation/en/full-en.js"
                ],
                "dest": "build/valerie-en.js"
            },
            "en-gb": {
                "src": [
                    "build/valerie-en.js",
                    "code/valerie/localisation/en-gb/full-en-gb.js",
                    "code/valerie/localisation/en-gb/valerie.converters-en-gb.js",
                    "code/valerie/localisation/en-gb/valerie.propertyValidationState-fluentConverters-en-gb.js"
                ],
                "dest": "build/valerie-en-gb.js"
            },
            "en-us": {
                "src": [
                    "build/valerie-en.js",
                    "code/valerie/localisation/en-us/full-en-us.js"
                ],
                "dest": "build/valerie-en-us.js"
            }
        },
        "jade": {
            "samples": {
                "options": {
                    "pretty": true
                },
                "files": [
                    {
                        "cwd": "code/samples/jade",
                        "expand": true,
                        "src": ["*.jade"],
                        "dest": "code/samples",
                        "ext": ".html"
                    }
                ]
            }
        },
        "jasmine": {
            "build": {
                "src": "build/valerie-en-gb.js",
                "options": {
                    "keepRunner": true,
                    "specs": [
                        "code/tests/core/*.tests.js",
                        "code/tests/full/*.tests.js"
                    ],
                    "vendor": [
                        "code/tests/runnerScripts/ddr-ecma5-1.2.1-min.js",
                        "code/tests/runnerScripts/jasmine-tap.js",
                        "code/tests/runnerScripts/testling.js",
                        "code/thirdParty/html5shiv.js",
                        "code/thirdParty/json3.min.js",
                        "code/thirdParty/knockout-2.2.1.debug.js",
                        "code/thirdParty/jquery-1.9.1.min.js"
                    ]
                }
            }
        },
        "jshint": {
            "options": {
                "eqnull": true
            },
            "files": {
                "src": [
                    "build/*.js"
                ]
            }
        },
        "shell": {
            "docs": {
                "command": "jsdoc -c jsdoc.conf.json",
                "stdout": true,
                "stderr": true
            }
        },
        "sed": {
            "updateRunner1": {
                "pattern": /(\.\/)?.grunt\/grunt-contrib-jasmine\//g,
                "replacement": "",
                "path": "code/tests/built/SpecRunner.html"
            },
            "updateRunner2": {
                "pattern": /\.\/code\//g,
                "replacement": "../../",
                "path": "code/tests/built/SpecRunner.html"
            },
            "updateRunner3": {
                "pattern": /\.\/build\//g,
                "replacement": "",
                "path": "code/tests/built/SpecRunner.html"
            }
        },
        "uglify": {
            "options": {
                "banner": '/* valerie - MIT license - (c) egrove Ltd (egrove.co.uk) */\n'
            },
            "build": {
                "files": [
                    {
                        "expand": true,
                        "cwd": "build",
                        "src": "*.js",
                        "dest": "build/",
                        "ext": ".min.js"
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-sed");

    grunt.registerTask("default", [
        "build"
    ]);

    grunt.registerTask("concatAndHint", [
        "clean:build",
        "concat:core",
        "concat:full",
        "concat:en",
        "concat:en-gb",
        "concat:en-us",
        "jshint"
    ]);

    grunt.registerTask("build", [
        "tests",
        "copy:updateRunner",
        "sed:updateRunner1",
        "sed:updateRunner2",
        "sed:updateRunner3",
        "uglify"
    ]);

    grunt.registerTask("docs", [
        "clean:docs",
        "shell:docs"
    ]);

    grunt.registerTask("samples", [
        "jade:samples"
    ]);

    grunt.registerTask("tests", [
        "concatAndHint",
        "jasmine"
    ]);

    grunt.registerTask("updateLatest", [
        "build",
        "docs",
        "copy:updateLatest"
    ]);
};
