# dom2html
Serializes a dom-like JSON tree into HTML.
This is helpful if you end up with a DOM-like JSON object and need to serialize it to HTML.
An example use case is using [puppeteer](https://pptr.dev/) to get the DOM tree from a page 
and wanting to recreate the flattened HTML including shadow roots, and by default, the contents of iframes.

## Usage

```javascript
const serialize = require('dom2html');
const jsonDOM = require('./dom.json');

console.log(serialize(jsonDOM, true, 'all'));
```

## Parameters
serialize accepts three inputs
```javascript
serialize(jsonDOM, includeIframes, domErrorOutput)
```
*jsonDom* is the nodelke JSON tree
*includeIframes* is a boolean flag to define if you want to serialize iframe content, **optional, defaults to true**
*domErrorOutput* is a string that defines where dom2html outputs errors if it cannot serialzie a node, 'all' outputs to console & inserts a html comment in the outputted html, 'console' only outputs to console.log(), 'comments' only outputs to html comments and silent outputs to neither. **optional, defaults to all**

## An example

Let's say we have this JSON representation of a webpage:

```json
{
	"nodeId": 1,
	"backendNodeId": 3,
	"nodeType": 9,
	"nodeName": "#document",
	"localName": "",
	"nodeValue": "",
	"childNodeCount": 2,
	"children": [{
		"nodeId": 2,
		"parentId": 1,
		"backendNodeId": 8,
		"nodeType": 10,
		"nodeName": "html",
		"localName": "",
		"nodeValue": "",
		"publicId": "",
		"systemId": ""
	}, {
		"nodeId": 3,
		"parentId": 1,
		"backendNodeId": 9,
		"nodeType": 1,
		"nodeName": "HTML",
		"localName": "html",
		"nodeValue": "",
		"childNodeCount": 2,
		"children": [{
			"nodeId": 4,
			"parentId": 3,
			"backendNodeId": 10,
			"nodeType": 1,
			"nodeName": "HEAD",
			"localName": "head",
			"nodeValue": "",
			"childNodeCount": 1,
			"children": [{
				"nodeId": 5,
				"parentId": 4,
				"backendNodeId": 11,
				"nodeType": 1,
				"nodeName": "STYLE",
				"localName": "style",
				"nodeValue": "",
				"childNodeCount": 1,
				"children": [{
					"nodeId": 6,
					"parentId": 5,
					"backendNodeId": 12,
					"nodeType": 3,
					"nodeName": "#text",
					"localName": "",
					"nodeValue": "\n      h1 { color: red; }\n    "
				}],
				"attributes": []
			}],
			"attributes": []
		}, {
			"nodeId": 7,
			"parentId": 3,
			"backendNodeId": 13,
			"nodeType": 1,
			"nodeName": "BODY",
			"localName": "body",
			"nodeValue": "",
			"childNodeCount": 5,
			"children": [{
				"nodeId": 8,
				"parentId": 7,
				"backendNodeId": 4,
				"nodeType": 1,
				"nodeName": "H1",
				"localName": "h1",
				"nodeValue": "",
				"childNodeCount": 1,
				"children": [{
					"nodeId": 9,
					"parentId": 8,
					"backendNodeId": 14,
					"nodeType": 3,
					"nodeName": "#text",
					"localName": "",
					"nodeValue": "Hello World!"
				}],
				"attributes": []
			}, {
				"nodeId": 10,
				"parentId": 7,
				"backendNodeId": 5,
				"nodeType": 1,
				"nodeName": "P",
				"localName": "p",
				"nodeValue": "",
				"childNodeCount": 1,
				"children": [{
					"nodeId": 11,
					"parentId": 10,
					"backendNodeId": 15,
					"nodeType": 3,
					"nodeName": "#text",
					"localName": "",
					"nodeValue": "This is some content."
				}],
				"attributes": []
			}, {
				"nodeId": 12,
				"parentId": 7,
				"backendNodeId": 16,
				"nodeType": 1,
				"nodeName": "P",
				"localName": "p",
				"nodeValue": "",
				"childNodeCount": 1,
				"children": [{
					"nodeId": 13,
					"parentId": 12,
					"backendNodeId": 6,
					"nodeType": 1,
					"nodeName": "IMG",
					"localName": "img",
					"nodeValue": "",
					"childNodeCount": 0,
					"children": [],
					"attributes": ["src", "http://placekitten.com/200/300", "alt", "Some image"]
				}],
				"attributes": []
			}, {
				"nodeId": 14,
				"parentId": 7,
				"backendNodeId": 7,
				"nodeType": 1,
				"nodeName": "P",
				"localName": "p",
				"nodeValue": "",
				"childNodeCount": 1,
				"children": [{
					"nodeId": 15,
					"parentId": 14,
					"backendNodeId": 17,
					"nodeType": 3,
					"nodeName": "#text",
					"localName": "",
					"nodeValue": "Data-Attributes!"
				}],
				"attributes": ["data-test", "works"]
			}, {
				"nodeId": 16,
				"parentId": 7,
				"backendNodeId": 18,
				"nodeType": 1,
				"nodeName": "SCRIPT",
				"localName": "script",
				"nodeValue": "",
				"childNodeCount": 1,
				"children": [{
					"nodeId": 17,
					"parentId": 16,
					"backendNodeId": 19,
					"nodeType": 3,
					"nodeName": "#text",
					"localName": "",
					"nodeValue": " window.title = 'Hello world!' "
				}],
				"attributes": []
			}],
			"attributes": []
		}],
		"attributes": ["lang", "en"],
		"frameId": "D46CBAE99B5CABE7F1FF6DDEE269E6A6"
	}],
	"documentURL": "http://test.local/test-simple.html",
	"baseURL": "http://test.local/test-simple.html",
	"xmlVersion": ""
}
```

and we want to get the HTML representation:

```html
<html>
<head>
  <style>
    h1 { color: red; }
  </style>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is some content.</p>
    <p><img src="http://placekitten.com/200/300" alt="Some image"></p>
    <p data-test="works">Data-Attributes!</p>
    <script>window.title = 'Hello world!'; </script>
</body>
</html>
```

For this we can use the following code:

```javascript
const serialize = require('dom2html');
const jsonDOM = require('./dom.json');

console.log(serialize(jsonDOM));
```

## Prevent <iframe> content from being serialized

If your DOM-like tree contains iframe nodes, and you don't want to serialize the contents of these and have them included in the outputted html, add FALSE as a flag:
```javascript
const serialize = require('dom2html');
const jsonDOM = require('./dom.json');

console.log(serialize(jsonDOM, FALSE));
```

## Suppress errors

If you wanted to suppress any notifications of errors of unsupported node types, you could add the 'silent' value
```javascript
const serialize = require('dom2html');
const jsonDOM = require('./dom.json');

console.log(serialize(jsonDOM, TRUE, 'silent'));
```

## Current state

This is the first release and this thing has been built in a day, basically.
Expect bugs, missing features, dragons...but any help is much appreciated!

## Contributing

Contributions are super welcome!
Please create an issue with your idea and feel free to submit pull requests :)