import parseForESLint from "@typescript-eslint/parser";
import globals from "globals";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["src/**/*.tsx", "src/**/*.ts"],
        ignores: ["out/"],
        languageOptions: {
            parser: parseForESLint,
            globals: {
                ...globals.browser,
                "process": true,
                "node" : true,
            }
        },
        rules: {
            "no-console": "error",
            "no-undef": "error",
            // "no-unused-vars": "error",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "error"
        },
        plugins: {
            "@typescript-eslint": typescriptEslintPlugin
        }
    }
];