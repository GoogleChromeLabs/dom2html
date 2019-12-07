const jsdom = require('jsdom');
const { JSDOM } = jsdom; // ughhh, why?
const domNode = require('./dom-node');
const subtree = require('./subtree');

module.exports = function serialize(domLike) {
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
      const child = subtree.constructSubtreeForNode(document, n);
      rootNode.appendChild(child);      
    });
  });
  
  return outputDOM.serialize();
}

