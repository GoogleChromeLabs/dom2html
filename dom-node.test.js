const {
  createElemForNode,
  setAttributesFromNode,
  NODE_TYPES
} = require("./dom-node");

describe("createElemForNode", () => {
  test("ELEMENT_NODE node type", () => {
    const nodeLike = {
      nodeType: NODE_TYPES.ELEMENT_NODE,
      nodeName: "HTML"
    };

    const result = createElemForNode(document, nodeLike);
    const expected = document.createElement(nodeLike.nodeName);

    expect(result).toEqual(expected);
  });

  test("TEXT_NODE node type", () => {
    const nodeLike = {
      nodeType: NODE_TYPES.TEXT_NODE,
      nodeValue: "test value"
    };

    const result = createElemForNode(document, nodeLike);
    const expected = document.createTextNode(nodeLike.nodeValue);

    expect(result).toEqual(expected);
  });

  test("PROCESSING_INSTRUCTION_NODE node type", () => {
    const nodeLike = {
      nodeType: NODE_TYPES.PROCESSING_INSTRUCTION_NODE
    };

    const result = createElemForNode(document, nodeLike);
    const expected = document.createElement("div");

    expect(result).toEqual(expected);
  });

  test("COMMENT_NODE node type", () => {
    const nodeLike = {
      nodeType: NODE_TYPES.COMMENT_NODE,
      nodeValue: "test value"
    };

    const result = createElemForNode(document, nodeLike);
    const expected = document.createComment(nodeLike.nodeValue);

    expect(result).toEqual(expected);
  });

  test("DOCUMENT_NODE node type", () => {
    const nodeLike = {
      nodeType: NODE_TYPES.DOCUMENT_NODE
    };

    const result = createElemForNode(document, nodeLike);
    const expected = document.createDocumentFragment();

    expect(result).toEqual(expected);
  });

  test("DOCUMENT_TYPE_NODE node type", () => {
    const nodeLike = {
      nodeType: NODE_TYPES.DOCUMENT_TYPE_NODE
    };

    const result = createElemForNode(document, nodeLike);
    const expected = document.createComment("unsupported element");

    expect(result).toEqual(expected);
  });

  test("DOCUMENT_FRAGMENT_NODE node type", () => {
    const nodeLike = {
      nodeType: NODE_TYPES.DOCUMENT_FRAGMENT_NODE
    };

    const result = createElemForNode(document, nodeLike);
    const expected = document.createDocumentFragment();

    expect(result).toEqual(expected);
  });

  test("CDATA_NODE node type", () => {
    const nodeLike = {
      nodeType: NODE_TYPES.CDATA_NODE,
      nodeValue: "test value"
    };

    const result = createElemForNode(document, nodeLike);
    const expected = document.createCDATASection(nodeLike.nodeValue);

    expect(result).toEqual(expected);
  });
});

describe("setAttributesFromNode", () => {
  test("sets attributes from node", () => {
    const nodeLike = {
      attributes: ["src", "http://placekitten.com/200/300", "alt", "Some image"]
    };
    const element = document.createElement("img");

    setAttributesFromNode(element, nodeLike);

    for (let i = 0; i < nodeLike.attributes.length; i += 2) {
      expect(element.getAttribute(nodeLike.attributes[i])).toBe(
        nodeLike.attributes[i + 1]
      );
    }
  });
});
