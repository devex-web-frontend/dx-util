"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @type {Symbol}
 */
exports.MEMOIZE_CLEAR_FUNCTION = Symbol('MEMOIZE_CLEAR_FUNCTION');
/**
 * Memoizes function for passed arguments
 */
function memoize(fn) {
    var storage = {};
    var result = function () {
        var args = Array.prototype.slice.call(arguments);
        var key = serialize(args);
        if (typeof storage[key] === 'undefined') {
            storage[key] = fn.apply(this, args);
        }
        return storage[key];
    }.bind(this);
    //inject clearer
    result[exports.MEMOIZE_CLEAR_FUNCTION] = function () {
        var args = Array.prototype.slice.call(arguments);
        var key = serialize(args);
        delete storage[key];
    };
    return result;
}
exports.memoize = memoize;
exports.default = memoize;
/**
 * Decorator for {@link memoize} function
 * @param {Object} target
 * @param {String} property
 * @param {Object} descriptor
 * @returns {Object} descriptor
 */
function MEMOIZE(target, property, descriptor) {
    if (descriptor.initializer) {
        //noinspection JSDuplicatedDeclaration
        var old_1 = descriptor.initializer;
        descriptor.initializer = function initializer() {
            return memoize(old_1.call(this));
        };
    }
    else if (descriptor.get) {
        descriptor.get = memoize(descriptor.get);
    }
    else if (descriptor.value) {
        descriptor.value = memoize(descriptor.value);
    }
    return descriptor;
}
exports.MEMOIZE = MEMOIZE;
/**
 * @param {Array.<*>} args
 * @returns {String}
 */
function serialize(args) {
    var argsAreValid = args.every(function (arg) {
        return typeof arg === 'number' || typeof arg === 'string';
    });
    if (!argsAreValid) {
        throw Error('Arguments to memoized function can only be strings or numbers');
    }
    return JSON.stringify(args);
}
