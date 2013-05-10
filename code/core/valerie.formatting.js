// valerie.formatting
// - general purpose formatting functions
// - used by other parts of the valerie librar

/// <reference path="valerie.js"/>

/*jshint eqnull: true */
/*global valerie: false */

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

    // + formatting.replacePlaceholders
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

    // + formatting.pad
    formatting.pad = function (value, paddingCharacter, width) {
        value = value.toString();
        
        if (value.length >= width) {
            return value;
        }

        return (new Array(width + 1 - value.length)).join(paddingCharacter) + value;
    };
})();
