// valerie.passThrough
// - the pass through converter and rule
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function() {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        rules = valerie.rules = valerie.rules || {};

    // + converters.passThrough
    converters.passThrough = {
        "formatter": function(value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value.toString();
        },
        "parser": function(value) {
            return value;
        }
    };

    // + rules.PassThrough
    rules.PassThrough = function() {
        this.settings = {};
    };

    rules.PassThrough.prototype = {
        "test": function() {
            return rules.successfulTestResult;
        }
    };
})();
