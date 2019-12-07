const serialize = require('./serialize');
const fs = require('fs');

test('serializes a simple HTML document', () => {
  const result = serialize(require('./test/simple.json'));
  const expected = fs.readFileSync('./test/simple.html', 'utf8');
  expect(result).toBe(expected);
});

test('serializes a shadow DOM', () => {
  const result = serialize(require('./test/web-component.json'));
  const expected = fs.readFileSync('./test/web-component.html', 'utf8');
  expect(result).toBe(expected);
});