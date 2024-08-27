import { Bench } from 'tinybench'
import { convert } from '../index.js'
import TurndownService from 'joplin-turndown'

const testStr = `
<table>
    <tr>
        <td>&nbsp;</td>
        <td>Knocky</td>
        <td>Flor</td>
        <td>Ella</td>
        <td>Juan</td>
    </tr>
    <tr>
        <td>Breed</td>
        <td>Jack Russell</td>
        <td>Poodle</td>
        <td>Streetdog</td>
        <td>Cocker Spaniel</td>
    </tr>
    <tr>
        <td>Age</td>
        <td>16</td>
        <td>9</td>
        <td>10</td>
        <td>5</td>
    </tr>
    <tr>
        <td>Owner</td>
        <td>Mother-in-law</td>
        <td>Me</td>
        <td>Me</td>
        <td>Sister-in-law</td>
    </tr>
    <tr>
        <td>Eating Habits</td>
        <td>Eats everyone's leftovers</td>
        <td>Nibbles at food</td>
        <td>Hearty eater</td>
        <td>Will eat till he explodes</td>
    </tr>
</table>`
var td = new TurndownService()
const b = new Bench()

console.log('Native convert:\n', convert(testStr))

b.add(`Native convert`, () => {
    convert(testStr)
})

b.add(`JavaScript convert`, () => {
    td.turndown(testStr)
})

await b.run()

console.table(b.table())
