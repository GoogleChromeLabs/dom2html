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
const jsdom = require('jsdom');
const { JSDOM } = jsdom; // ughhh, why?
const domNode = require('./dom-node');
const subtree = require('./subtree');
/* domlike = the dom like object to serialize
includeIframes = include nodes from iframe contentDocument, boolean
domErrorOutput = controls how errors are outputed if an unsupported node or element is encountered, string 
'all' outputs to console.log & injects a html comment into the outputted html
'console' outputs details to console log only
'comments' outputs error details to html comment only */
module.exports = function serialize(domLike, includeIframes = true, domErrorOutput = 'all') {
  const outputDOM = new JSDOM();
  const document = outputDOM.window.document;
  const rootNode = document.children[0];
  domNode.setAttributesFromNode(rootNode, domLike.children.slice(-1)[0]);

  // clear the root node (head and body are automatically created by JSDom)
  Array.from(rootNode.children).forEach(child => {
    rootNode.removeChild(child);
  });

  domLike.children.forEach(node => {
    if (node.childNodeCount === undefined) return; // weird, useless noise in the tree for some reason

    node.children.forEach(n => {
      if (n.childNodeCount === undefined) return; // weird, useless noise in the tree for some reason
      const child = subtree.constructSubtreeForNode(document, n,  includeIframes, domErrorOutput);
      rootNode.appendChild(child);      
    });
  });
  
  return outputDOM.serialize();
}
