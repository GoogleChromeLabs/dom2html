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
const domNode = require('./dom-node');

module.exports = {
  /**
   * 
   * @param {JSDOM.Document} document The document to be used to create the final DOM nodes
   * @param {node-like} nodeLike A JSON object representing a subtree
   * @param {function} nodeCallback (optional) A callback that receives the node-like and the created element after attributes are copied but before the subtree is created.
   * @returns {JSDOM.Node} The DOM subtree
   */
  constructSubtreeForNode: function(document, nodeLike, includeIframes, domErrorOutput, nodeCallback) {
    const elem = domNode.createElemForNode(document, domErrorOutput, nodeLike);

    if(!nodeLike.children) nodeLike.children = []; // normalise weird nodes.

    // copy attributes
    domNode.setAttributesFromNode(elem, nodeLike);

    // if we have a callback that we can call, call it.
    if(nodeCallback) {
      nodeCallback(nodeLike, elem);
    }

    // if it's a shadow host, use that...
    if(nodeLike.shadowRoots && nodeLike.shadowRoots.length > 0) {
      const shadowTree = this.constructShadowTree(document, nodeLike, includeIframes, domErrorOutput, nodeLike.shadowRoots[0]);
      elem.appendChild(shadowTree);
      return elem;
    }

    // if it's an iframe, and includeIframes is true copy the children of contentDocument.
    if(includeIframes && nodeLike.contentDocument && nodeLike.contentDocument.children.length > 0) {
    nodeLike.contentDocument.children
      .map(child => this.constructSubtreeForNode(document, child, includeIframes, domErrorOutput, nodeCallback))
      .forEach(child => {
        elem.appendChild(child)
      return elem;
      });
    }

    // if it's not a shadow host, copy children..
    nodeLike.children
      .map(child => this.constructSubtreeForNode(document, child, includeIframes, domErrorOutput, nodeCallback))
      .forEach(child => {
        elem.appendChild(child)
      });

    return elem;
  },

  /**
   * Takes a shadow host node and its shadow tree and returns a JSDOM subtree. 
   * Also handles distributed nodes (e.g. in <slot> elements)
   * @param {JSDOM.document} document 
   * @param {dom-like node} hostNode 
   * @param {dom-like node} shadowTree 
   * @returns {JSDOM.Node} JSDOM.Node with all children
   */
  constructShadowTree: function(document, hostNode, includeIframes, domErrorOutput, shadowTree) {
    // Documented process at https://drafts.csswg.org/css-scoping/#flattening

    // create a lookup dict of children by backendNodeId for distributing nodes later
    const backendNodes = {};
    hostNode.children.forEach(child => backendNodes[child.backendNodeId] = child);

    // create the shadow host fragment
    const elem = domNode.createElemForNode(document, domErrorOutput, shadowTree);

    function distributeNodes(node, elem) {
      if(!node.distributedNodes) return;
      node.distributedNodes.forEach(distributedNode => {
        const distributedElem = this.constructSubtreeForNode(document, backendNodes[distributedNode.backendNodeId], includeIframes, domErrorOutput);
        elem.appendChild(distributedElem);
      })
    }

    // walk the tree...
    shadowTree.children
      .map(child => {
        return this.constructSubtreeForNode(document, child, includeIframes, domErrorOutput, distributeNodes.bind(this))
      })
      .forEach(child => elem.appendChild(child))

    return elem;
  }
}
