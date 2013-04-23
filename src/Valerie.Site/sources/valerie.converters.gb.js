// valerie.converters.gb
// - converters for types particular to Great Britain
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */
var valerie = valerie || {};


(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {};

    // + converters.money
    converters.money = {
        "formatter": function (value, format) {
            if (value === undefined || value === null) {
                return "";
            }

            if (format === undefined || format === null) {
                format = "";
            }

            // ToDo: Change this very simple implementation.
            return format + value.toString();
        },
        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            value = value.replace("£", "");
            
            // ToDo: Change this very simple, permissive implementation.
            var parsedValue = parseFloat(value);

            if (isNaN(parsedValue)) {
                return undefined;
            }

            return parsedValue;
        }
    };
})();
