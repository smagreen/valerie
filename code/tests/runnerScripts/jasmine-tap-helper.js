/*global jasmine:false, window:false*/

(function () {
    "use strict";

    window.onload = function () {
        jasmine.getEnv().addReporter(new jasmine.TapReporter());
        if(typeof window.Node === "undefined") {
            window.Node = function () {};
        }
    };
}());

