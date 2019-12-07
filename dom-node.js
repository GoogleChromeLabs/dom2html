module.exports = {

  /**
   * Creates a JSDOM.Node reflecting the node-like argument
   * @param {JSDOM.Document} document The document that is used to create the node
   * @param {node-like} nodeLike JSON object representing a DOM Node that will be turned into a JSDOM node
   * @returns {JSDOM.Node} A JSDOM.Node representing the node-like argument
   */
  createElemForNode: function(document, nodeLike) {
    switch (nodeLike.nodeType) {
      case 1: // ELEMENT_NODE
        return document.createElement(nodeLike.nodeName);
        break
      case 3: // TEXT_NODE
        return document.createTextNode(nodeLike.nodeValue);
        break
      case 4: //CDATA_NODE
          return document.createCDATASection(nodeLike.nodeValue);    
        break
      case 7: //PROCESSING_INSTRUCTION_NODE
        console.log('Found unsupported node:', nodeLike);
        return document.createElement('div');
        break
      case 8: // COMMENT_NODE
        return document.createComment(nodeLike.nodeValue);
        break
      case 9: // DOCUMENT_NODE
        console.log('Found unsupported node:', nodeLike);
        return document.createDocumentFragment();
        break
      case 10: // DOCUMENT_TYPE_NODE
        console.log('Found unsupported node:', nodeLike);
        return document.createComment('unsupported element');
        break
      case 11: // DOCUMENT_FRAGMENT_NODE
        return document.createDocumentFragment();
        break
    }
  },

  /**
   * 
   * @param {JSDOM.Node} elem The target element which receives the arguments from the node-like
   * @param {node-like} nodeLike A JSON object representing a DOM node as the source of the arguments to be set
   */
  setAttributesFromNode: function(elem, nodeLike) {
    if(nodeLike.attributes) {
      for(let i=0; i<nodeLike.attributes.length;i+=2) {
        elem.setAttribute(nodeLike.attributes[i], nodeLike.attributes[i+1]);
      }
    }
  }  
}