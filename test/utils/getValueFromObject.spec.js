"use strict";

const assert            = require("chai").assert;
const main              = require("../../src/main");
const source            = require("./../resources/dataSource").main;

describe("'getValueFromObject'", function() {
    let interpreter     = new main(),
        happyResponses  = [
            { path : "stringLvl1",                  response : "stringValueLvl1" },
            { path : "arrayLvl1",                   response : source.arrayLvl1 },
            { path : "numberLvl1",                  response : 1 },
            { path : "booleanLvl1",                 response : false },
            { path : "objectLvl1",                  response : source.objectLvl1 },
            { path : "objectLvl1.stringLvl2",       response : "stringValueLvl2" },
            { path : "objectLvl1.arrayLvl2",        response : source.objectLvl1.arrayLvl2 },
            { path : "objectLvl1.numberLvl2",       response : 2 },
            { path : "objectLvl1.booleanLvl2",      response : true },
            { path : "objectLvl1.objectLvl2",       response : source.objectLvl1.objectLvl2 },
        ];

    it("'getValueFromObject' set of successful responses", function(){
        happyResponses.forEach((item) => {
            if(item.path.indexOf("objectLvl") === 0){
                assert.deepEqual(interpreter.getValueFromObject(source, item.path), item.response, `${item.path} should be equal to ${item.response}`);
            }
            else{
                assert.equal(interpreter.getValueFromObject(source, item.path), item.response, `${item.path} should be equal to ${item.response}`);
            }
        });
    });

    it("'getValueFromObject' non-existent attribute", function(){
        assert.equal(interpreter.getValueFromObject(source, "nonExistent"), interpreter.options.defaultValue);
    });

    it("'getValueFromObject' undefined value", function(){
        assert.isUndefined(interpreter.getValueFromObject(source.undefinedLvl1, "undefinedLvl1"));
    });

    it("'getValueFromObject' null value", function(){
        assert.isNull(interpreter.getValueFromObject(source.nullLvl1, "nullLvl1"));
    });
});
