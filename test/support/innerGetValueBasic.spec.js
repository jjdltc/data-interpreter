"use strict";

const assert                = require("chai").assert;
const main                  = require("../../src/main");
const source                = require("./../resources/dataSource").main;
const rewire                = require("rewire");
const rewireMain            = rewire("../../src/main.js");

describe("'innerGetValueBasic'", function(){
    let innerGetValueBasic  = rewireMain.__get__("innerGetValueBasic"),
        happyResponses      = {
            "basic": [
                { template  : "objectLvl1.objectLvl2.booleanLvl3",   response : false },
                { template  : "=literal text",                       response : "literal text" },
            ],
            "differentLiteral": [
                { template  : "objectLvl1.objectLvl2.booleanLvl3",   response : false },
                { template  : "&literal text",                       response : "literal text" },
            ],
            "reverseMapping": [
                { template  : "=objectLvl1.objectLvl2.booleanLvl3",  response : false },
                { template  : "literal text",                        response : "literal text" },
            ],
            "differentLiteralAndReverseMapping": [
                { template  : "&objectLvl1.objectLvl2.booleanLvl3",  response : false },
                { template  : "literal text",                        response : "literal text" },
            ],
        };

    describe("Normal Cases", function(){
        let interpreter     = new main();

        it("'innerGetValueBasic' set of normal cases", function() {
            happyResponses.basic.forEach((item) => {
                assert.equal(innerGetValueBasic.call(interpreter, source, item.template, interpreter.options), item.response, `${JSON.stringify(item.template)} should be respond ${JSON.stringify(item.response)}`);
            });
        });
    });

    describe("Different literalChar", function(){
        let interpreter     = new main();

        interpreter.options.literalChar = "&";

        it("'innerGetValueBasic' set of different literal cases", function() {
            happyResponses.differentLiteral.forEach((item) => {
                assert.equal(innerGetValueBasic.call(interpreter, source, item.template, interpreter.options), item.response, `${JSON.stringify(item.template)} should be respond ${JSON.stringify(item.response)}`);
            });
        });
    });

    describe("reverseMapping Cases", function(){
        let interpreter     = new main();

        interpreter.options.reverseMapping = true;

        it("'innerGetValueBasic' set of reverse mapping cases", function() {
            happyResponses.reverseMapping.forEach((item) => {
                assert.equal(innerGetValueBasic.call(interpreter, source, item.template, interpreter.options), item.response, `${JSON.stringify(item.template)} should be respond ${JSON.stringify(item.response)}`);
            });
        });
    });

    describe("reverseMapping with different literalChar", function(){
        let interpreter     = new main();

        interpreter.options.reverseMapping = true;
        interpreter.options.literalChar = "&";

        it("'innerGetValueBasic' set of reverse mapping plus different literal cases", function() {
            happyResponses.differentLiteralAndReverseMapping.forEach((item) => {
                assert.equal(innerGetValueBasic.call(interpreter, source, item.template, interpreter.options), item.response, `${JSON.stringify(item.template)} should be respond ${JSON.stringify(item.response)}`);
            });
        });
    });
});
