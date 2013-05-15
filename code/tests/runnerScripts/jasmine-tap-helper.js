/*global jasmine:false, window:false*/

(function () {
    "use strict";

    window.onload = function () {
        jasmine.getEnv().addReporter(new jasmine.TapReporter());

        // Causes a problem on IE6-8
        if(typeof window.Node === "undefined") {
            window.Node = function () {};
        }
    };
}());

