/*
Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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

test('serializes and inlines an iframe', () => {
  const result = serialize(require('./test/iframe.json'));
  const expected = fs.readFileSync('./test/inlineIframe-true.html', 'utf8');
  expect(result).toBe(expected);
});
test('serializes and do not inline an iframe', () => {
  const result = serialize(require('./test/iframe.json'), false);
  const expected = fs.readFileSync('./test/inlineIframe-false.html', 'utf8');
  expect(result).toBe(expected);
});