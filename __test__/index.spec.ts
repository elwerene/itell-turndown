import test from 'ava'

import { convert } from '../index'

test('sync function from native code', (t) => {
    const html = '<h1>Heading</h1>'
    console.log('HTML: ', html)
    console.log('MD: ', convert(html))
    t.is(convert(html), '# Heading')
})
