/**
 * @typedef {Object} TThrottlingOptions
 * @property {Boolean} [leading]
 * @property {Boolean} [trailing]
 */
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
export default function throttle(func: Function, wait?: any, options?: any): Function;
/**
 * Class method decorator for {@link throttle}.
 * @param {Number} [wait=0] Delay in ms
 * @param {TThrottlingOptions} [options={}] Throttling options
 * @returns {Function}
 */
export declare function THROTTLE(wait?: number, options?: {}): any;
