"use strict";

module.exports = {
    rules: {
        "header-max-length"                     : [2, "always", 72],

        "body-leading-blank"                    : [2, "always"],
        "body-min-length"                       : [2, "always", 10],

        "footer-leading-blank"                  : [2, "always"],

        "scope-case"                            : [2, "always", "lower-case"],

        "subject-empty"                         : [2, "never"],

        "type-case"                             : [2, "always", "lower-case"],
        "type-empty"                            : [2, "never"],
        "type-enum"                             : [
            2,
            "always",
            [
                "build",    "chore",    "docs",
                "feat",     "fix",      "perf",
                "refactor", "revert",   "test",
                "ci",
            ],
        ],
    },
}
