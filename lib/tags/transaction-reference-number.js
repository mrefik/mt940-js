"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokens_1 = require("../tokens");
var buffer_to_text_1 = require("../utils/buffer-to-text");
var compare_arrays_1 = require("../utils/compare-arrays");
/**
 * @description :20:
 * @type {Uint8Array}
 */
var token = new Uint8Array([tokens_1.colonSymbolCode, 50, 48, tokens_1.colonSymbolCode]);
var tokenLength = token.length;
var transactionReferenceNumberTag = {
    readToken: function (state) {
        if (!(0, compare_arrays_1.default)(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }
        return state.pos + tokenLength;
    },
    open: function (state) {
        state.statementIndex++;
        state.transactionIndex = -1;
        state.statements.push({
            transactions: []
        });
    },
    close: function (state) {
        var statement = state.statements[state.statementIndex];
        if (!statement) {
            return;
        }
        statement.referenceNumber = (0, buffer_to_text_1.default)(state.data, state.tagContentStart, state.tagContentEnd);
    }
};
exports.default = transactionReferenceNumberTag;
