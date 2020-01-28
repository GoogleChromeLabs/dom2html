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

const NODE_TYPES = Object.freeze({
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  CDATA_NODE: 4,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11
});

module.exports = {
  /**
   * Creates a JSDOM.Node reflecting the node-like argument
   * @param {JSDOM.Document} document The document that is used to create the node
   * @param {node-like} nodeLike JSON object representing a DOM Node that will be turned into a JSDOM node
   * @returns {JSDOM.Node} A JSDOM.Node representing the node-like argument
   */
  createElemForNode: function(document, nodeLike) {
    switch (nodeLike.nodeType) {
      case NODE_TYPES.ELEMENT_NODE: // ELEMENT_NODE
        return document.createElement(nodeLike.nodeName);
        break;
      case NODE_TYPES.TEXT_NODE: // TEXT_NODE
        return document.createTextNode(nodeLike.nodeValue);
        break;
      case NODE_TYPES.CDATA_NODE: //CDATA_NODE
        return document.createCDATASection(nodeLike.nodeValue);
        break;
      case NODE_TYPES.PROCESSING_INSTRUCTION_NODE: //PROCESSING_INSTRUCTION_NODE
        console.log("Found unsupported node:", nodeLike);
        return document.createElement("div");
        break;
      case NODE_TYPES.COMMENT_NODE: // COMMENT_NODE
        return document.createComment(nodeLike.nodeValue);
        break;
      case NODE_TYPES.DOCUMENT_NODE: // DOCUMENT_NODE
        console.log("Found unsupported node:", nodeLike);
        return document.createDocumentFragment();
        break;
      case NODE_TYPES.DOCUMENT_TYPE_NODE: // DOCUMENT_TYPE_NODE
        console.log("Found unsupported node:", nodeLike);
        return document.createComment("unsupported element");
        break;
      case NODE_TYPES.DOCUMENT_FRAGMENT_NODE: // DOCUMENT_FRAGMENT_NODE
        return document.createDocumentFragment();
        break;
    }
  },

  /**
   *
   * @param {JSDOM.Node} elem The target element which receives the arguments from the node-like
   * @param {node-like} nodeLike A JSON object representing a DOM node as the source of the arguments to be set
   */
  setAttributesFromNode: function(elem, nodeLike) {
    if (nodeLike.attributes) {
      for (let i = 0; i < nodeLike.attributes.length; i += 2) {
        elem.setAttribute(nodeLike.attributes[i], nodeLike.attributes[i + 1]);
      }
    }
  },
  NODE_TYPES
};
