import { Bench } from 'tinybench'
import { convert } from '../index.js'
import TurndownService from 'joplin-turndown'

const testStr = '<div>hello</div>'
var td = new TurndownService()
const b = new Bench()

b.add(`Native convert ${testStr}`, () => {
    convert(testStr)
})

b.add(`JavaScript convert ${testStr}`, () => {
    td.turndown(testStr)
})

await b.run()

console.table(b.table())
