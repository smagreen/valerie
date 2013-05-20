describe("rules", function () {
    var validationResultStates = valerie.ValidationResult.states;

    describe("StringLengthRule", function () {
        var StringLength = valerie.rules.StringLength;

        describe("test", function () {
            it("should only return a passed result when the length of the string is >= the minimum", function () {
                expect(new StringLength(5, null).test("12345").state === validationResultStates.passed);
            });
        });
    });
});