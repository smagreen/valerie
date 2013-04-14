// valerie.converters
// - general purpose converters for use with valerie
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: false */
/// <reference path="valerie.core.js"/>

(function () {
    "use strict";

    var converters = valerie.converters;

    converters.integer = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }
            
            // ToDo: Change this very noddy, permissive implementation.
            var parsedValue = parseInt(value, 10);
            
            if (isNaN(parsedValue)) {
                return undefined;
            }

            return parsedValue;
        }
    };

    converters.string = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value;
        },

        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            return value;
        }
    };
})();

