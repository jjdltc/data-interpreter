"use strict";

const assert            = require("chai").assert;
const main              = require("../../src/main");
const rewire            = require("rewire");
const rewireMain        = rewire("../../src/main.js");

describe("'castOptionSetter'", function(){
    let interpreter = new main(),
        castOptionSetter = rewireMain.__get__("castOptionSetter"),
        options = {
            splitChar : ".",
            defaultValue : undefined,
            literalChar : "=",
            reverseMapping : false,
        };

    it("'castOptionSetter' should have a set of options by default", function() {
        assert.deepEqual(castOptionSetter.call(interpreter), options);
    });

    it("'castOptionSetter' should change one of the options", function() {
        let newdefaultValue = Object.assign({},options);
        newdefaultValue.defaultValue = null;

        assert.deepEqual(castOptionSetter.call(interpreter, {
            defaultValue : null,
        }), newdefaultValue);
    });

    it("'castOptionSetter' should change all of the options", function() {
        let newdefaultValue = {
            splitChar : "|",
            defaultValue : {},
            literalChar : "@",
            reverseMapping : true,
        };

        assert.deepEqual(castOptionSetter.call(interpreter, newdefaultValue), newdefaultValue);
    });
});
