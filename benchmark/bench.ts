import { Bench } from 'tinybench'

import { convert } from '../index.js'

function add(a: number) {
  return a + 100
}

const b = new Bench()

b.add('Native convert "<div>hello</div>"', () => {
  convert("<div>hello</div>")
})

b.add('JavaScript convert "<div>hello</div>"', () => {
  add(10)
})

await b.run()

console.table(b.table())
