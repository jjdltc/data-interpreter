# Data Interpreter

A library to transform / normalize / map a data source (JS Data Structure) using a template.

#### Instalation
- node: `npm install data-interpreter`

#### Basic Documentation
- `constructor([options])`
  -`options`: Is an optional object with any of the follow attributes
    - `splitChar` (String "."): Accesor char, used to indicated inner object attributes in the _template_ 
    - `defaultValue` (Any undefined): Value to be used when no other valued is found from the _template_ in the _source_
    - `literalChar` (String "="): Indicates that the following text in the _template_ must be used as literal value
    - `reverseMapping` (Boolean false): When true, use the absense of _literalChar_ as indication of literal value
- `cast(source, dictionary[, options])` Main function, used to transfor / cast / translate a template / dictionary using a input (Js data structure)
    - `source` (Object|Array): Source to use as input in the _template_
    - `dictionary` (String|Object|Array): The structure of the expected output, using the reference to the source.
    - `options` (Object): Optional override of the instance _options_
- `getValueFromObject(source, path)`
    - `source`: (Object|Array): Source to use as input to get the data
    - `path`: (String|Array): the path to seek the value, using the _splitChar_ as accesor separator. For example `"path.to.inner.value"` or `["path","to","inner","value"]`
- `getType(variableToCheck)`: Helper function that return a string with the tipe of the variable.
    - `variableToCheck` (Any)

#### Use Examples
- Using a source like:
  ```
  const source = {
    stringLvl1                      : "stringValueLvl1",
    arrayLvl1                       : ["arrayValueLvl1"],
    objectLvl1                      : {
        numberLvl2                  : 2,
        booleanLvl2                 : true,
        objectLvl2                  : {
            stringLvl3              : "stringValueLvl3",
        },
    },
    iterableArray                   : [
        {iterableItemAttribute      : "iterableItemValue1"},
        {iterableItemAttribute      : "iterableItemValue2"},
    ],
  }
  ```
- And a basic instance of `data-interpreter`
  ```
  const dataInterpreter = require("data-interpreter");
  const interpreter = new dataInterpreter();
  ``` 
- You could:
  - Use a plain _dictionary_
    ```
    interpreter.cast(source, "stringLvl1")
    -> "stringValueLvl1"
    ```
  - Use an object type _dictionary_
    ```
    interpreter.cast(source, { 
        attrName : "stringLvl1"
    })
    -> { attrName : "stringValueLvl1" }
    ```
  - Use nested references to the _source_
    ```
    interpreter.cast(source, {
      attrName : "objectLvl1.numberLvl2"
    })
    -> { attrName : 2 }
    ```
  - Use _dictionary_ as complex as need it
    ```
    interpreter.cast(source, { 
      attrName : { 
        innerAttrName : "stringLvl1"
      }
    })
    -> { attrName : { innerAttrName : "stringValueLvl1"} }
    ```
  - Use _dictionary_ with literal values
    ```
    interpreter.cast(source, { attrName : "=LiteralText"})
    -> { attrName : "LiteralText"}
    ```
  - Use _dictionary_ with objects or arrays as part of its data structures
    ```
    interpreter.cast(source, { 
      attrName : [ "stringLvl1", "objectLvl1.numberLvl2" ]
    })
    -> { attrName : ["stringValueLvl1", 2] }
    ```
  - Iterate collections (By value)
    ```
    interpreter.cast(source, { attributeName : [ 
      "$forEach($iterableArray, $iterationItem, $iterationIndex)", 
      "$iterationItem.iterableItemAttribute"
    ]})
    -> {attributeName : ["iterableItemValue1", "iterableItemValue2"]}
    ```
  - Iterate collections (By index)
    ```
    interpreter.cast(source, { attributeName : [ 
      "$forEach($iterableArray, $iterationItem, $iterationIndex)", 
      "iterableArray.$iterationIndex.iterableItemAttribute"
    ]})
    -> {attributeName : ["iterableItemValue1", "iterableItemValue2"]}
    ```

