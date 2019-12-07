const domNode = require('./dom-node');

module.exports = {
  /**
   * 
   * @param {JSDOM.Document} document The document to be used to create the final DOM nodes
   * @param {node-like} nodeLike A JSON object representing a subtree
   * @param {function} nodeCallback (optional) A callback that receives the node-like and the created element after attributes are copied but before the subtree is created.
   * @returns {JSDOM.Node} The DOM subtree
   */
  constructSubtreeForNode: function(document, nodeLike, nodeCallback) {
    const elem = domNode.createElemForNode(document, nodeLike);

    if(!nodeLike.children) nodeLike.children = []; // normalise weird nodes.

    // copy attributes
    domNode.setAttributesFromNode(elem, nodeLike);

    // if we have a callback that we can call, call it.
    if(nodeCallback) {
      nodeCallback(nodeLike, elem);
    }

    // if it's a shadow host, use that...
    if(nodeLike.shadowRoots && nodeLike.shadowRoots.length > 0) {
      const shadowTree = this.constructShadowTree(document, nodeLike, nodeLike.shadowRoots[0]);
      elem.appendChild(shadowTree);
      return elem;
    }

    // if it's not a shadow host, copy children..
    nodeLike.children
      .map(child => this.constructSubtreeForNode(document, child, nodeCallback))
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
  constructShadowTree: function(document, hostNode, shadowTree) {
    // Documented process at https://drafts.csswg.org/css-scoping/#flattening

    // create a lookup dict of children by backendNodeId for distributing nodes later
    const backendNodes = {};
    hostNode.children.forEach(child => backendNodes[child.backendNodeId] = child);

    // create the shadow host fragment
    const elem = domNode.createElemForNode(document, shadowTree);

    function distributeNodes(node, elem) {
      if(!node.distributedNodes) return;
      node.distributedNodes.forEach(distributedNode => {
        const distributedElem = this.constructSubtreeForNode(document, backendNodes[distributedNode.backendNodeId]);
        elem.appendChild(distributedElem);
      })
    }

    // walk the tree...
    shadowTree.children
      .map(child => {
        return this.constructSubtreeForNode(document, child, distributeNodes.bind(this))
      })
      .forEach(child => elem.appendChild(child))

    return elem;
  }
}