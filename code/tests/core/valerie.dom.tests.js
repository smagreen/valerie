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

    describe("setElementVisibility", function () {
       var visibility = dom.setElementVisibility,
           element;

        beforeEach(function () {
            $(document.body)
                .empty()
                .html("<div class='test'></div>");

            element = $(".test")[0];
        });

        it("should make the element visible if a truthy value is passed in", function () {
            visibility(element, true);
            expect($(".test:visible").length).toEqual(1);
            expect($(".test:hidden").length).toEqual(0);
        });

        it("should make the element invisible if a falsy value is passed in", function () {
            visibility(element, false);
            expect($(".test:hidden").length).toEqual(1);
            expect($(".test:visible").length).toEqual(0);
        });
    });
});
