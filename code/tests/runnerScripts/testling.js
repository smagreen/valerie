/*global jasmine:false, window:false*/

// Initialises things for testling-ci.
(function () {
    "use strict";

    window.onload = function () {

        // Node is undefined for IE6-8.
        if(typeof window.Node === "undefined") {
            window.Node = function () {};
        }

        // Add the Tap Reporter.
        jasmine.getEnv().addReporter(new jasmine.TapReporter());
    };
}());