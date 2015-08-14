'use strict';

var DefaultTreeAdapter = require('../tree_adapters/default'),
    Doctype            = require('../common/doctype'),
    HTML               = require('../common/html');

var assign = require('../utils/object-assign');

//Aliases
var NS = HTML.NAMESPACES;

//Default serializer options
var DEFAULT_OPTIONS = {
    encodeHtmlEntities: true
};

//Escaping regexes
var AMP_REGEX          = /&/g,
    NBSP_REGEX         = /\u00a0/g,
    DOUBLE_QUOTE_REGEX = /"/g,
    LT_REGEX           = /</g,
    GT_REGEX           = />/g;

//Escape string
function escapeString (str, attrMode) {
    str = str
        .replace(AMP_REGEX, '&amp;')
        .replace(NBSP_REGEX, '&nbsp;');

    if (attrMode)
        str = str.replace(DOUBLE_QUOTE_REGEX, '&quot;');

    else {
        str = str
            .replace(LT_REGEX, '&lt;')
            .replace(GT_REGEX, '&gt;');
    }

    return str;
}


//Serializer
var Serializer = module.exports = function (treeAdapter, options) {
    this.treeAdapter = treeAdapter || DefaultTreeAdapter;
    this.options     = assign({}, DEFAULT_OPTIONS, options);
};


//API
Serializer.prototype.serialize = function (node) {
    this.html = '';
    this._serializeChildNodes(node);

    return this.html;
};


//Internals
Serializer.prototype._serializeChildNodes = function (parentNode) {
    var childNodes = this.treeAdapter.getChildNodes(parentNode);

    if (childNodes) {
        for (var i = 0, cnLength = childNodes.length; i < cnLength; i++) {
            var currentNode = childNodes[i];

            if (this.treeAdapter.isElementNode(currentNode))
                this._serializeElement(currentNode);

            else if (this.treeAdapter.isTextNode(currentNode))
                this._serializeTextNode(currentNode);

            else if (this.treeAdapter.isCommentNode(currentNode))
                this._serializeCommentNode(currentNode);

            else if (this.treeAdapter.isDocumentTypeNode(currentNode))
                this._serializeDocumentTypeNode(currentNode);
        }
    }
};

Serializer.prototype._serializeElement = function (node) {
    var tn          = this.treeAdapter.getTagName(node),
        ns          = this.treeAdapter.getNamespaceURI(node),
        qualifiedTn = (ns === NS.HTML || ns === NS.SVG || ns === NS.MATHML) ? tn : (ns + ':' + tn);

    this.html += '<' + qualifiedTn;
    this._serializeAttributes(node);
    this.html += '>';

    if (tn !== 'area' && tn !== 'base' && tn !== 'basefont' && tn !== 'bgsound' && tn !== 'br' &&
        tn !== 'col' && tn !== 'embed' && tn !== 'frame' && tn !== 'hr' && tn !== 'img' && tn !== 'input' &&
        tn !== 'keygen' && tn !== 'link' && tn !== 'menuitem' && tn !== 'meta' && tn !== 'param' &&
        tn !== 'source' && tn !== 'track' && tn !== 'wbr') {

        if (tn === 'pre' || tn === 'textarea' || tn === 'listing') {
            var firstChild = this.treeAdapter.getFirstChild(node);

            if (firstChild && this.treeAdapter.isTextNode(firstChild)) {
                var content = this.treeAdapter.getTextNodeContent(firstChild);

                if (content[0] === '\n')
                    this.html += '\n';
            }
        }

        var childNodesHolder = tn === 'template' && ns === NS.HTML ?
                               this.treeAdapter.getChildNodes(node)[0] :
                               node;

        this._serializeChildNodes(childNodesHolder);
        this.html += '</' + qualifiedTn + '>';
    }
};

Serializer.prototype._serializeAttributes = function (node) {
    var attrs = this.treeAdapter.getAttrList(node);

    for (var i = 0, attrsLength = attrs.length; i < attrsLength; i++) {
        var attr  = attrs[i],
            value = this.options.encodeHtmlEntities ? escapeString(attr.value, true) : attr.value;

        this.html += ' ';

        if (!attr.namespace)
            this.html += attr.name;

        else if (attr.namespace === NS.XML)
            this.html += 'xml:' + attr.name;

        else if (attr.namespace === NS.XMLNS) {
            if (attr.name !== 'xmlns')
                this.html += 'xmlns:';

            this.html += attr.name;
        }

        else if (attr.namespace === NS.XLINK)
            this.html += 'xlink:' + attr.name;

        else
            this.html += attr.namespace + ':' + attr.name;

        this.html += '="' + value + '"';
    }
};

Serializer.prototype._serializeTextNode = function (node) {
    var content  = this.treeAdapter.getTextNodeContent(node),
        parent   = this.treeAdapter.getParentNode(node),
        parentTn = void 0;

    if (parent && this.treeAdapter.isElementNode(parent))
        parentTn = this.treeAdapter.getTagName(parent);

    if (parentTn === 'style' || parentTn === 'script' || parentTn === 'xmp' || parentTn === 'iframe' ||
        parentTn === 'noembed' || parentTn === 'noframes' || parentTn === 'plaintext' || parentTn === 'noscript') {
        this.html += content;
    }

    else
        this.html += this.options.encodeHtmlEntities ? escapeString(content, false) : content;
};

Serializer.prototype._serializeCommentNode = function (node) {
    this.html += '<!--' + this.treeAdapter.getCommentNodeContent(node) + '-->';
};

Serializer.prototype._serializeDocumentTypeNode = function (node) {
    var name     = this.treeAdapter.getDocumentTypeNodeName(node),
        publicId = this.treeAdapter.getDocumentTypeNodePublicId(node),
        systemId = this.treeAdapter.getDocumentTypeNodeSystemId(node);

    this.html += '<' + Doctype.serializeContent(name, publicId, systemId) + '>';
};
