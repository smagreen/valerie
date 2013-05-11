describe("utils", function () {
    var utils = valerie.utils;

    describe("asFunction", function () {
        var asFunction = utils.asFunction;

        it("should return a function regardless of what is passed in", function () {
            expect(utils.isFunction(asFunction(undefined))).toBeTruthy();
        });
    });

    describe("isFunction", function () {
        var isFunction = utils.isFunction;

        it("should return true for functions, false for non-functions", function () {
            expect(isFunction(utils.isFunction)).toBeTruthy();
            expect(isFunction({}.toString)).toBeTruthy();
            expect(isFunction(function() {})).toBeTruthy();
        });
    });
});
