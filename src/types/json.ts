"use strict";

// Support for json types
export type json_primitive = string | number | bigint | boolean | null | undefined;
export type json_type = json_primitive | json_object | json_array;
export type json_object = { [key: PropertyKey]: json_type };
export type json_array = Array<json_type>;

/** For creating a json_result type. */
export type json_result = {

    err: boolean | string | unknown,
    data: null | json_type | undefined
}