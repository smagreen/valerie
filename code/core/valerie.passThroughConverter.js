// valerie.passThroughConverter
// - the pass through converter
// - used by other parts of the valerie library

/// <reference path="valerie.js"/>
    
/*jshint eqnull: true */
/*global valerie: false */

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {};

    // + converters.passThrough
    converters.passThrough = {
        "formatter": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            return value;
        }
    };
})();
