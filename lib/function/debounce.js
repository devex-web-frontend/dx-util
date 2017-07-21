"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for N milliseconds.
 * If immediate is passed, trigger the function on the leading edge, instead of the trailing.
 * @param {Function} func Function to decorate
 * @param {Number} [wait=0] Delay in ms
 * @param {Boolean} [immediate=false] Should be function invoked on the leading edge
 * @returns {Function} Decorated function
 */
function debounce(func, wait, immediate) {
    if (wait === void 0) { wait = 0; }
    if (immediate === void 0) { immediate = false; }
    var timeout;
    var args;
    var context;
    var timestamp;
    var result;
    var later = function () {
        var last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        }
        else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };
    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
}
exports.default = debounce;
/**
 * Class method decorator for {@link debounce}.
 * @param {Number} [wait=0] Delay in ms
 * @param {Boolean} [immediate=false] Should be function invoked on the leading edge
 * @returns {Function}
 * @constructor
 */
function DEBOUNCE(wait, immediate) {
    if (wait === void 0) { wait = 0; }
    if (immediate === void 0) { immediate = false; }
    return function (target, prop, descriptor) {
        if (descriptor) {
            if (descriptor.initializer) {
                var old_1 = descriptor.initializer;
                descriptor.initializer = function initializer() {
                    return debounce(old_1.call(this), wait, immediate);
                };
            }
            else if (descriptor.get) {
                descriptor.get = debounce(descriptor.get, wait, immediate);
            }
            else if (descriptor.value) {
                descriptor.value = debounce(descriptor.value, wait, immediate);
            }
            return descriptor;
        }
        else {
            throw new Error('Property decorators are not implemented yet!');
        }
    };
}
exports.DEBOUNCE = DEBOUNCE;
