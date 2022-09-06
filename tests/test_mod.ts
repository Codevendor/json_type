/** The type_of module tests. */
import { assertEquals } from "./test_deps.ts";
import { json_parse, json_stringify, json_result } from "../mod.ts";


/** Set some terminal color. */
const BG_BLUE = "\x1b[44m";
const FG_WHITE = "\x1b[37m";
const TITLE = BG_BLUE + FG_WHITE;
const RESET = "\x1b[0m";



Deno.test(`\n${TITLE} Async json_parse() Js Primitive undefined ${RESET}`, async() => {

    //const schema = await Deno.readTextFile("./tests/schemas/test1.json");
    const json = await Deno.readTextFile("./tests/json/test2.json");

    //const json = `{"message":"\"Update the package list\"","distinct":true,"url":"https://api.github.com/repos"}`

    //var a = new String("\u{D800}test\"");
    //var a = `{"test":"adam", "hey": 12345, "test2": 1244344234234241342342354534534643654645365 }`;

    //var a = `["test", { "test2": -Infinity, "check": 1234}]`;

//let pjson = JSON.parse(json);

    let pjson = json_parse(json);
    console.log('Good');


    //console.log(JSON.stringify(pjson, null, 4));
    //console.log(json_parse(json));
    //console.log(JSON.parse(json));


});



// /** JSON.parse tests ----------------------------------------------------------- */

// Deno.test(`\n${TITLE} Async json_parse() Js Primitive undefined ${RESET}`, async() => {

//     const results: json_result = await json_parse('undefined');

//     console.log(`const results: json_result = await json_parse('undefined');\n`);
//     console.log(`results: `, results);
//     assertEquals(results.data, null);

//     try {
//         JSON.parse('undefined');
//     }
//     catch(err) {
//         assertEquals(results.err, err);
//     }


// });

// Deno.test(`\n${TITLE} Async json_parse() Js Primitive null ${RESET}`, async() => {

//     const results: json_result = await json_parse('null');

//     console.log(`const results: json_result = await json_parse('null');\n`);
//     console.log(`results: `, results);
//     assertEquals(results.data, null);

//     try {
//         JSON.parse('null');
//     }
//     catch(err) {
//         assertEquals(results.err, err);
//     }


// });

// Deno.test(`\n${TITLE} Async json_parse() Js Primitive number ${RESET}`, async() => {

//     const results: json_result = await json_parse('12345');

//     console.log(`const results: json_result = await json_parse('12345');\n`);
//     console.log(`results: `, results);
//     assertEquals(results.data, 12345);

//     try {
//         JSON.parse('12345');
//     }
//     catch(err) {
//         assertEquals(results.err, err);
//     }


// });

// Deno.test(`\n${TITLE} Async json_parse() Js Primitive bigint ${RESET}`, async() => {

//     const results: json_result = await json_parse('BigInt("0x1fffffffffffff")');

//     console.log(`const results: json_result = await json_parse(BigInt("0x1fffffffffffff"));\n`);
//     console.log(`results: `, results);
//     //assertEquals(results.data, BigInt("0x1fffffffffffff"));

//     try {
//         JSON.parse('12345');
//     }
//     catch(err) {
//         assertEquals(results.err, err);
//     }


// });

// Deno.test(`\n${TITLE} Async json_parse() Simple Object ${RESET}`, async() => {

//     const results: json_result = await json_parse('{}');

//     console.log(`const results: json_result = await json_parse('{}');\n`);
//     console.log(`results: `, results);
//     assertEquals(results.data, JSON.parse('{}'));


// });

// Deno.test(`\n${TITLE} Async json_parse() Error Test ${RESET}`, async() => {

//     const results: json_result = await json_parse('{;}');

//     console.log(`const results: json_result = await json_parse('{;}');\n`);
//     console.log(`results: `, results);

//     assertEquals(results.data, null);

//     try {
//         JSON.parse('{;}');
//     }
//     catch(err) {
//         assertEquals(results.err, err);
//     }

// });

// /** JSON.stringify test --------------------------------------------------------- */

// Deno.test(`\n${TITLE} Async json_stringify() Simple Object ${RESET}`, async() => {

//     const results: json_result = await json_stringify('{}');

//     console.log(`const results: json_result = await json_stringify('{}');\n`);
//     console.log(`results: `, results);
//     assertEquals(results.data, JSON.stringify('{}'));


// });

// Deno.test(`\n${TITLE} Async json_stringify() Circular Error Test ${RESET}`, async() => {

//     let obj = { obj:{}, n: 42 };
//     obj.obj = obj;
//     const results: json_result = await json_stringify(obj);

//     console.log(`let obj = { obj:{}, n: 42 };`);
//     console.log(`obj.obj = obj;`);
//     console.log(`const results: json_result = await json_stringify(obj);\n`);
//     console.log(`results: `, results);

//     assertEquals(results.data, null);

//     try {
//         JSON.stringify('{;}');
//     }
//     catch(err) {
//         assertEquals(results.err, err);
//     }

// });


