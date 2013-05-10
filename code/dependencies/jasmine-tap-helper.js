/*global jasmine:false, window:false, document:false*/

(function () {
    "use strict";

    window.onload = function () {
        jasmine.getEnv().addReporter(new jasmine.TapReporter());
    }
}());

