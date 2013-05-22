(function () {
    "use strict";

    /**
     * Contains utilities for formatting strings.
     * @namespace valerie.formatting
     */
    valerie.formatting = {};

    // Shortcuts.
    var formatting = valerie.formatting;

    /**
     * Adds thousands separators to the given number string.
     * @memberof valerie.formatting
     * @param {string} numberString a string representation of a number
     * @param {string} thousandsSeparator the character to use to separate the thousands
     * @param {string} decimalSeparator the character used to separate the whole part of the number from its
     * fractional part
     * @return {string} the number string with separators added if required
     */
    formatting.addThousandsSeparator = function (numberString, thousandsSeparator, decimalSeparator) {
        var wholeAndFractionalParts = numberString.toString().split(decimalSeparator),
            wholePart = wholeAndFractionalParts[0];

        wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        wholeAndFractionalParts[0] = wholePart;

        return wholeAndFractionalParts.join(decimalSeparator);
    };

    /**
     * Pads the front of the given string to the given width using the given character.
     * @memberof valerie.formatting
     * @param {string} stringToPad the string to pad
     * @param {string} paddingCharacter the character to use to pad the string
     * @param {number} width the width to pad the string to
     * @return {string} the string padded, if required, to the given width
     */
    formatting.pad = function (stringToPad, paddingCharacter, width) {
        stringToPad = stringToPad.toString();

        if (stringToPad.length >= width) {
            return stringToPad;
        }

        return (new Array(width + 1 - stringToPad.length)).join(paddingCharacter) + stringToPad;
    };

    /**
     * Replaces placeholders in the given string with the given replacements.
     * @memberof valerie.formatting
     * @param {string} stringToFormat the string to format
     * @param {object|array} replacements a dictionary or array holding the replacements to use
     * @return {string} the formatted string with placeholders replaced where replacements have been specified
     */
    formatting.replacePlaceholders = function (stringToFormat, replacements) {
        if (replacements == null) {
            replacements = {};
        }

        return stringToFormat.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];

            if (replacement == null) {
                return match;
            }

            return replacement.toString();
        });
    };
})();
