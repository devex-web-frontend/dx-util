"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Replaces underscores and camelCase with dashes.
 */
function dasherize(string, lower) {
    if (lower === void 0) { lower = true; }
    var dasherized = string.replace(/([a-z])(?=[A-Z])/g, '$1-');
    if (lower) {
        return dasherized.toLowerCase();
    }
    else {
        return dasherized;
    }
}
exports.dasherize = dasherize;
/**
 * Camelizes given string
 */
function camelize(string, lower) {
    if (lower === void 0) { lower = true; }
    //camelize
    var camelized = string.replace(/[-_\s]+(.)?/g, function (match, c) {
        return c ? c.toUpperCase() : '';
    });
    if (lower) {
        //decapitalize
        return decapitalize(camelized);
    }
    else {
        return capitalize(camelized);
    }
}
exports.camelize = camelize;
var uniqueIdCounter = 0;
/**
 * Generate a unique id
 */
function randomId(prefix, postfix) {
    if (prefix === void 0) { prefix = ''; }
    if (postfix === void 0) { postfix = ''; }
    var id = ++uniqueIdCounter;
    return "" + prefix + id + postfix;
}
exports.randomId = randomId;
/**
 * Capitalizes given string
 */
function capitalize(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
}
exports.capitalize = capitalize;
/**
 * Decapitalizes given string
 */
function decapitalize(string) {
    return string.slice(0, 1).toLowerCase() + string.slice(1);
}
exports.decapitalize = decapitalize;
/**
 * Chooses correct value for passed number (1, 2-4, 0 or many) for three base declensions (RUS)
 */
function pluralize3(number, declensions) {
    var cases = [2, 0, 1, 1, 1, 2];
    var floored = Math.floor(Math.abs(number));
    if (floored % 100 > 4 && floored % 100 < 20) {
        return declensions[2];
    }
    else if (floored % 10 < 5) {
        return declensions[cases[floored % 10]];
    }
    else {
        return declensions[cases[5]];
    }
}
exports.pluralize3 = pluralize3;
/**
 * Chooses correct value for passed number (1, 0 or many) for two base declensions (EN, etc.)
 * @param {Number} number
 * @param {Array.<String>} declensions
 * @returns {String}
 */
function pluralize2(number, declensions) {
    var floored = Math.floor(Math.abs(number));
    if (floored % 10 === 1 && floored !== 11) {
        return declensions[0];
    }
    else {
        return declensions[1];
    }
}
exports.pluralize2 = pluralize2;
/**
 * Generates universal unique id
 * @see https://gist.github.com/gordonbrander/2230317#gistcomment-1618310
 */
function uuid() {
    var chr4 = function () { return Math.random().toString(16).slice(-4); };
    return chr4() + chr4() + "-" + chr4() + "-" + chr4() + "-" + chr4() + "-" + (chr4() + chr4() + chr4());
}
exports.uuid = uuid;
