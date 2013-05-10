describe("formatting.replacePlaceholders", function() {
    it("should return the original string if replacements are not specified", function() {
        var originalString = "{0} {1} {2}",
            formattedString = valerie.formatting.replacePlaceholders(originalString);

        expect(formattedString).toEqual(originalString);
    });
});
