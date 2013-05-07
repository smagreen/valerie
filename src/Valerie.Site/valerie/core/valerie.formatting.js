// valerie.formatting
// - general purpose formatting functions
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*jshint eqnull: true */

var valerie = valerie || {};

(function () {
    "use strict";

    var formatting = valerie.formatting = valerie.formatting || {};

    // + formatting.addThousandsSeparator
    formatting.addThousandsSeparator = function (numberString, thousandsSeparator, decimalSeparator) {
        var wholeAndFractionalParts = numberString.toString().split(decimalSeparator),
            wholePart = wholeAndFractionalParts[0];

        wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        wholeAndFractionalParts[0] = wholePart;

        return wholeAndFractionalParts.join(decimalSeparator);
    };

    // + format.replacePlaceholders
    formatting.replacePlaceholders = function (format, replacements) {
        if (replacements == null) {
            replacements = {};
        }

        return format.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];

            if (replacement == null) {
                return match;
            }

            return replacement.toString();
        });
    };
})();
