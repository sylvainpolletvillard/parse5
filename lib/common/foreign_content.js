'use strict';

var Tokenizer = require('../tokenization/tokenizer'),
    HTML      = require('./html');

//Aliases
var NS    = HTML.NAMESPACES;


//MIME types
var MIME_TYPES = {
    TEXT_HTML:       'text/html',
    APPLICATION_XML: 'application/xhtml+xml'
};

//Attributes
var DEFINITION_URL_ATTR          = 'definitionurl',
    ADJUSTED_DEFINITION_URL_ATTR = 'definitionURL',
    SVG_ATTRS_ADJUSTMENT_MAP     = {
        'attributename':             'attributeName',
        'attributetype':             'attributeType',
        'basefrequency':             'baseFrequency',
        'baseprofile':               'baseProfile',
        'calcmode':                  'calcMode',
        'clippathunits':             'clipPathUnits',
        'contentscripttype':         'contentScriptType',
        'contentstyletype':          'contentStyleType',
        'diffuseconstant':           'diffuseConstant',
        'edgemode':                  'edgeMode',
        'externalresourcesrequired': 'externalResourcesRequired',
        'filterres':                 'filterRes',
        'filterunits':               'filterUnits',
        'glyphref':                  'glyphRef',
        'gradienttransform':         'gradientTransform',
        'gradientunits':             'gradientUnits',
        'kernelmatrix':              'kernelMatrix',
        'kernelunitlength':          'kernelUnitLength',
        'keypoints':                 'keyPoints',
        'keysplines':                'keySplines',
        'keytimes':                  'keyTimes',
        'lengthadjust':              'lengthAdjust',
        'limitingconeangle':         'limitingConeAngle',
        'markerheight':              'markerHeight',
        'markerunits':               'markerUnits',
        'markerwidth':               'markerWidth',
        'maskcontentunits':          'maskContentUnits',
        'maskunits':                 'maskUnits',
        'numoctaves':                'numOctaves',
        'pathlength':                'pathLength',
        'patterncontentunits':       'patternContentUnits',
        'patterntransform':          'patternTransform',
        'patternunits':              'patternUnits',
        'pointsatx':                 'pointsAtX',
        'pointsaty':                 'pointsAtY',
        'pointsatz':                 'pointsAtZ',
        'preservealpha':             'preserveAlpha',
        'preserveaspectratio':       'preserveAspectRatio',
        'primitiveunits':            'primitiveUnits',
        'refx':                      'refX',
        'refy':                      'refY',
        'repeatcount':               'repeatCount',
        'repeatdur':                 'repeatDur',
        'requiredextensions':        'requiredExtensions',
        'requiredfeatures':          'requiredFeatures',
        'specularconstant':          'specularConstant',
        'specularexponent':          'specularExponent',
        'spreadmethod':              'spreadMethod',
        'startoffset':               'startOffset',
        'stddeviation':              'stdDeviation',
        'stitchtiles':               'stitchTiles',
        'surfacescale':              'surfaceScale',
        'systemlanguage':            'systemLanguage',
        'tablevalues':               'tableValues',
        'targetx':                   'targetX',
        'targety':                   'targetY',
        'textlength':                'textLength',
        'viewbox':                   'viewBox',
        'viewtarget':                'viewTarget',
        'xchannelselector':          'xChannelSelector',
        'ychannelselector':          'yChannelSelector',
        'zoomandpan':                'zoomAndPan'
    },
    XML_ATTRS_ADJUSTMENT_MAP     = {
        'xlink:actuate': { prefix: 'xlink', name: 'actuate', namespace: NS.XLINK },
        'xlink:arcrole': { prefix: 'xlink', name: 'arcrole', namespace: NS.XLINK },
        'xlink:href':    { prefix: 'xlink', name: 'href', namespace: NS.XLINK },
        'xlink:role':    { prefix: 'xlink', name: 'role', namespace: NS.XLINK },
        'xlink:show':    { prefix: 'xlink', name: 'show', namespace: NS.XLINK },
        'xlink:title':   { prefix: 'xlink', name: 'title', namespace: NS.XLINK },
        'xlink:type':    { prefix: 'xlink', name: 'type', namespace: NS.XLINK },
        'xml:base':      { prefix: 'xml', name: 'base', namespace: NS.XML },
        'xml:lang':      { prefix: 'xml', name: 'lang', namespace: NS.XML },
        'xml:space':     { prefix: 'xml', name: 'space', namespace: NS.XML },
        'xmlns':         { prefix: '', name: 'xmlns', namespace: NS.XMLNS },
        'xmlns:xlink':   { prefix: 'xmlns', name: 'xlink', namespace: NS.XMLNS }

    };

//SVG tag names adjustment map
var SVG_TAG_NAMES_ADJUSTMENT_MAP = {
    'altglyph':            'altGlyph',
    'altglyphdef':         'altGlyphDef',
    'altglyphitem':        'altGlyphItem',
    'animatecolor':        'animateColor',
    'animatemotion':       'animateMotion',
    'animatetransform':    'animateTransform',
    'clippath':            'clipPath',
    'feblend':             'feBlend',
    'fecolormatrix':       'feColorMatrix',
    'fecomponenttransfer': 'feComponentTransfer',
    'fecomposite':         'feComposite',
    'feconvolvematrix':    'feConvolveMatrix',
    'fediffuselighting':   'feDiffuseLighting',
    'fedisplacementmap':   'feDisplacementMap',
    'fedistantlight':      'feDistantLight',
    'feflood':             'feFlood',
    'fefunca':             'feFuncA',
    'fefuncb':             'feFuncB',
    'fefuncg':             'feFuncG',
    'fefuncr':             'feFuncR',
    'fegaussianblur':      'feGaussianBlur',
    'feimage':             'feImage',
    'femerge':             'feMerge',
    'femergenode':         'feMergeNode',
    'femorphology':        'feMorphology',
    'feoffset':            'feOffset',
    'fepointlight':        'fePointLight',
    'fespecularlighting':  'feSpecularLighting',
    'fespotlight':         'feSpotLight',
    'fetile':              'feTile',
    'feturbulence':        'feTurbulence',
    'foreignobject':       'foreignObject',
    'glyphref':            'glyphRef',
    'lineargradient':      'linearGradient',
    'radialgradient':      'radialGradient',
    'textpath':            'textPath'
};

//Tags that causes exit from foreign content
var EXITS_FOREIGN_CONTENT = {
    'b':          true,
    'big':        true,
    'blockquote': true,
    'body':       true,
    'br':         true,
    'center':     true,
    'code':       true,
    'dd':         true,
    'div':        true,
    'dl':         true,
    'dt':         true,
    'em':         true,
    'embed':      true,
    'h1':         true,
    'h2':         true,
    'h3':         true,
    'h4':         true,
    'h5':         true,
    'h6':         true,
    'head':       true,
    'hr':         true,
    'i':          true,
    'img':        true,
    'li':         true,
    'listing':    true,
    'menu':       true,
    'meta':       true,
    'nobr':       true,
    'ol':         true,
    'p':          true,
    'pre':        true,
    'ruby':       true,
    's':          true,
    'small':      true,
    'span':       true,
    'strong':     true,
    'strike':     true,
    'sub':        true,
    'table':      true,
    'tt':         true,
    'u':          true,
    'ul':         true,
    'var':        true
};


//Check exit from foreign content
exports.causesExit = function (startTagToken) {
    var tn = startTagToken.tagName;

    if (tn === 'font' && (Tokenizer.getTokenAttr(startTagToken, 'color') !== null ||
                          Tokenizer.getTokenAttr(startTagToken, 'size') !== null ||
                          Tokenizer.getTokenAttr(startTagToken, 'face') !== null)) {
        return true;
    }

    return EXITS_FOREIGN_CONTENT[tn];
};

//Token adjustments
exports.adjustTokenMathMLAttrs = function (token) {
    for (var i = 0; i < token.attrs.length; i++) {
        if (token.attrs[i].name === DEFINITION_URL_ATTR) {
            token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
            break;
        }
    }
};

exports.adjustTokenSVGAttrs = function (token) {
    for (var i = 0; i < token.attrs.length; i++) {
        var adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP[token.attrs[i].name];

        if (adjustedAttrName)
            token.attrs[i].name = adjustedAttrName;
    }
};

exports.adjustTokenXMLAttrs = function (token) {
    for (var i = 0; i < token.attrs.length; i++) {
        var adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP[token.attrs[i].name];

        if (adjustedAttrEntry) {
            token.attrs[i].prefix    = adjustedAttrEntry.prefix;
            token.attrs[i].name      = adjustedAttrEntry.name;
            token.attrs[i].namespace = adjustedAttrEntry.namespace;
        }
    }
};

exports.adjustTokenSVGTagName = function (token) {
    var adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP[token.tagName];

    if (adjustedTagName)
        token.tagName = adjustedTagName;
};

//Integration points
exports.isMathMLTextIntegrationPoint = function (tn, ns) {
    return ns === NS.MATHML && (tn === 'mi'|| tn === 'mo' || tn === 'mn' || tn === 'ms' || tn === 'mtext');
};

exports.isHtmlIntegrationPoint = function (tn, ns, attrs) {
    if (ns === NS.MATHML && tn === 'annotation-xml') {
        for (var i = 0; i < attrs.length; i++) {
            if (attrs[i].name === 'encoding') {
                var value = attrs[i].value.toLowerCase();

                return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
            }
        }
    }

    return ns === NS.SVG && (tn === 'foreignObject' || tn === 'desc' || tn === 'title');
};
