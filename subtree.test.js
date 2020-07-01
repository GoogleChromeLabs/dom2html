const {NODE_TYPES} = require("./dom-node");
const subtree = require("./subtree");

const divNodeLike = {
  nodeType: NODE_TYPES.ELEMENT_NODE,
  nodeName: "DIV",
  children: []
};

describe("constructSubtreeForNode", () => {
  test("empty children", () => {
    const subTree = subtree.constructSubtreeForNode(document, divNodeLike);
    expect(subTree.tagName).toEqual("DIV");
    expect(subTree.children.length).toEqual(0);
  });

  test("basic children ", () => {
    const subTree = subtree.constructSubtreeForNode(document, {
      ...divNodeLike,
      children: [{
        ...divNodeLike,
        children: [
          divNodeLike,
          divNodeLike,
          divNodeLike
        ]
      }]
    });
    expect(subTree.children.length).toEqual(1);
    expect(subTree.children[0].children.length).toEqual(3);
  });
  
  test("include iframes", () => {
    const subTree = subtree.constructSubtreeForNode(document, {
      nodeType: NODE_TYPES.DOCUMENT_NODE,
      nodeName: "#document",
      contentDocument: {
        children: [divNodeLike]
      }
    }, true);
    expect(subTree.children.length).toEqual(1);
  });

  test("node callback ", () => {
    const className = 'active';
    const subTree = subtree.constructSubtreeForNode(
      document,
      divNodeLike,
      undefined,
      'all',
      (nodeLike, element) => {
        element.className = className;
        expect(nodeLike).toEqual(divNodeLike);
      }
    );
    expect(subTree.className).toEqual(className);
  });
});

describe("constructShadowTree", () => {
  test("distributed nodes", () => {
    const first = { ...divNodeLike, backendNodeId: 1 };
    const second = { ...divNodeLike, backendNodeId: 3 };
    const third = { ...divNodeLike, backendNodeId: 5 };
    const shadowTree = subtree.constructShadowTree(
      document,
      {
        children: [
          first,
          second,
          third
        ]
      },
      undefined,
      'all',
      {
        ...divNodeLike,
        children: [{
          ...divNodeLike,
          distributedNodes: [
            first,
            third
          ]
        }]
      }
    );
    expect(shadowTree.children[0].children.length).toEqual(2);
  });
});
