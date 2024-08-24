const { convert } = require('./index')

converter = convert

console.assert(convert("<h1>Heading</h1>") === "# Heading", 'Simple test failed')

console.info('Simple test passed')
