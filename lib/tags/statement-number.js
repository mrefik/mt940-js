"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokens_1 = require("../tokens");
var buffer_to_text_1 = require("../utils/buffer-to-text");
var compare_arrays_1 = require("../utils/compare-arrays");
/**
 * @description :28:
 * @type {Uint8Array}
 */
var token1 = new Uint8Array([tokens_1.colonSymbolCode, 50, 56, tokens_1.colonSymbolCode]);
/**
 * @description :28C:
 * @type {Uint8Array}
 */
var token2 = new Uint8Array([tokens_1.colonSymbolCode, 50, 56, 67, tokens_1.colonSymbolCode]);
var token1Length = token1.length;
var token2Length = token2.length;
var statementNumberTag = {
    readToken: function (state) {
        var isToken1 = (0, compare_arrays_1.default)(token1, 0, state.data, state.pos, token1Length);
        var isToken2 = !isToken1 && (0, compare_arrays_1.default)(token2, 0, state.data, state.pos, token2Length);
        if (!isToken1 && !isToken2) {
            return 0;
        }
        this.slashPos = 0;
        return state.pos + (isToken1 ? token1Length : token2Length);
    },
    readContent: function (state, symbolCode) {
        if (symbolCode === tokens_1.slashSymbolCode) {
            this.slashPos = state.pos;
        }
    },
    close: function (state) {
        var statement = state.statements[state.statementIndex];
        if (!statement) {
            return;
        }
        statement.number = (0, buffer_to_text_1.default)(state.data, state.tagContentStart, this.slashPos || state.tagContentEnd);
    }
};
exports.default = statementNumberTag;
