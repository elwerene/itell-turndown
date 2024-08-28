import fs from 'fs';
import { JSDOM } from 'jsdom';
import test from 'ava';
import { convert } from '../index.js';

// Read the HTML file
const html = fs.readFileSync('tests/html/commonmark.html', 'utf-8');

// Create a DOM from the HTML
const dom = new JSDOM(html);

// Access the document object
const document = dom.window.document;

var testCases = document.querySelectorAll('.case')

for (var i = 0; i < testCases.length; i++) {
    const { output, expected, testCaseName } = collectCase.call(this, testCases[i])

    test(i.toString() + '. ' + testCaseName, function (t) {
        t.plan(1)
        t.is(output, expected)
    })
}

function collectCase(testCase: any) {
    var testCaseName = testCase.getAttribute('data-name')
    var jsonOptions = testCase.getAttribute('data-options')
    var inputElement = testCase.querySelector('.input')
    var expectedElement = testCase.querySelector('.expected')

    var expected = expectedElement.textContent
    var output = convert(inputElement.innerHTML)

    var outputElement = document.createElement('pre')
    outputElement.className = 'output'

    testCase.insertBefore(outputElement, inputElement.nextSibling)
    outputElement.textContent = output

    if (output !== expected) {
        console.log('Test case: ' + testCaseName)
        console.log('Options: ' + jsonOptions)
        // console.log('Expected: ' + expected)
        // console.log('Output: ' + output)
    }

    return { output, expected, testCaseName }
}