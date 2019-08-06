"use strict";

const assert            = require("chai").assert;
const main              = require("../../src/main");

describe("'getType'", function() {
    let interpreter     = new main(),
        happyResponses  = [
            { input : "text",       output : "string"},
            { input : 1,            output : "number"},
            { input : false,        output : "boolean"},
            { input : true,         output : "boolean"},
            { input : [],           output : "array"},
            { input : {},           output : "object"},
            { input : new Date,     output : "date"},
            { input : function(){}, output : "function"},
            { input : () => {},     output : "function"},
            { input : null,         output : "null"},
            { input : undefined,    output : "undefined"},
        ];

    it("'getType' set of successful responses", function() {
        happyResponses.forEach((item) => {
            assert.equal(interpreter.getType(item.input), item.output, `${JSON.stringify(item.input)} should be identify as ${JSON.stringify(item.output)}`);
        });
    });
});
