"use strict";
/**
 * @typedef {Object} TThrottlingOptions
 * @property {Boolean} [leading]
 * @property {Boolean} [trailing]
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a function, that, when invoked, will only be triggered at most once during a given window of time.
 * Normally, the throttled function will run as much as it can, without ever going more than once per wait
 * duration; but if you’d like to disable the execution on the leading edge, pass {leading: false}.
 * To disable execution on the trailing edge, pass {trailing: false}.
 * @param {Function} func Function to decorate
 * @param {Number} [wait=0] Delay in ms
 * @param {TThrottlingOptions} [options={}] Throttling options
 * @returns {Function} Decorated function
 */
function throttle(func, wait, options) {
    if (wait === void 0) { wait = 0; }
    if (options === void 0) { options = {}; }
    var context;
    var args;
    var result;
    var timeout = null;
    var previous = 0;
    var later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = args = null;
        }
    };
    return function () {
        var now = Date.now();
        if (!previous && options.leading === false) {
            previous = now;
        }
        var remaining = wait - (now - previous);
        context = this; //eslint-disable-line consistent-this
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        }
        else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}
exports.default = throttle;
/**
 * Class method decorator for {@link throttle}.
 * @param {Number} [wait=0] Delay in ms
 * @param {TThrottlingOptions} [options={}] Throttling options
 * @returns {Function}
 */
function THROTTLE(wait, options) {
    if (wait === void 0) { wait = 0; }
    if (options === void 0) { options = {}; }
    return function (target, prop, descriptor) {
        if (descriptor) {
            if (descriptor.initializer) {
                var old_1 = descriptor.initializer;
                descriptor.initializer = function initializer() {
                    return throttle(old_1.call(this), wait, options);
                };
            }
            else if (descriptor.get) {
                descriptor.get = throttle(descriptor.get, wait, options);
            }
            else if (descriptor.value) {
                descriptor.value = throttle(descriptor.value, wait, options);
            }
            return descriptor;
        }
        else {
            throw new Error('Property decorators are not implemented yet!');
        }
    };
}
exports.THROTTLE = THROTTLE;
