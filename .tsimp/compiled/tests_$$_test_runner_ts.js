"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runTests;
const fs_1 = __importDefault(require("fs"));
const jsdom_1 = require("jsdom");
const ava_1 = __importDefault(require("ava"));
const index_js_1 = require("../index.js");
const joplin_turndown_1 = __importDefault(require("joplin-turndown"));
var td = new joplin_turndown_1.default({ codeBlockStyle: 'fenced', headingStyle: 'atx' });
function runTests(htmlPath) {
    var html = fs_1.default.readFileSync(htmlPath, 'utf-8');
    const dom = new jsdom_1.JSDOM(html);
    const document = dom.window.document;
    var testCases = document.querySelectorAll('.case');
    for (var i = 0; i < testCases.length; i++) {
        const { output, expected, testCaseName } = collectCase(testCases[i]);
        (0, ava_1.default)(i.toString() + '. ' + testCaseName, function (t) {
            t.plan(1);
            t.is(output, expected);
        });
    }
}
function collectCase(testCase) {
    var testCaseName = testCase.getAttribute('data-name');
    var jsonOptions = testCase.getAttribute('data-options');
    var inputElement = testCase.querySelector('.input');
    var expectedElement = testCase.querySelector('.expected');
    var expected = expectedElement.textContent;
    var output = (0, index_js_1.convert)(inputElement.innerHTML);
    if (output !== expected) {
        console.log('Test case: ' + testCaseName);
        console.log('Options: ' + jsonOptions);
        console.log('Turndown: ' + td.turndown(inputElement.innerHTML));
        // console.log('Expected: ' + expected)
        // console.log('Output: ' + output)
    }
    return { output, expected, testCaseName };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9ydW5uZXIuanMiLCJzb3VyY2VSb290IjoiL3dvcmtzcGFjZXMvcnVzdC1tYXJrZG93bi8iLCJzb3VyY2VzIjpbInRlc3RzL3Rlc3RfcnVubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBUUEsMkJBZUM7QUF2QkQsNENBQW1CO0FBQ25CLGlDQUE2QjtBQUM3Qiw4Q0FBc0I7QUFDdEIsMENBQXFDO0FBQ3JDLHNFQUE2QztBQUU3QyxJQUFJLEVBQUUsR0FBRyxJQUFJLHlCQUFlLENBQUMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBRS9FLFNBQXdCLFFBQVEsQ0FBQyxRQUFnQjtJQUM3QyxJQUFJLElBQUksR0FBRyxZQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMzQixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQTtJQUVwQyxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFbEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN4QyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFcEUsSUFBQSxhQUFJLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksR0FBRyxZQUFZLEVBQUUsVUFBVSxDQUFDO1lBQ2hELENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDVCxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUMxQixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsUUFBYTtJQUM5QixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3JELElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDdkQsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNuRCxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBRXpELElBQUksUUFBUSxHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUE7SUFDMUMsSUFBSSxNQUFNLEdBQUcsSUFBQSxrQkFBTyxFQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUU1QyxJQUFJLE1BQU0sS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUMsQ0FBQTtRQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQTtRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQy9ELHVDQUF1QztRQUN2QyxtQ0FBbUM7SUFDdkMsQ0FBQztJQUVELE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFBO0FBQzdDLENBQUMifQ==