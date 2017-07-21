"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_1 = require("../string/string");
/**
 * Get bounding client rect of given element
 */
function getBoundingClientRect(element) {
    var rect = element.getBoundingClientRect();
    var top = rect.top, left = rect.left, right = rect.right, bottom = rect.bottom;
    var width = rect.width, height = rect.height;
    width = width || element.offsetWidth;
    height = height || element.offsetHeight;
    return {
        top: top,
        right: Math.round(right),
        bottom: Math.round(bottom),
        left: Math.round(left),
        width: width,
        height: height,
        middle: left + width / 2,
        center: top + height / 2
    };
}
exports.getBoundingClientRect = getBoundingClientRect;
/**
 * Set all styles from provided object to the element
 */
function style(el, styles) {
    if (el && isPlainObject(styles)) {
        Object.keys(styles).forEach(function (rule) {
            el.style[rule] = styles[rule];
        });
    }
}
exports.style = style;
/**
 * Get vendors property
 */
function getVendorProperty(property) {
    var capitalizedProp = string_1.capitalize(property);
    return ['WebKit', 'Moz', 'ms', 'O'].map(function (prefix) {
        return "" + prefix + capitalizedProp;
    });
}
exports.getVendorProperty = getVendorProperty;
/**
 * Assign style property to element with all possible vendor prefixes.
 */
function setVendorStyle(element, property, value) {
    element.style[property] = value;
    getVendorProperty(property).forEach(function (vendorProperty) {
        element.style[vendorProperty] = value;
    });
}
exports.setVendorStyle = setVendorStyle;
/**
 * Checks that pass a variable object
 */
function isPlainObject(object) {
    return object && typeof object === 'object' && !Array.isArray(object);
}
