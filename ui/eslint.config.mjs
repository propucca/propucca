import parseForESLint from "@typescript-eslint/parser";
import globals from "globals";
import react  from "eslint-plugin-react";
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
            }
        },
        rules: {
            "no-console": "error",
            "no-undef": "error",
            // "no-unused-vars": "error",
            "no-extra-semi": "error",
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
            "react/jsx-no-undef": "error",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "error"
        },
        plugins: {
            react,
            "@typescript-eslint": typescriptEslintPlugin
        }
    }
];