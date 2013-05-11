describe("formatting", function () {
    var formatting = valerie.formatting;

    describe("addThousandsSeparator", function () {
        var addThousandsSeparator = formatting.addThousandsSeparator;

        it("should add separators for integer strings", function () {
            expect(addThousandsSeparator("1000", ",", ".")).toEqual("1,000");
        });

        it("should not add separators for integer strings < 1000", function () {
            expect(addThousandsSeparator("999", ",", ".")).toEqual("999");
        });

        it("should add separators for float strings", function () {
            expect(addThousandsSeparator("1000.99", ",", ".")).toEqual("1,000.99");
        });

        it("should work for strings already containing separators", function () {
            expect(addThousandsSeparator("1,000.99", ",", ".")).toEqual("1,000.99");
        });

        it("should work with different thousands and decimal separators", function () {
            expect(addThousandsSeparator("1000.99", ",", ".")).toEqual("1,000.99");
            expect(addThousandsSeparator("1000,99", ".", ",")).toEqual("1.000,99");
        });
    });

    describe("pad", function () {
        var pad = formatting.pad;

        it("should pad a string to the desired width", function () {
            expect(pad("1", "0", 4)).toEqual("0001");
            expect(pad("1", "0", 2)).toEqual("01");
        });

        it("should stringify a value and pad the string to the desired width", function () {
            expect(pad(1, "0", 4)).toEqual("0001");
            expect(pad(1, "0", 2)).toEqual("01");
        });

        it("should stringify a value and return the string if it is wider than the desired width", function () {
            expect(pad("12345", "0", 4)).toEqual("12345");
            expect(pad(12345, "0", 4)).toEqual("12345");
        });
    });

    describe("replacePlaceholders", function () {
        var replacePlaceholders = formatting.replacePlaceholders,
            formatStringWithNumbers = "{0} {1} {2}",
            formatStringWithAlphaNumerics = "{0} {1} {z}";

        it("should return the original string if replacements are not specified", function () {
            expect(replacePlaceholders(formatStringWithNumbers))
                .toEqual(formatStringWithNumbers);

            expect(replacePlaceholders(formatStringWithNumbers, undefined))
                .toEqual(formatStringWithNumbers);

            expect(replacePlaceholders(formatStringWithNumbers, null))
                .toEqual(formatStringWithNumbers);

            expect(replacePlaceholders(formatStringWithNumbers, {}))
                .toEqual(formatStringWithNumbers);

            expect(replacePlaceholders(formatStringWithNumbers, []))
                .toEqual(formatStringWithNumbers);
        });

        it("should replace placeholders in the format string if replacements are specified", function () {
            expect(replacePlaceholders(formatStringWithNumbers, ["alpha", "beta", "gamma"]))
                .toEqual("alpha beta gamma");

            expect(replacePlaceholders(formatStringWithAlphaNumerics, { 0: "alpha", "1": "beta", z: "gamma" }))
                .toEqual("alpha beta gamma");
        });

        it("should leave placeholders in the format string if replacements are missing", function () {
            expect(replacePlaceholders(formatStringWithAlphaNumerics, ["alpha", "beta"]))
                .toEqual("alpha beta {z}");

            expect(replacePlaceholders(formatStringWithAlphaNumerics, { "z": "gamma" }))
                .toEqual("{0} {1} gamma");
        });
    });
});
