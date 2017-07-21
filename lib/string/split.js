"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Splits sources string by given substring
 */
function split(string, substring, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = true; }
    if (!substring && substring !== '0') {
        return [string];
    }
    var flags = (caseSensitive ? '' : 'i') + "gm";
    var pattern = substring.replace(/([\[()*+?.\\^$|])/g, '\\$1');
    var regexp = new RegExp("(" + pattern + ")", flags);
    return string.split(regexp);
}
exports.split = split;
exports.default = split;
