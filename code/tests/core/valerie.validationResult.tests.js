describe("ValidationResult", function () {
    var ValidationResult = valerie.ValidationResult;

    describe("failed", function () {
        it("should be only be true when states.failed is used", function () {
            expect(new ValidationResult(ValidationResult.states.failed).failed).toBeTruthy();
            expect(new ValidationResult(ValidationResult.states.passed).failed).toBeFalsy();
            expect(new ValidationResult(ValidationResult.states.pending).failed).toBeFalsy();
        });
    });

    describe("passed", function () {
        it("should be only be true when states.passed is used", function () {
            expect(new ValidationResult(ValidationResult.states.failed).passed).toBeFalsy();
            expect(new ValidationResult(ValidationResult.states.passed).passed).toBeTruthy();
            expect(new ValidationResult(ValidationResult.states.pending).passed).toBeFalsy();
        });
    });

    describe("pending", function () {
        it("should be only be true when states.pending is used", function () {
            expect(new ValidationResult(ValidationResult.states.failed).pending).toBeFalsy();
            expect(new ValidationResult(ValidationResult.states.passed).pending).toBeFalsy();
            expect(new ValidationResult(ValidationResult.states.pending).pending).toBeTruthy();
        });
    });
});
