'use strict';

var TransformStream = require('stream').Transform,
    inherits = require('util').inherits,
    Tokenizer = require('../tokenizer'),
    ParserFeedbackSimulator = require('./parser_feedback_simulator'),
    mergeOptions = require('../common/merge_options');

/**
 * @typedef {Object} SAXParserOptions
 *
 * @property {Boolean} [decodeHtmlEntities=true] - Decode HTML-entities like `&amp;`, `&nbsp;`, etc.
 * **Warning:** disabling this option may result in output that does not conform to the HTML5 specification.
 *
 * @property {Boolean} [locationInfo=false] - Enables source code location information for the tokens.
 * When enabled, each token event handler will receive {@link LocationInfo} object as the last argument.
 */
var DEFAULT_OPTIONS = {
    decodeHtmlEntities: true,
    locationInfo: false
};

/**
 * Streaming [SAX]{@link https://en.wikipedia.org/wiki/Simple_API_for_XML}-style HTML parser.
 * [Transform stream](https://nodejs.org/api/stream.html#stream_class_stream_transform)
 * (which means you can pipe *through* it, see example).
 * @class SAXParser
 * @memberof parse5
 * @instance
 * @extends stream.Transform
 * @param {SAXParserOptions} options - Parsing options.
 * @example
 * var parse5 = require('parse5');
 * var http = require('http');
 * var fs = require('fs');
 *
 * var file = fs.createWriteStream('/home/google.com.html');
 * var parser = new SAXParser();
 *
 * parser.on('text', function(text) {
 *  // Handle page text content
 *  ...
 * });
 *
 * http.get('http://google.com', function(res) {
 *  // SAXParser is the Transform stream, which means you can pipe
 *  // through it. So you can analyze page content and e.g. save it
 *  // to the file at the same time:
 *  res.pipe(parser).pipe(file);
 * });
 */
var SAXParser = module.exports = function (options) {
    TransformStream.call(this);

    this.options = mergeOptions(DEFAULT_OPTIONS, options);

    this.tokenizer = new Tokenizer(options);
    this.parserFeedbackSimulator = new ParserFeedbackSimulator(this.tokenizer);

    this.pendingText = null;
    this.currentTokenLocation = void 0;

    this.lastChunkWritten = false;
    this.stopped = false;
};

inherits(SAXParser, TransformStream);

//TransformStream implementation
SAXParser.prototype._transform = function (chunk, encoding, callback) {
    if (!this.stopped) {
        this.tokenizer.write(chunk.toString('utf8'), this.lastChunkWritten);
        this._runParsingLoop();
    }

    this.push(chunk);

    callback();
};

SAXParser.prototype._flush = function (callback) {
    callback();
};

SAXParser.prototype.end = function (chunk, encoding, callback) {
    this.lastChunkWritten = true;
    TransformStream.prototype.end.call(this, chunk, encoding, callback);
};

/**
 * Stops parsing. Useful if you want parser to stop consume
 * CPU time once you've obtained desired info from input stream.
 * Doesn't prevents piping, so data will flow through parser as usual.
 * @function stop
 * @memberof parse5
 * @instance
 * @example
 * var parse5 = require('parse5');
 * var http = require('http');
 * var fs = require('fs');
 *
 * var file = fs.createWriteStream('/home/google.com.html');
 * var parser = new parse5.SAXParser();
 *
 * parser.on('doctype', function(name, publicId, systemId) {
 *  // Process doctype info ans stop parsing
 *  ...
 *  parser.stop();
 * });
 *
 * http.get('http://google.com', function(res) {
 *  // Despite the fact that parser.stop() was called whole
 *  // content of the page will be written to the file
 *  res.pipe(parser).pipe(file);
 * });
 */
SAXParser.prototype.stop = function () {
    this.stopped = true;
};

//Internals
SAXParser.prototype._runParsingLoop = function () {
    do {
        var token = this.tokenizer.getNextToken();

        if (token.type === Tokenizer.HIBERNATION_TOKEN)
            break;

        this.parserFeedbackSimulator.adjustTokenizer(token);

        if (token.type === Tokenizer.CHARACTER_TOKEN ||
            token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN ||
            token.type === Tokenizer.NULL_CHARACTER_TOKEN) {

            if (this.options.locationInfo) {
                if (this.pendingText === null)
                    this.currentTokenLocation = token.location;

                else
                    this.currentTokenLocation.end = token.location.end;
            }

            this.pendingText = (this.pendingText || '') + token.chars;
        }

        else {
            this._emitPendingText();
            this._handleToken(token);
        }
    } while (!this.stopped && token.type !== Tokenizer.EOF_TOKEN);
};

SAXParser.prototype._handleToken = function (token) {
    if (this.options.locationInfo)
        this.currentTokenLocation = token.location;

    if (token.type === Tokenizer.START_TAG_TOKEN)
        /**
         * Raised then parser encounters start tag.
         * @event startTag
         * @memberof parse5#SAXParser
         * @instance
         * @type {Function}
         * @param {String} name - Tag name.
         * @param {String} attributes - List of attributes in `{ key: String, value: String }` form.
         * @param {Boolean} selfClosing - Indicates if tag is self-closing.
         * @param {LocationInfo} [location] - Start tag source code location info.
         * Available if location info is enabled in {@link SAXParserOptions}.
         */
        this.emit('startTag', token.tagName, token.attrs, token.selfClosing, this.currentTokenLocation);

    else if (token.type === Tokenizer.END_TAG_TOKEN)
        /**
         * Raised then parser encounters end tag.
         * @event endTag
         * @memberof parse5#SAXParser
         * @instance
         * @type {Function}
         * @param {String} name - Tag name.
         * @param {LocationInfo} [location] - End tag source code location info.
         * Available if location info is enabled in {@link SAXParserOptions}.
         */
        this.emit('endTag', token.tagName, this.currentTokenLocation);

    else if (token.type === Tokenizer.COMMENT_TOKEN)
        /**
         * Raised then parser encounters comment.
         * @event comment
         * @memberof parse5#SAXParser
         * @instance
         * @type {Function}
         * @param {String} text - Comment text.
         * @param {LocationInfo} [location] - Comment source code location info.
         * Available if location info is enabled in {@link SAXParserOptions}.
         */
        this.emit('comment', token.data, this.currentTokenLocation);

    else if (token.type === Tokenizer.DOCTYPE_TOKEN)
        /**
         * Raised then parser encounters [document type declaration]{@link https://en.wikipedia.org/wiki/Document_type_declaration}.
         * @event doctype
         * @memberof parse5#SAXParser
         * @instance
         * @type {Function}
         * @param {String} name - Document type name.
         * @param {String} publicId - Document type publicId.
         * @param {String} systemId - Document type systemId.
         * @param {LocationInfo} [location] - Document type declaration source code location info.
         * Available if location info is enabled in {@link SAXParserOptions}.
         */
        this.emit('doctype', token.name, token.publicId, token.systemId, this.currentTokenLocation);
};

SAXParser.prototype._emitPendingText = function () {
    if (this.pendingText !== null) {
        /**
         * Raised then parser encounters text content.
         * @event text
         * @memberof parse5#SAXParser
         * @instance
         * @type {Function}
         * @param {String} text - Text content.
         * @param {LocationInfo} [location] - Text content code location info.
         * Available if location info is enabled in {@link SAXParserOptions}.
         */
        this.emit('text', this.pendingText, this.currentTokenLocation);
        this.pendingText = null;
    }
};
