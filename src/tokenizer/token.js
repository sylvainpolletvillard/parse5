export const TYPES = {
    character:           'character',
    nullCharacter:       'nullCharacter',
    whitespaceCharacter: 'whitespaceCharacter',
    startTag:            'startTag',
    endTag:              'endTag',
    comment:             'comment',
    doctype:             'doctype',
    EOF:                 'eof'
};


export function createStartTag (tagName) {
    return {
        type:        TYPES.startTag,
        tagName:     tagName,
        selfClosing: false,
        attrs:       []
    };
}

export function createEndTag () {
    return {
        type:    TYPES.endTag,
        tagName: tagName,
        ignored: false,
        attrs:   []
    };
}

export function createComment () {
    return {
        type: Tokenizer.COMMENT_TOKEN,
        data: ''
    };
}

export function createDoctype (name = '') {
    return {
        type:        Tokenizer.DOCTYPE_TOKEN,
        name:        name,
        forceQuirks: false,
        publicId:    null,
        systemId:    null
    };
}

export function createCharacter (type, ch) {
    return {
        type:  type,
        chars: ch
    };
}

export function createAttr (name) {
    return {
        name:  name,
        value: ''
    };
}

export function getAttr (token, attrName) {
    for (var i = token.attrs.length - 1; i >= 0; i--) {
        if (token.attrs[i].name === attrName)
            return token.attrs[i].value;
    }

    return null;
}
