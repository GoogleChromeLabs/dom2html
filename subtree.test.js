const {NODE_TYPES} = require("./dom-node");
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
});
