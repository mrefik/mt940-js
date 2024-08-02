"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token2 = exports.token1 = void 0;
var tslib_1 = require("tslib");
var tokens_1 = require("../tokens");
var compare_arrays_1 = require("../utils/compare-arrays");
var opening_balance_1 = require("./opening-balance");
/**
 * @description :62M:
 * @type {Uint8Array}
 */
exports.token1 = new Uint8Array([tokens_1.colonSymbolCode, 54, 50, 77, tokens_1.colonSymbolCode]);
/**
 * @description :62F:
 * @type {Uint8Array}
 */
exports.token2 = new Uint8Array([tokens_1.colonSymbolCode, 54, 50, 70, tokens_1.colonSymbolCode]);
var token1Length = exports.token1.length;
var token2Length = exports.token2.length;
var closingBalanceTag = tslib_1.__assign(tslib_1.__assign({}, opening_balance_1.default), { readToken: function (state) {
        var isToken1 = (0, compare_arrays_1.default)(exports.token1, 0, state.data, state.pos, token1Length);
        var isToken2 = !isToken1 && (0, compare_arrays_1.default)(exports.token2, 0, state.data, state.pos, token2Length);
        if (!isToken1 && !isToken2) {
            return 0;
        }
        this.init();
        var statement = state.statements[state.statementIndex];
        if (!statement) {
            return 0;
        }
        statement.closingBalance = this.info;
        return state.pos + (isToken1 ? token1Length : token2Length);
    } });
exports.default = closingBalanceTag;
