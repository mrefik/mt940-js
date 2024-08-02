"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
var tslib_1 = require("tslib");
var tokens_1 = require("../tokens");
var compare_arrays_1 = require("../utils/compare-arrays");
var opening_balance_1 = require("./opening-balance");
/**
 * @description :64:
 * @type {Uint8Array}
 */
exports.token = new Uint8Array([tokens_1.colonSymbolCode, 54, 52, tokens_1.colonSymbolCode]);
var tokenLength = exports.token.length;
var closingAvailableBalance = tslib_1.__assign(tslib_1.__assign({}, opening_balance_1.default), { readToken: function (state) {
        if (!(0, compare_arrays_1.default)(exports.token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }
        this.init();
        var statement = state.statements[state.statementIndex];
        if (!statement) {
            return 0;
        }
        statement.closingAvailableBalance = this.info;
        return state.pos + tokenLength;
    } });
exports.default = closingAvailableBalance;
