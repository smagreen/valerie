describe("utils", function () {
    var utils = valerie.utils;
    function testFunction() {}

    describe("asFunction", function () {
        var asFunction = utils.asFunction;

        it("should return a function regardless of what is passed in", function () {
            expect(utils.isFunction(asFunction())).toBeTruthy();
            expect(utils.isFunction(asFunction(undefined))).toBeTruthy();
            expect(utils.isFunction(asFunction(null))).toBeTruthy();
            expect(utils.isFunction(asFunction([]))).toBeTruthy();
            expect(utils.isFunction(asFunction(1))).toBeTruthy();
            expect(utils.isFunction(asFunction("a"))).toBeTruthy();
        });

        it("should return a passed function back without modification", function () {
            var anonymousFunction = function () {};

            expect(asFunction(testFunction)).toBe(testFunction);
            expect(asFunction(anonymousFunction)).toBe(anonymousFunction);
        });

        it("should return a function that returns the value passed in", function () {
            expect(asFunction()()).toBeUndefined();
            expect(asFunction(undefined)()).toBeUndefined();
            expect(asFunction(null)()).toBeNull();
            expect(asFunction([])()).toEqual([]);
            expect(asFunction(1)()).toEqual(1);
            expect(asFunction("a")()).toEqual("a");
        });
    });

    describe("isFunction", function () {
        var isFunction = utils.isFunction;

        it("should return true for functions", function () {
            expect(isFunction(utils.isFunction)).toBeTruthy();
            expect(isFunction({}.toString)).toBeTruthy();
            expect(isFunction(testFunction)).toBeTruthy();
            expect(isFunction(function() {})).toBeTruthy();
        });

        it("should return false for non-functions", function () {
            expect(isFunction()).toBeFalsy();
            expect(isFunction(undefined)).toBeFalsy();
            expect(isFunction(null)).toBeFalsy();
            expect(isFunction([])).toBeFalsy();
            expect(isFunction(1)).toBeFalsy();
            expect(isFunction("a")).toBeFalsy();
        });
    });
});
