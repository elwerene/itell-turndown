import fs from 'fs'
import { JSDOM } from 'jsdom'
import test from 'ava'
import { convert } from '../index.js'
import TurndownService from 'joplin-turndown'

var td = new TurndownService({ codeBlockStyle: 'fenced', headingStyle: 'atx' })

export default function runTests(htmlPath: string) {
    var html = fs.readFileSync(htmlPath, 'utf-8')
    const dom = new JSDOM(html)
    const document = dom.window.document

    var testCases = document.querySelectorAll('.case')

    for (var i = 0; i < testCases.length; i++) {
        const { output, expected, testCaseName } = collectCase(testCases[i])

        test(i.toString() + '. ' + testCaseName, function (t) {
            t.plan(1)
            t.is(output, expected)
        })
    }
}

function collectCase(testCase: any) {
    var testCaseName = testCase.getAttribute('data-name')
    var jsonOptions = testCase.getAttribute('data-options')
    var inputElement = testCase.querySelector('.input')
    var expectedElement = testCase.querySelector('.expected')

    var expected = expectedElement.textContent
    var output = convert(inputElement.innerHTML)

    if (output !== expected) {
        console.log('Test case: ' + testCaseName)
        console.log('Options: ' + jsonOptions)
        console.log('Turndown: ' + td.turndown(inputElement.innerHTML))
        // console.log('Expected: ' + expected)
        // console.log('Output: ' + output)
    }

    return { output, expected, testCaseName }
}
