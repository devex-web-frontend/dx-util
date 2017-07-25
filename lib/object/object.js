"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fb_1 = require("./fb");
exports.is = fb_1.is;
exports.shallowEqual = fb_1.shallowEqual;
var fb_2 = require("./fb");
/**
 * Generates new object with keys mapped with template
 */
function mapKeys(object, template) {
    return Object.keys(object).reduce(function (acc, key) {
        acc[template(key)] = object[key];
        return acc;
    }, {});
}
exports.mapKeys = mapKeys;
/**
 * Deeply compares two objects
 * @param {*} objA
 * @param {*} objB
 * @returns {Boolean}
 */
function deepEqual(objA, objB) {
    if (fb_2.is(objA, objB)) {
        return true;
    }
    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    // Test for A's keys different from B.
    for (var i = 0, len = keysA.length; i < len; i++) {
        if (!fb_2.hasOwnProperty.call(objB, keysA[i]) ||
            !deepEqual(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}
exports.deepEqual = deepEqual;
