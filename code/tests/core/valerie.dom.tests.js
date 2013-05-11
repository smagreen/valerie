describe("dom", function () {
    var dom = valerie.dom;

    describe("classNamesStringToDictionary", function () {
        var toDictionary = dom.classNamesStringToDictionary;

        it("should return an empty dictionary when passed an empty or whitespace only string", function () {
            expect(toDictionary("")).toEqual({});
            expect(toDictionary(" ")).toEqual({});
        });

        it("should return a dictionary of true keyed against found class-names", function () {
            expect(toDictionary("class1 class-2 class_3")).toEqual({"class1": true, "class-2": true, "class_3": true});
        });

        it("should return the same dictionary where only whitespace varies", function () {
            expect(toDictionary("class")).toEqual({"class": true});
            expect(toDictionary(" class")).toEqual({"class": true});
            expect(toDictionary("class ")).toEqual({"class": true});
            expect(toDictionary(" class")).toEqual({"class": true});
            expect(toDictionary(" class1  class2 class3")).toEqual({"class1": true, "class2": true, "class3": true});
        });
    });

    describe("classNamesDictionaryToString", function () {
        var toString = dom.classNamesDictionaryToString;

        it("should return an empty string when passed an empty dictionary", function () {
            expect(toString({})).toEqual("");
        });

        it("should return a string of sorted, space separated names for true values in the dictionary", function () {
             expect(toString({"class2": true, "class1": true, "class_3": false})).toEqual("class1 class2");
        });
    });
});
