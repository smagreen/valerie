// valerie.formatting
// - general purpose formatting functions
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var formatting = valerie.formatting = valerie.formatting || {};

    // + format.replacePlaceholders
    formatting.replacePlaceholders = function (format, replacements) {
        if (replacements === undefined || replacements === null) {
            replacements = {};
        }

        return format.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];

            if (replacement === undefined || replacement === null) {
                return match;
            }

            return replacement.toString();
        });
    };
})();
