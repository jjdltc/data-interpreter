"use strict";

const assert            = require("chai").assert;
const main              = require("../src/main");
const source            = require("./resources/dataSource").main;

describe("'main' file basics", function() {
    let interpreter = new main();

    it("'main' import should be a 'function' and can be instantiated as 'interpreter'", function() {
        assert.isFunction(main, "'main' is not a function");
        assert.instanceOf(interpreter, main, "'interpreter' is not an instance of 'main'");
    });

    it("'interpreter' should have a set of fuctions", function() {
        let setOfFunctions = ["cast"];

        setOfFunctions.forEach(function(functionName){
            assert.isFunction(interpreter[functionName], `interpreter.${functionName} should be a function`);
        });
    });
});

describe("'dataInterpreter' options", function() {
    let interpreter = new main();

    it("'interpreter' should have a set of options", function() {
        let options = {
            splitChar : ".",
            defaultValue : undefined,
            literalChar : "=",
            reverseMapping : false,
        };
        assert.deepEqual(interpreter.options, options);
    });
});

describe("'cast'", function() {
    let interpreter     = new main(),
        happyResponses  = [
            { template : "stringLvl1", response : "stringValueLvl1" },
            { template : { stringValue : "stringLvl1"}, response : { stringValue : "stringValueLvl1"}},
            { template : { stringValue : "objectLvl1.stringLvl2"}, response : { stringValue : "stringValueLvl2"}},
            { template : { objectValue : { innerObjectValue : "stringLvl1"}}, response : { objectValue : { innerObjectValue : "stringValueLvl1"}}},
            { template : { literalValue : "=LiteralText"}, response : { literalValue : "LiteralText"}},
            // { template : { literalValue : "=1"}, response : { literalValue : 1}},
            {
                template : { stringValue : ["objectLvl1.stringLvl2",    "objectLvl1.objectLvl2.numberLvl3",     { number2: "objectLvl1.numberLvl2"},     ["stringLvl1", "objectLvl1.objectLvl2.booleanLvl3"]]},
                response : { stringValue : ["stringValueLvl2",          3,                                      { number2: 2},                           ["stringValueLvl1", false]]},
            },
            {
                template : ["=LiteralText", "stringLvl1",       { stringLvl1: "stringLvl1"},        ["=LiteralText", "stringLvl1"]],
                response : ["LiteralText",  "stringValueLvl1",  { stringLvl1: "stringValueLvl1"},   ["LiteralText", "stringValueLvl1"]],
            },
        ],
        iterableResponses = [
            {
                template : {response : ["$forEach($iterableArray, $iterationItem, $iterationIndex)", "$iterationItem"]},
                response : {response : [
                    {iterableItemAttribute : "iterableItemValue1"}, {iterableItemAttribute : "iterableItemValue2"}, {iterableItemAttribute : "iterableItemValue3"},
                    {iterableItemAttribute : "iterableItemValue4"}, {iterableItemAttribute : "iterableItemValue5"}, {iterableItemAttribute : "iterableItemValue6"},
                ]},
            },
            {
                template : {response : ["$forEach($iterableArray, $iterationItem, $iterationIndex)", {innerAttribute : "$iterationItem" }]},
                response : {response : [
                    {innerAttribute: {iterableItemAttribute : "iterableItemValue1"}}, {innerAttribute: {iterableItemAttribute : "iterableItemValue2"}}, {innerAttribute : {iterableItemAttribute : "iterableItemValue3"}},
                    {innerAttribute: {iterableItemAttribute : "iterableItemValue4"}}, {innerAttribute: {iterableItemAttribute : "iterableItemValue5"}}, {innerAttribute : {iterableItemAttribute : "iterableItemValue6"}},
                ]},
            },
            {
                template : {response : ["$forEach($iterableArray, $iterationItem, $iterationIndex)", "$iterationItem.iterableItemAttribute"]},
                response : {response : ["iterableItemValue1", "iterableItemValue2", "iterableItemValue3", "iterableItemValue4", "iterableItemValue5", "iterableItemValue6" ]},
            },
            {
                template : {response : ["$forEach($iterableArray, $iterationItem, $iterationIndex)", ["$iterationItem.iterableItemAttribute"]]},
                response : {response : [["iterableItemValue1"], ["iterableItemValue2"], ["iterableItemValue3"], ["iterableItemValue4"], ["iterableItemValue5"], ["iterableItemValue6"] ]},
            },
            {
                template : {response : ["$forEach($iterableArray, $iterationItem, $iterationIndex)", "iterableArray.$iterationIndex.iterableItemAttribute"]},
                response : {response : ["iterableItemValue1", "iterableItemValue2", "iterableItemValue3", "iterableItemValue4", "iterableItemValue5", "iterableItemValue6" ]},
            },
            {
                template : {response : ["$forEach($iterableArray2, $iterationItem, $iterationIndex)", "$iterationItem"]},
                response : {response : []},
            },
        ]

    it("'cast' set of simple responses", function() {
        happyResponses.forEach((item) => {
            assert.deepEqual(interpreter.cast(source, item.template), item.response, `${JSON.stringify(item.template)} should be cast to ${JSON.stringify(item.response)}`);
        });
    });

    it("'cast' set of iterable responses", function() {
        iterableResponses.forEach((item) => {
            assert.deepEqual(interpreter.cast(source, item.template), item.response, `${JSON.stringify(item.template)} should be cast to ${JSON.stringify(item.response)}`);
        });
    });
});
