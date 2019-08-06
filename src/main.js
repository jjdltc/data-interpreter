"use strict";

function dataInterpreter(options){
    this.options                        = options || {
        splitChar                       : ".",
        defaultValue                    : undefined,
        literalChar                     : "=",
        reverseMapping                  : false,
    };

    this.specialArrayOperations         = specialArrayOperations
    this.specialArrayOperationsNames    = Object.keys(this.specialArrayOperations);
    this.specialArrayOperationsRegEx    = new RegExp(this.specialArrayOperationsNames.join("|").replace(/\$/gi,"\\$"));
}

dataInterpreter.prototype.cast = function(source, dictionary, options, specialOperationAttributes) {
    let innerOptions = castOptionSetter.call(this,options),
        dictionaryWasString = (this.getType(dictionary) === "string"),
        result = (this.getType(dictionary) === "array")
            ? []
            : {};

    dictionary = (dictionaryWasString)
        ? [dictionary]
        : dictionary;

    for(let attribute in dictionary){
        if(this.getType(dictionary[attribute]) === "string"){
            result[attribute] = innerGetValue.call(this, source, dictionary[attribute], innerOptions, specialOperationAttributes);
        }
        else{
            if(this.getType(dictionary[attribute]) === "array"){
                let needSpecialProcess = (this.getType(dictionary[attribute][0]) === "string" && dictionary[attribute][0].match(this.specialArrayOperationsRegEx))
                    ? true
                    : false;

                result[attribute] = [];

                if(needSpecialProcess){
                    let splitedElements = dictionary[attribute][0]
                            .replace("(",", ")
                            .replace(")","")
                            .replace(/\$| /g, "")
                            .split(","),
                        operation               = splitedElements[0],
                        dataPath                = splitedElements[1],
                        toIterate               = innerGetValue.call(this, source, dataPath, options, specialOperationAttributes) || [],
                        additionalParamsName    = splitedElements.slice(2);

                    result[attribute] = this.specialArrayOperations[operation].call(this, toIterate, dictionary[attribute][1], additionalParamsName, {
                        source: source,
                        options: innerOptions,
                    });
                }
                else{
                    dictionary[attribute].forEach((item)=>{
                        let temporalItem = (this.getType(item) === "string")
                            ? innerGetValue.call(this, source, item, innerOptions, specialOperationAttributes)
                            : this.cast(source, item, innerOptions)

                        result[attribute].push(temporalItem);
                    });
                }
            }
            else{
                result[attribute] = this.cast(source, dictionary[attribute], innerOptions);
            }
        }
    }

    return (dictionaryWasString)
        ? result[0]
        : result;
}

dataInterpreter.prototype.getValueFromObject = function(source, path){
    let result = this.defaultValue,
        pathArray = (this.getType(path) === "string")
            ? path.split(this.options.splitChar)
            : path;

    if(pathArray.length>0 && source){
        let actualValue = source[pathArray[0]];
        if(actualValue){
            pathArray = pathArray.slice(1);
            result = this.getValueFromObject(actualValue, pathArray);
        }
        else{
            result = (actualValue!=undefined)
                ? actualValue
                : this.defaultValue;
        }
    }
    else{
        result = source
    }

    return result;
}

dataInterpreter.prototype.getType = function(toCheck){
    let result = ([null, undefined].indexOf(toCheck)==-1)
        ? toCheck.constructor.toString().toLowerCase().match(/\s([a-z]*)/)[1]
        : ""+toCheck;

    return result;
}

const innerGetValue = function (source, dictionaryPath, options, specialOperationAttributes){
    let innerOptions = options || this.options,
        result = innerOptions.defaultValue || this.defaultValue;

    if(dictionaryPath[0] === "$"){
        result = innerGetValueSpecialValue.call(this, source, dictionaryPath, innerOptions, specialOperationAttributes);
    }
    else{
        if(dictionaryPath.indexOf("$")!=-1 && dictionaryPath.indexOf(innerOptions.splitChar) != -1){
            result = innerGetValueSpecialDictionary.call(this, source, dictionaryPath, innerOptions, specialOperationAttributes);
        }
        else{
            result = innerGetValueBasic.call(this, source, dictionaryPath, innerOptions);
        }
    }

    return result;
};
const innerGetValueBasic = function(source, dictionaryPath, options){
    let result = options.defaultValue || this.defaultValue;

    if((dictionaryPath[0] === options.literalChar)){
        result = (options.reverseMapping)
            ? this.getValueFromObject(source, dictionaryPath.substr(1))
            : dictionaryPath.substr(1);
    }
    else{
        result = (options.reverseMapping)
            ? dictionaryPath
            : this.getValueFromObject(source, dictionaryPath);
    }

    return result;
};
const innerGetValueSpecialValue = function(source, dictionaryPath, options, specialOperationAttributes){
    let result = options.defaultValue || this.defaultValue,
        cleanDictionaryPath = dictionaryPath.substr(1);

    if(cleanDictionaryPath.indexOf(options.splitChar) != -1) {
        let splitedDictionaryPath = cleanDictionaryPath.split(options.splitChar),
            innerSpecialOperation = splitedDictionaryPath[0],
            innerDictionaryPath = splitedDictionaryPath.slice(1).join(options.splitChar);

        result = (specialOperationAttributes[innerSpecialOperation].type === "value")
            ? this.cast(specialOperationAttributes[innerSpecialOperation].value, [innerDictionaryPath], options, specialOperationAttributes)[0]
            : result;
    }
    else {
        result = (specialOperationAttributes[cleanDictionaryPath].type === "value")
            ? specialOperationAttributes[cleanDictionaryPath].value
            : result;
    }

    return result;
};
const innerGetValueSpecialDictionary = function(source, dictionaryPath, options, specialOperationAttributes){
    let result = options.defaultValue || this.defaultValue,
        innerSpecialOperation = dictionaryPath.match(/\$[A-z]*/g)[0];

    dictionaryPath = dictionaryPath.replace(innerSpecialOperation, specialOperationAttributes[innerSpecialOperation.substr(1)].value)
    result = this.getValueFromObject(source, dictionaryPath);

    return result;
};
const castOptionSetter = function(options){
    let innerOptions            = options || this.options;

    innerOptions.splitChar      = innerOptions.splitChar        || this.options.splitChar;
    innerOptions.literalChar    = innerOptions.literalChar      || this.options.literalChar;
    innerOptions.reverseMapping = innerOptions.reverseMapping   || this.options.reverseMapping;
    innerOptions.defaultValue   = (innerOptions.defaultValue    || innerOptions.defaultValue === null)
        ? innerOptions.defaultValue
        : this.options.defaultValue;

    return innerOptions;
};
const specialArrayOperations = {
    "forEach" : function(toIterate, dictionary, additionalParamsName, additionalInfo){
        let result = [],
            dictionaryWasString = (this.getType(dictionary) === "string");

        dictionary = (dictionaryWasString)
            ? [dictionary]
            : dictionary;

        toIterate.forEach((item, index, array)=>{
            let iterationAttributes = {},
                iterationResponse = this.options.defaultValue;

            iterationAttributes[additionalParamsName[0]] = {
                type : "value",
                value : item,
                array : array,
            };
            iterationAttributes[additionalParamsName[1]] = {
                type : "dictionary",
                value : index,
                array : array,
            };

            iterationResponse = this.cast(additionalInfo.source, dictionary, additionalInfo.options, iterationAttributes);

            iterationResponse = (dictionaryWasString && this.getType(iterationResponse) === "array")
                ? iterationResponse[0]
                : iterationResponse;

            result.push(iterationResponse);
        });
        return result;
    },
};

module.exports = dataInterpreter;
