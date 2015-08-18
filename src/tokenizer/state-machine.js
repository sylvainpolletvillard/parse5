import STATE from './state';
import {
    REPLACEMENT_CHARACTER,
    CODE_POINT as $
} from '../utils/unicode';

export default {

    //12.2.4.1 Data state
    //------------------------------------------------------------------
    [STATE.data]: (t, cp) => {
        if (cp === $.ampersand)
            t.state = STATE.characterReferenceInData;

        else if (cp === $.lessThanSign)
            t.state = STATE.tagOpen;

        else if (cp === $.NULL)
            t._emitCodePoint(cp);

        else if (cp === $.EOF)
            t._emitEOFToken();

        else
            t._emitCodePoint(cp);
    },

    //12.2.4.2 Character reference in data state
    //------------------------------------------------------------------
    [STATE.characterReferenceInData]: (t, cp) => {
        t.state               = STATE.data;
        t.additionalAllowedCp = void 0;

        var referencedCodePoints = t._consumeCharacterReference(cp, false);

        if (referencedCodePoints)
            t._emitSeveralCodePoints(referencedCodePoints);
        else
            t._emitChar('&');
    },

    //12.2.4.3 RCDATA state
    //------------------------------------------------------------------
    [STATE.RCDATA]: (t, cp) => {
        if (cp === $.ampersand)
            t.state = STATE.characterReferenceInRCDATA;

        else if (cp === $.lessThanSign)
            t.state = STATE.RCDATALessThanSign;

        else if (cp === $.NULL)
            t._emitChar(REPLACEMENT_CHARACTER);

        else if (cp === $.EOF)
            t._emitEOFToken();

        else
            t._emitCodePoint(cp);
    },

    //12.2.4.4 Character reference in RCDATA state
    //------------------------------------------------------------------
    [STATE.characterReferenceInRCDATA]: (t, cp) => {
        t.state               = STATE.RCDATA;
        t.additionalAllowedCp = void 0;

        var referencedCodePoints = t._consumeCharacterReference(cp, false);

        if (referencedCodePoints)
            t._emitSeveralCodePoints(referencedCodePoints);
        else
            t._emitChar('&');
    },

    //12.2.4.5 RAWTEXT state
    //------------------------------------------------------------------
    [STATE.RAWTEXT]: (t, cp) => {
        if (cp === $.lessThanSign)
            t.state = STATE.RAWTEXTLessThanSign;

        else if (cp === $.NULL)
            t._emitChar(REPLACEMENT_CHARACTER);

        else if (cp === $.EOF)
            t._emitEOFToken();

        else
            t._emitCodePoint(cp);
    }
};

