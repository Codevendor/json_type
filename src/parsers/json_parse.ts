'use strict';

import { JSON_ERROR } from "../enums/json_error.ts";
import { json_object, json_array, json_type, json_result, json_primitive } from "../types/json.ts";


export function json_parse(text: string): json_type {

    // Declare Vars
    let cur = 0;

    // Checks if string is a bigint
    const is_bigint = function (src: string): boolean {

        return /^[-]{0,1}[0-9]+[n]{1}|[-]{0,1}[1-9]{1}[0-9]{16,}|[-]{0,1}900719925474099[2-9]$/.test(src);

    }

    // Converts a unicode code to character.
    const unicode_to_char = function (src: string): string {

        return String.fromCharCode(parseInt(src, 16));

    };

    // Tests if string is unicode escape
    const is_unicode_escape = function (src: string): boolean {

        return /^[A-Fa-f0-9]{4}$/.test(src);

    };

    // Tests if string is digit
    const is_digit = function (src: string): boolean {

        return /^[0-9]+$/.test(src);

    };

    // Skips white spaces
    const skip_white_space = function () {

        while ([" ", "\t", "\r", "\n"].includes(text[cur])) cur++;

    };

    // Eats a string and pushes cursor.
    const eat_string = function (char: string, case_sensitive: boolean = true): boolean {

        const slice_of = text.slice(cur, cur + char.length);

        if (case_sensitive) {

            if (slice_of === char) {

                cur += char.length;
                return true;

            }

        } else {

            if (slice_of.toLocaleLowerCase() === char.toLocaleLowerCase()) {

                cur += char.length;
                return true;

            }

        }

        return false;

    };

    // Checks for a character
    const has_character = function (char: string, shift: boolean = false): boolean {

        if (text[cur] === char[0]) {
            if (shift) cur++;
            return true;
        }

        return false;

    };

    // Checks if list
    const in_list = function (find: string, list: string[]): boolean {

        return list.includes(find);

    };

    // Checks for string of characters
    const has_string = function (src: string, shift: boolean = true): boolean {

        if (text[cur] === src) {
            if (shift) cur++;
            return true;
        }

        return false;

    };

    // Checks if end of input
    const end_of_input = function (): boolean {

        return (cur < text.length) ? false : true

    };

    // Handles the thrown errors
    const throw_error = function (err: JSON_ERROR, expected: string = '') {

        switch (err) {

            case JSON_ERROR.EXPECT_CHARACTER:

                throw new Error(`JSON_ERROR.${JSON_ERROR[err]} (err: ${err}) - Expecting a character.`);

                break;

            case JSON_ERROR.EXPECT_ESCAPE_CHARACTER:

                throw new Error(`JSON_ERROR.${JSON_ERROR[err]} (err: ${err}) - Expecting an escape character.`);

                break;

            case JSON_ERROR.EXPECT_ESCAPE_UNICODE:

                throw new Error(`JSON_ERROR.${JSON_ERROR[err]} (err: ${err}) - Expecting an escaped unicode character sequence.`);

                break;

            case JSON_ERROR.EXPECT_PROPERTY_KEY:

                throw new Error(`JSON_ERROR.${JSON_ERROR[err]} (err: ${err}) - Expecting a property key for object.`);

                break;

            case JSON_ERROR.EXPECT_EXPONENT_NUMBER:

                throw new Error(`JSON_ERROR.${JSON_ERROR[err]} (err: ${err}) - Expecting a exponent number.`);

                break;

            default:

                throw new Error(`Unspecified JSON parsing error.`);

                break;

        }

    };

    // Parses a json string
    const parse_string = function (): string | undefined {

        skip_white_space();

        if (has_character('"', true)) {

            // Return result
            let result = '';

            while (!end_of_input() && !has_character('"')) {

                // Look for escape character
                if (has_character('\\', true)) {

                    const char = text[cur];

                    // Check against list of possible escape characters
                    if (in_list(char, ['"', "\\", "/", "b", "f", "n", "r", "t"])) {

                        result += char;
                        cur++;

                    } else if (has_character("u")) {

                        // Unicode escape 
                        const uni = text.slice(cur + 1, cur + 5);

                        if (is_unicode_escape(uni)) {

                            result += unicode_to_char(uni);
                            cur += 4;

                        } else {
                            cur += 1;
                            throw_error(JSON_ERROR.EXPECT_ESCAPE_UNICODE);
                        }

                    } else {

                        throw_error(JSON_ERROR.EXPECT_ESCAPE_CHARACTER);
                    }

                } else {


                    // Normal character just add
                    result += text[cur];

                }

                // Move cursor forward
                cur++;

            }

            // Check for end of input or double quote found.
            if (end_of_input()) throw_error(JSON_ERROR.EXPECT_CHARACTER, '"');

            // Move Cursor forward and return built string.
            cur++;
            return result;

        }

        return undefined;
    };

    // Parse a number
    const parse_number = function (): bigint | number | undefined {

        // Skip
        skip_white_space();

        // Create number holder
        let temp = '';

        // Look for negative number
        if (has_character('-', true)) {

            temp += '-';

            // Check for digit
            if (!is_digit(text[cur])) throw_error(JSON_ERROR.EXPECT_DIGIT);

        }

        // Look for digits
        while (!end_of_input() && is_digit(text[cur])) {

            temp += text[cur];

            // Increase cursor
            cur++;

        }

        // Check for float number
        if (has_character('.', true)) {

            temp += '.';

            // Look for digit
            while (!end_of_input() && is_digit(text[cur])) {

                temp += text[cur];

                // Increase cursor
                cur++;

            }
        }

        // Look for exponent
        if (has_character('e') || has_character('E')) {

            temp += text[cur];

            // Increase cursor
            cur++;

            // Look for negative or positive
            if (has_character('-') || has_character('+')) {

                temp += text[cur];

                // Increase cursor
                cur++;

                // Look for digit
                while (!end_of_input() && is_digit(text[cur])) {

                    temp += text[cur];

                    // Increase cursor
                    cur++;

                }

            } else {

                // Throw error
                throw_error(JSON_ERROR.EXPECT_EXPONENT_NUMBER);

            }

        }

        // Check for big int
        if (has_character('n', true)) {

            temp += 'n';

        }

        // Check for temp string
        if (temp === '') return undefined;

        // Check if integer or bigint
        return (is_bigint(temp)) ? BigInt(temp) : Number(temp);

    };

    // Parse an object.
    const parse_object = function (): json_object | undefined {

        if (has_character('{', true)) {

            skip_white_space();

            const result: json_object = {};
            let first = true;

            while (!end_of_input() && !has_character('}')) {

                if (!first) {

                    // Eat comma
                    eat_string(',');

                    // Skip
                    skip_white_space();

                }

                // Get the property key
                const key = parse_string();
                if (key === undefined) {

                    throw_error(JSON_ERROR.EXPECT_PROPERTY_KEY);

                }

                // Skip 
                skip_white_space();

                // Eat colon
                eat_string(':');

                // Get property type
                const value: json_type = parse_json_type();
                result[key as string] = value;

                // Set to false to remove comma
                first = false;

            }

            // Check for end of input or right bracket.
            if (end_of_input()) throw_error(JSON_ERROR.EXPECT_CHARACTER, '}');

            cur++;

            // Move Cursor forward and return built object.
            return result;

        }

        return undefined;

    };



    // Parses the json type
    const parse_json_type = function (): json_type {

        skip_white_space();
        const value: json_type = parse_string() ?? parse_number() ?? parse_object();
        skip_white_space();
        return value;

    };

    // Start parsing
    const value = parse_json_type();
    //this.#expectEndOfInput();
    return value;

}

























/**
 * Parses a json string in an async way.
 * @category helpers
 * @function parse
 * @param json The json string to parse.
 * @returns Promise<json_results> A json_results object.
 */
export function json_parse1(text: string, reviver?: ((this: any, key: string, value: any) => any) | undefined): Promise<json_result> {

    /** Return a promise. */
    return new Promise((resolve) => {

        /** Declare Variables */
        const obj: json_result = { "err": false, "data": null };

        try {

            /** Parse the json string. */
            obj.data = JSON.parse(text, reviver);

        } catch (err: unknown) {

            /** Capture error. */
            obj.err = err;

        }

        /** Resolve json_result. */
        resolve(obj);

    });
}