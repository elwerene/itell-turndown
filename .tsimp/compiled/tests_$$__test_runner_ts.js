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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3Rlc3RfcnVubmVyLmpzIiwic291cmNlUm9vdCI6Ii93b3Jrc3BhY2VzL3J1c3QtbWFya2Rvd24vIiwic291cmNlcyI6WyJ0ZXN0cy9fdGVzdF9ydW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFRQSwyQkFlQztBQXZCRCw0Q0FBbUI7QUFDbkIsaUNBQTZCO0FBQzdCLDhDQUFzQjtBQUN0QiwwQ0FBcUM7QUFDckMsc0VBQTZDO0FBRTdDLElBQUksRUFBRSxHQUFHLElBQUkseUJBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7QUFFL0UsU0FBd0IsUUFBUSxDQUFDLFFBQWdCO0lBQzdDLElBQUksSUFBSSxHQUFHLFlBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQzdDLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzNCLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO0lBRXBDLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUVsRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUVwRSxJQUFBLGFBQUksRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxHQUFHLFlBQVksRUFBRSxVQUFVLENBQUM7WUFDaEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNULENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQzFCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxRQUFhO0lBQzlCLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDckQsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUN2RCxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ25ELElBQUksZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUE7SUFFekQsSUFBSSxRQUFRLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQTtJQUMxQyxJQUFJLE1BQU0sR0FBRyxJQUFBLGtCQUFPLEVBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBRTVDLElBQUksTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQyxDQUFBO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFBO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7UUFDL0QsdUNBQXVDO1FBQ3ZDLG1DQUFtQztJQUN2QyxDQUFDO0lBRUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUE7QUFDN0MsQ0FBQyJ9