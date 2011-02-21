/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

    addCrockfordsObjectCreateMethodToAllObjectsForPrototypalInheritance();

    function addCrockfordsObjectCreateMethodToAllObjectsForPrototypalInheritance() {
        if (typeof GLOBAL.Object.create !== 'function') {
            GLOBAL.Object.create = function (parentObject) {
                function F() {}
                F.prototype = parentObject;
                return new F();
            };
        }
    }

//===============================
} (window, (function() {
    return;
} ())));
//===============================


