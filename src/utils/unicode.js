// Consts
export const REPLACEMENT_CHARACTER = '\uFFFD';

export const CODE_POINT = {
    EOF:                  -1,
    NULL:                 0x00,
    tab:                  0x09,
    CR:                   0x0D,
    LF:                   0x0A,
    FF:                   0x0C,
    space:                0x20,
    exclamationMark:      0x21,
    quotationMark:        0x22,
    numberSign:           0x23,
    ampersand:            0x26,
    apostrophe:           0x27,
    hyphenMinus:          0x2D,
    solidus:              0x2F,
    dig0:                 0x30,
    dig9:                 0x39,
    semicolon:            0x3B,
    lessThanSign:         0x3C,
    eqSign:               0x3D,
    greaterThanSign:      0x3E,
    questionMark:         0x3F,
    A:                    0x41,
    F:                    0x46,
    X:                    0x58,
    Z:                    0x5A,
    graveAccent:          0x60,
    a:                    0x61,
    f:                    0x66,
    x:                    0x78,
    z:                    0x7A,
    BOM:                  0xFEFF,
    replacementCharacter: 0xFFFD
};

export const CODE_POINT_SEQUENCE = {
    dashDashString:   [0x2D, 0x2D], //--
    doctypeString:    [0x44, 0x4F, 0x43, 0x54, 0x59, 0x50, 0x45], //DOCTYPE
    CDATAStartString: [0x5B, 0x43, 0x44, 0x41, 0x54, 0x41, 0x5B], //[CDATA[
    CDATAEndString:   [0x5D, 0x5D, 0x3E], //]]>
    scriptString:     [0x73, 0x63, 0x72, 0x69, 0x70, 0x74], //script
    publicString:     [0x50, 0x55, 0x42, 0x4C, 0x49, 0x43], //PUBLIC
    systemString:     [0x53, 0x59, 0x53, 0x54, 0x45, 0x4D] //SYSTEM
};


// Aliases
var $ = CODE_POINT;


// Utility functions
export function isWhitespace (cp) {
    return cp === $.space || cp === $.LF || cp === $.tab || cp === $.FF;
}

export function isAsciiDigit (cp) {
    return cp >= $.dig0 && cp <= $.dig9;
}

export function isAsciiUpper (cp) {
    return cp >= $.A && cp <= $.Z;
}

export function isAsciiLower (cp) {
    return cp >= $.a && cp <= $.z;
}

export function isAsciiAlphaNumeric (cp) {
    return isAsciiDigit(cp) || isAsciiUpper(cp) || isAsciiLower(cp);
}

export function isDigit (cp, isHex) {
    return isAsciiDigit(cp) || (isHex && ((cp >= $.A && cp <= $.F) ||
                                          (cp >= $.a && cp <= $.f)));
}

export function isReservedCodePoint (cp) {
    return cp >= 0xD800 && cp <= 0xDFFF || cp > 0x10FFFF;
}

export function toAsciiLowerCodePoint (cp) {
    return cp + 0x0020;
}

//NOTE: String.fromCharCode() function can handle only characters from BMP subset.
//So, we need to workaround this manually.
//(see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/fromCharCode#Getting_it_to_work_with_higher_values)
export function toChar (cp) {
    if (cp <= 0xFFFF)
        return String.fromCharCode(cp);

    cp -= 0x10000;
    return String.fromCharCode(cp >>> 10 & 0x3FF | 0xD800) + String.fromCharCode(0xDC00 | cp & 0x3FF);
}

export function toAsciiLowerChar (cp) {
    return String.fromCharCode(toAsciiLowerCodePoint(cp));
}

export function isSurrogatePair (cp1, cp2) {
    return cp1 >= 0xD800 && cp1 <= 0xDBFF && cp2 >= 0xDC00 && cp2 <= 0xDFFF;
}

export function getSurrogatePairCodePoint (cp1, cp2) {
    return (cp1 - 0xD800) * 0x400 + 0x2400 + cp2;
}
