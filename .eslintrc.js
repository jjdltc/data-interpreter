module.exports                          = {
    "extends"                           : [
        "eslint:recommended"
    ],
    "env"                               : {
        "es6"                           : true,
        "node"                          : true,
        "mocha"                         : true
    },
    "rules"                             : {
        "indent"                        : ["error", 4],
        "comma-style"                   : ["error", "last"],
        "no-eval"                       : ["error", {"allowIndirect": false}],
        "no-redeclare"                  : "off",
        "curly"                         : "error",
        "brace-style"                   : ["error", "stroustrup"],
        "dot-location"                  : ["error", "property"],

        "one-var"                       : ["error", { "const": "never", "let": "always", "var": "always" }],
        "no-console"                    : "error",
        "strict"                        : "error",
        "comma-dangle"                  : ["error", "always-multiline"],
        "eol-last"                      : ["error", "always"],
        "no-nested-ternary"             : "error",
        "no-trailing-spaces"            : "error"
    }
}