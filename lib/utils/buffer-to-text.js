"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bufferToText;
function bufferToText(arr, start, end) {
    return String.fromCharCode.apply(String, [].slice.call(arr, start, end));
}
