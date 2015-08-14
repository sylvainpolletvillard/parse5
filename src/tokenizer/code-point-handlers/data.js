import assign from '../../utils/object-assign';
import { CODE_POINTS as $ } from '../../utils/unicode';
import STATES from '../states';

export default function (handlers) {
    assign(handlers, {

        [STATES.data]: (t, cp) => {
            if (cp === $.ampersand)
                t.state = CHARACTER_REFERENCE_IN_DATA_STATE;

            else if (cp === $.lessThanSign)
                t.state = TAG_OPEN_STATE;

            else if (cp === $.NULL)
                t._emitCodePoint(cp);

            else if (cp === $.EOF)
                t._emitEOFToken();

            else
                t._emitCodePoint(cp);
        },

        [STATES.characterReferenceInData]: (t, cp) => {
            t.state               = DATA_STATE;
            t.additionalAllowedCp = void 0;

            var referencedCodePoints = t._consumeCharacterReference(cp, false);

            if (referencedCodePoints)
                t._emitSeveralCodePoints(referencedCodePoints);
            else
                t._emitChar('&');
        },

        [STATES.markupDeclarationOpen]: (t, cp) => {
            if (t._consumeSubsequentIfMatch($$.dashDashString, cp, true)) {
                t._createCommentToken();
                t.state = COMMENT_START_STATE;
            }

            else if (t._consumeSubsequentIfMatch($$.doctypeString, cp, false))
                t.state = DOCTYPE_STATE;

            else if (t.allowCDATA && t._consumeSubsequentIfMatch($$.CDATAStartString, cp, true))
                t.state = CDATA_SECTION_STATE;

            else {
                // NOTE: call bogus comment state directly with current
                // consumed character to avoid unnecessary reconsumption.
                handlers[STATES.bogusComment](t, cp);
            }
        }

    });
}
