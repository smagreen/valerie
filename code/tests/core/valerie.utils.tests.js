describe("utils", function () {
    var utils = valerie.utils;

    function testFunction() {
    }

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
            var anonymousFunction = function () {
            };

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

    describe("isArray", function () {
        var isArray = utils.isArray;

        it("should return true for arrays", function () {
            expect(isArray([])).toBeTruthy();
            expect(isArray([1, 2, 3])).toBeTruthy();
            expect(isArray(new Array())).toBeTruthy();
        });

        it("should return false for non-arrays", function () {
            expect(isArray()).toBeFalsy();
            expect(isArray(undefined)).toBeFalsy();
            expect(isArray(null)).toBeFalsy();
            expect(isArray(new Object())).toBeFalsy();
            expect(isArray({"length": 1})).toBeFalsy();
            expect(isArray(1)).toBeFalsy();
            expect(isArray("a")).toBeFalsy();
        });
    });

    describe("isArrayOrObject", function () {
        var isArrayOrObject = utils.isArrayOrObject;

        it("should return true for arrays", function () {
            expect(isArrayOrObject([])).toBeTruthy();
            expect(isArrayOrObject([1, 2, 3])).toBeTruthy();
            expect(isArrayOrObject(new Array())).toBeTruthy();
        });

        it("should return true for objects", function () {
            expect(isArrayOrObject({})).toBeTruthy();
            expect(isArrayOrObject(new Object())).toBeTruthy();
        });

        it("should return false for non-arrays and non-objects", function () {
            expect(isArrayOrObject()).toBeFalsy();
            expect(isArrayOrObject(undefined)).toBeFalsy();
            expect(isArrayOrObject(null)).toBeFalsy();
            expect(isArrayOrObject(1)).toBeFalsy();
            expect(isArrayOrObject("a")).toBeFalsy();
        });
    });

    describe("isFunction", function () {
        var isFunction = utils.isFunction;

        it("should return true for functions", function () {
            expect(isFunction(utils.isFunction)).toBeTruthy();
            expect(isFunction({}.toString)).toBeTruthy();
            expect(isFunction(testFunction)).toBeTruthy();
            expect(isFunction(function () {
            })).toBeTruthy();
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

    describe("isMissing", function () {
        var isMissing = utils.isMissing;

        it("should return true for undefined, null and zero-length strings", function () {
            expect(isMissing()).toBeTruthy();
            expect(isMissing(undefined)).toBeTruthy();
            expect(isMissing(null)).toBeTruthy();
            expect(isMissing("")).toBeTruthy();
        });

        it("should return false for objects, arrays and strings with non-zero lengths", function () {
            expect(isMissing({})).toBeFalsy();
            expect(isMissing(new Object())).toBeFalsy();
            expect(isMissing([1])).toBeFalsy();
            expect(isMissing("a")).toBeFalsy();
            expect(isMissing(1)).toBeFalsy();
        });
    });

    describe("isObject", function () {
        var isObject = utils.isObject;

        it("should return true for objects, but not arrays", function () {
            expect(isObject({})).toBeTruthy();
            expect(isObject(new Object())).toBeTruthy();
        });

        it("should return false for non-objects, including arrays", function () {
            expect(isObject(testFunction)).toBeFalsy();
            expect(isObject([])).toBeFalsy();
            expect(isObject(new Array())).toBeFalsy();
            expect(isObject(1)).toBeFalsy();
            expect(isObject("")).toBeFalsy();
        });
    });

    describe("isString", function () {
        var isString = utils.isString;

        it("should return true for strings", function () {
            expect(isString("")).toBeTruthy();
            expect(isString("a")).toBeTruthy();
            expect(isString(new String("b"))).toBeTruthy();
        });

        it("should return false for non-strings", function () {
            expect(isString(testFunction)).toBeFalsy();
            expect(isString({})).toBeFalsy();
            expect(isString([])).toBeFalsy();
            expect(isString(new Array())).toBeFalsy();
            expect(isString(1)).toBeFalsy();
        });
    });

    describe("mergeOptions", function () {
        var mergeOptions = utils.mergeOptions;

        it("should return an empty object if defaults and options are missing", function () {
            expect(mergeOptions()).toEqual({});
            expect(mergeOptions(undefined)).toEqual({});
            expect(mergeOptions(null)).toEqual({});
        });

        it("should return a shallow clone of options if default options are missing", function () {
            var options = {"a": 1};

            expect(mergeOptions(undefined, options)).toEqual(options);
            expect(mergeOptions(null, options)).toEqual(options);
            expect(mergeOptions(undefined, options)).toNotBe(options);
        });

        it("should return a shallow clone of default options if options are missing", function () {
            var defaultOptions = {"a": 1};

            expect(mergeOptions(defaultOptions)).toEqual(defaultOptions);
            expect(mergeOptions(defaultOptions, undefined)).toEqual(defaultOptions);
            expect(mergeOptions(defaultOptions, null)).toEqual(defaultOptions);
            expect(mergeOptions(defaultOptions, null)).toNotBe(defaultOptions);
        });

        it("should merge default options and options if both are specified", function () {
            expect(mergeOptions({"a": 1}, {"b": 2})).toEqual({"a": 1, "b": 2});
            expect(mergeOptions({"a": 1}, {"a": 2, "b": 3})).toEqual({"a": 2, "b": 3});
            expect(mergeOptions({"a": 1}, {"a": null, "b": 3})).toEqual({"a": null, "b": 3});
        });
    });
});
