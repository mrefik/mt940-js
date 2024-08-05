"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
var tokens_1 = require("../tokens");
var buffer_to_text_1 = require("../utils/buffer-to-text");
var compare_arrays_1 = require("../utils/compare-arrays");
var transactionInfoPattern = new RegExp([
    '^\\s*',
    '([0-9]{2})', // YY
    '([0-9]{2})', // MM
    '([0-9]{2})', // DD
    '([0-9]{2})?', // MM
    '([0-9]{2})?', // DD
    '(C|D|RD|RC|EC|ED)',
    '([A-Z]{1})?', // Funds code
    '([0-9 ]+[,.][0-9]*)', // Amount
    '([A-Z0-9]{4})?', // Transaction code
    '([^/\n\r]{0,16}|NONREF)?', // Customer reference
    '(//[A-Z0-9]{16})?' // Bank reference
].join(''));
var commaPattern = /,/;
var dotSymbol = String.fromCharCode(tokens_1.dotSymbolCode);
var incomeTransactionCodes = [
    // ABN AMRO bank
    'N653',
    'N654',
    // ING bank
    'N060'
];
/**
 * @description :61:
 * @type {Uint8Array}
 */
exports.token = new Uint8Array([tokens_1.colonSymbolCode, 54, 49, tokens_1.colonSymbolCode]);
var tokenLength = exports.token.length;
var transactionInfoTag = {
    readToken: function (state) {
        if (!(0, compare_arrays_1.default)(exports.token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }
        return state.pos + tokenLength;
    },
    open: function (state) {
        var statement = state.statements[state.statementIndex];
        if (statement) {
            var openingBalance = statement.openingBalance;
            statement.transactions.push({
                id: '',
                code: '',
                fundsCode: '',
                isCredit: false,
                isExpense: true,
                currency: openingBalance ? openingBalance.currency : '',
                description: '',
                amount: 0,
                valueDate: '',
                entryDate: '',
                customerReference: '',
                bankReference: ''
            });
        }
        state.transactionIndex++;
    },
    close: function (state, options) {
        var statement = state.statements[state.statementIndex];
        var transaction = statement && statement.transactions[state.transactionIndex];
        if (!transaction) {
            return;
        }
        var content = (0, buffer_to_text_1.default)(state.data, state.tagContentStart, state.tagContentEnd);
        var _a = transactionInfoPattern.exec(content) || [], valueDateYear = _a[1], valueDateMonth = _a[2], valueDate = _a[3], entryDateMonth = _a[4], entryDate = _a[5], creditMark = _a[6], fundsCode = _a[7], amount = _a[8], code = _a[9], customerReference = _a[10], bankReference = _a[11];
        if (!valueDateYear) {
            return;
        }
        var year = Number(valueDateYear) > 80 ? "19".concat(valueDateYear) : "20".concat(valueDateYear);
        transaction.valueDate = "".concat(year, "-").concat(valueDateMonth, "-").concat(valueDate);
        if (entryDateMonth) {
            transaction.entryDate = "".concat(year, "-").concat(entryDateMonth, "-").concat(entryDate);
        }
        transaction.isCredit = creditMark
            ? creditMark.charCodeAt(0) === tokens_1.bigCSymbolCode || creditMark.charCodeAt(1) === tokens_1.bigCSymbolCode
            : false;
        if (fundsCode) {
            transaction.fundsCode = fundsCode;
        }
        if (customerReference && customerReference !== 'NONREF') {
            transaction.customerReference = customerReference;
        }
        if (bankReference && bankReference !== '//NONREF') {
            transaction.bankReference = bankReference.slice(2);
        }
        transaction.amount = parseFloat(amount.replace(commaPattern, dotSymbol));
        transaction.code = code;
        transaction.isExpense = incomeTransactionCodes.indexOf(code) === -1;
        transaction.id = options.getTransactionId(transaction, state.transactionIndex);
    }
};
exports.default = transactionInfoTag;
