'use strict';

exports.__esModule = true;

var _STATE$data$STATE$characterReferenceInData$STATE$RCDATA$STATE$characterReferenceInRCDATA$STATE$RAWTEXT;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

var _utilsUnicode = require('../utils/unicode');

exports.default = (_STATE$data$STATE$characterReferenceInData$STATE$RCDATA$STATE$characterReferenceInRCDATA$STATE$RAWTEXT = {}, _STATE$data$STATE$characterReferenceInData$STATE$RCDATA$STATE$characterReferenceInRCDATA$STATE$RAWTEXT[_state2.default.data] = function (t, cp) {
    if (cp === _utilsUnicode.CODE_POINT.ampersand) t.state = _state2.default.characterReferenceInData;else if (cp === _utilsUnicode.CODE_POINT.lessThanSign) t.state = _state2.default.tagOpen;else if (cp === _utilsUnicode.CODE_POINT.NULL) t._emitCodePoint(cp);else if (cp === _utilsUnicode.CODE_POINT.EOF) t._emitEOFToken();else t._emitCodePoint(cp);
}, _STATE$data$STATE$characterReferenceInData$STATE$RCDATA$STATE$characterReferenceInRCDATA$STATE$RAWTEXT[_state2.default.characterReferenceInData] = function (t, cp) {
    t.state = _state2.default.data;
    t.additionalAllowedCp = void 0;

    var referencedCodePoints = t._consumeCharacterReference(cp, false);

    if (referencedCodePoints) t._emitSeveralCodePoints(referencedCodePoints);else t._emitChar('&');
}, _STATE$data$STATE$characterReferenceInData$STATE$RCDATA$STATE$characterReferenceInRCDATA$STATE$RAWTEXT[_state2.default.RCDATA] = function (t, cp) {
    if (cp === _utilsUnicode.CODE_POINT.ampersand) t.state = _state2.default.characterReferenceInRCDATA;else if (cp === _utilsUnicode.CODE_POINT.lessThanSign) t.state = _state2.default.RCDATALessThanSign;else if (cp === _utilsUnicode.CODE_POINT.NULL) t._emitChar(_utilsUnicode.REPLACEMENT_CHARACTER);else if (cp === _utilsUnicode.CODE_POINT.EOF) t._emitEOFToken();else t._emitCodePoint(cp);
}, _STATE$data$STATE$characterReferenceInData$STATE$RCDATA$STATE$characterReferenceInRCDATA$STATE$RAWTEXT[_state2.default.characterReferenceInRCDATA] = function (t, cp) {
    t.state = _state2.default.RCDATA;
    t.additionalAllowedCp = void 0;

    var referencedCodePoints = t._consumeCharacterReference(cp, false);

    if (referencedCodePoints) t._emitSeveralCodePoints(referencedCodePoints);else t._emitChar('&');
}, _STATE$data$STATE$characterReferenceInData$STATE$RCDATA$STATE$characterReferenceInRCDATA$STATE$RAWTEXT[_state2.default.RAWTEXT] = function (t, cp) {
    if (cp === _utilsUnicode.CODE_POINT.lessThanSign) t.state = _state2.default.RAWTEXTLessThanSign;else if (cp === _utilsUnicode.CODE_POINT.NULL) t._emitChar(_utilsUnicode.REPLACEMENT_CHARACTER);else if (cp === _utilsUnicode.CODE_POINT.EOF) t._emitEOFToken();else t._emitCodePoint(cp);
}, _STATE$data$STATE$characterReferenceInData$STATE$RCDATA$STATE$characterReferenceInRCDATA$STATE$RAWTEXT);
module.exports = exports.default;

//12.2.4.1 Data state
//------------------------------------------------------------------

//12.2.4.2 Character reference in data state
//------------------------------------------------------------------

//12.2.4.3 RCDATA state
//------------------------------------------------------------------

//12.2.4.4 Character reference in RCDATA state
//------------------------------------------------------------------

//12.2.4.5 RAWTEXT state
//------------------------------------------------------------------