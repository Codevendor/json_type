'use strict';

import { json_type, json_result } from "../types/json.ts";

/**
 * Converts a js type into a string representation.
 * @category helpers
 * @function stringify
 * @param src The json string to parse.
 * @returns Promise<json_result> A json_result object.
 */
export function json_stringify(value: any, replacer?: ((this: any, key: string, value: any) => any) | undefined, space?: string | number | undefined): Promise<json_result> {

    /** Return a promise. */
    return new Promise((resolve) => {

        /** Declare Variables */
        const obj: json_result = { "err": false, "data": null };

        try {

            /** Parse the json string. */
            obj.data = JSON.stringify(value, replacer, space);

        } catch (err: unknown) {

            /** Capture error. */
            obj.err = err;

        }

        /** Resolve json_result. */
        resolve(obj);

    });
}