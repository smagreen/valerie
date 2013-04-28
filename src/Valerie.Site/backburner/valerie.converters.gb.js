// valerie.converters.gb
// - converters for types particular to Great Britain
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        helpers = converters.helpers;

    // + converters.pounds
    converters.pounds = {
        "formatter": function (value, format) {
            if (value === undefined || value === null) {
                return "";
            }

            if (format === undefined || format === null) {
                format = "";
            }

            value = value.toString();

            if (format.indexOf(",") !== -1) {
                value = helpers.addCommasToNumberString(value);
            }

            if (format.indexOf("£") !== -1) {
                value = "£" + value;
            }

            return value;
        },
        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            if (value.indexOf("£") === 0) {
                value = value.substring(1);
            }

            return converters.integer.parser(value);
        }
    };
})();
