describe("ValidationResult", function () {
    var ValidationResult = valerie.ValidationResult;

    describe("failed", function () {
        it("should be only be true for a FailedValidationResult or when states.failed is used", function () {
            expect(new valerie.FailedValidationResult().failed).toBeTruthy();
            expect(new ValidationResult(ValidationResult.states.failed)).toBeTruthy();

            expect(new valerie.PassedValidationResult().failed).toBeFalsy();
            expect(new valerie.PendingValidationResult().failed).toBeFalsy();
        });
    });

    describe("passed", function () {
        it("should be only be true for a PassedValidationResult or when states.passed is used", function () {
            expect(new valerie.PassedValidationResult().passed).toBeTruthy();
            expect(new ValidationResult(ValidationResult.states.passed)).toBeTruthy();

            expect(new valerie.FailedValidationResult().passed).toBeFalsy();
            expect(new valerie.PendingValidationResult().passed).toBeFalsy();
        });
    });

    describe("pending", function () {
        it("should be only be true for a PendingValidationResult or when states.pending is used", function () {
            expect(new valerie.PendingValidationResult().pending).toBeTruthy();
            expect(new ValidationResult(ValidationResult.states.pending)).toBeTruthy();

            expect(new valerie.FailedValidationResult().pending).toBeFalsy();
            expect(new valerie.PassedValidationResult().pending).toBeFalsy();
        });
    });
});
