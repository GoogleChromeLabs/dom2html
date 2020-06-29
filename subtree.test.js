const {NODE_TYPES, createElemForNode} = require("./dom-node");
const {constructSubtreeForNode, constructShadowTree} = require("./subtree");

describe("constructSubtreeForNode", () => {
  test("empty subtree", () => {
    const nodeName = "DIV";
    const subTree = constructSubtreeForNode(document, {
      nodeType: NODE_TYPES.ELEMENT_NODE,
      nodeName: nodeName,
      children: []
    });
    
    expect(subTree.tagName).toEqual(nodeName);
    expect(subTree.children.length).toEqual(0);
  });

  // TODO Write test continue after fix `this` keyword of subtree.js
  // test("shadow root", () => {
  //   const nodeName = "DIV";
  //   const subTree = constructSubtreeForNode(document, {
  //     nodeType: NODE_TYPES.ELEMENT_NODE,
  //     nodeName: nodeName,
  //     children: [createElemForNode(document, 'all', {
  //       nodeType: NODE_TYPES.ELEMENT_NODE,
  //       nodeName: nodeName
  //     })],
  //     shadowRoots: [createElemForNode(document, 'all', {
  //       nodeType: NODE_TYPES.ELEMENT_NODE,
  //       nodeName: nodeName
  //     })]
  //   });
  // });
});
