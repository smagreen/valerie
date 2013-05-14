// valerie.converters.en-gb
// - additional converters for the en-gb locale

/// <reference path="../../core/valerie.js"/>
/// <reference path="../../core/valerie.formatting.js"/>

/*jshint eqnull: true */
/*global valerie: false */

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        postcodeExpression = /^([A-Z][A-Z]?)((?:[0-9][A-Z])|(?:[0-9]{1,2}))\s*([0-9])([A-Z][A-Z])$/i;
    
    // + converters.postcode
    converters.postcode = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value;
        },
        "parse": function (value) {
            if (value == null) {
                return null;
            }

            var matches = value.match(postcodeExpression);

            if (matches == null) {
                return null;
            }

            return (matches[1] + matches[2] + " " + matches[3] + matches[4]).toUpperCase();
        }
    };
})();
