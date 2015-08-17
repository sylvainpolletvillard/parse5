export default {
    // Data
    data:                     'dataState',
    characterReferenceInData: 'characterReferenceInDataState',
    markupDeclarationOpen:    'markupDeclarationOpenState',

    // PLAINTEXT
    PLAINTEXT: 'PLAINTEXTState',

    // CDATA
    CDATASection: 'CDATASectionState',

    // Tag
    tagOpen:             'tagOpenState',
    endTagOpen:          'endTagOpenState',
    tagName:             'tagNameState',
    selfClosingStartTag: 'selfClosingStartTagState',

    // RCDATA
    RCDATA:                     'RCDATAState',
    RCDATALessThanSign:         'RCDATALessThanSignState',
    RCDATAEndTagOpen:           'RCDATAEndTagOpenState',
    RCDATAEndTagName:           'RCDATAEndTagNameState',
    characterReferenceInRCDATA: 'characterReferenceInRCDATAState',

    // RAWTEXT
    RAWTEXT:             'RAWTEXTState',
    RAWTEXTLessThanSign: 'RAWTEXTLessThanSignState',
    RAWTEXTEndTagOpen:   'RAWTEXTEndTagOpenState',
    RAWTEXTEndTagName:   'RAWTEXTEndTagNameState',

    // Script
    scriptData:                          'scriptDataState',
    scriptDataLessThanSign:              'scriptDataLessThanSignState',
    scriptDataEndTagOpen:                'scriptDataEndTagOpenState',
    scriptDataEndTagName:                'scriptDataEndTagNameState',
    scriptDataEscapeStart:               'scriptDataEscapeStartState',
    scriptDataEscapesStartDash:          'scriptDataEscapesStartDashState',
    scriptDataEscaped:                   'scriptDataEscapedState',
    scriptDataEscapedDash:               'scriptDataEscapedDashState',
    scriptDataEscapedDashDash:           'scriptDataEscapedDashDashState',
    scriptDataEscapedLessThanSign:       'scriptDataEscapedLessThanSignState',
    scriptDataEscapedEndTagOpen:         'scriptDataEscapedEndTagOpenState',
    scriptDataEscapedEntTagName:         'scriptDataEscapedEntTagNameState',
    scriptDataDoubleEscapeStart:         'scriptDataDoubleEscapeStartState',
    scriptDataDoubleEscaped:             'scriptDataDoubleEscapedState',
    scriptDataDoubleEscapedDash:         'scriptDataDoubleEscapedDashState',
    scriptDataDoubleEscapedDashDash:     'scriptDataDoubleEscapedDashDashState',
    scriptDataDoubleEscapedLessThanSign: 'scriptDataDoubleEscapedLessThanSignState',
    scriptDataDoubleEscapeEnd:           'scriptDataDoubleEscapeEndState',

    // Attribute
    beforeAttributeName:                'beforeAttributeNameState',
    attributeName:                      'attributeNameState',
    beforeAttributeValue:               'beforeAttributeValueState',
    attributeValueDoubleQuoted:         'attributeValueDoubleQuotedState',
    attributeValueSingleQuoted:         'attributeValueSingleQuotedState',
    attributeValueUnquoted:             'attributeValueUnquotedState',
    characterReferenceInAttributeValue: 'characterReferenceInAttributeValueState',
    afterAttributeValueQuoted:          'afterAttributeValueQuotedState',

    // Comment
    commentStart:     'commentStartState',
    commentStartDash: 'commentStartDashState',
    comment:          'commentState',
    commentEndDash:   'commentEndDashState',
    commentEnd:       'commentEndState',
    commentEndBang:   'commentEndBangState',
    bogusComment:     'bogusCommentState',

    // Doctype
    doctype:                                  'doctypeState',
    beforeDoctypeName:                        'beforeDoctypeNameState',
    doctypeName:                              'doctypeNameState',
    afterDoctypeName:                         'afterDoctypeNameState',
    afterDoctypePublicKeyword:                'afterDoctypePublicKeywordState',
    beforeDoctypePublicIdentifier:            'beforeDoctypePublicIdentifierState',
    doctypePublicIdentifierDoubleQuoted:      'doctypePublicIdentifierDoubleQuotedState',
    doctypePublicIdentifierSingleQuoted:      'doctypePublicIdentifierSingleQuotedState',
    afterDoctypePublicIdentifier:             'afterDoctypePublicIdentifierState',
    betweenDoctypePublicAndSystemIdentifiers: 'betweenDoctypePublicAndSystemIdentifiersState',
    afterDoctypeSystemKeyword:                'afterDoctypeSystemKeywordState',
    beforeDoctypeSystemIdentifier:            'beforeDoctypeSystemIdentifierState',
    doctypeSystemIdentifierDoubleQuoted:      'doctypeSystemIdentifierDoubleQuotedState',
    doctypeSystemIdentifierSingleQuoted:      'doctypeSystemIdentifierSingleQuotedState',
    afterDoctypeSystemIdentifier:             'afterDoctypeSystemIdentifierState',
    bogusDoctype:                             'bogusDoctypeState'
};

