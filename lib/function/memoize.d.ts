/**
 * @type {Symbol}
 */
export declare const MEMOIZE_CLEAR_FUNCTION: symbol;
/**
 * Memoizes function for passed arguments
 * @param {Function} fn
 * @returns {Function}
 */
export declare function memoize(this: any, fn: (...args: any[]) => any): Function;
export default memoize;
/**
 * Decorator for {@link memoize} function
 * @param {Object} target
 * @param {String} property
 * @param {Object} descriptor
 * @returns {Object} descriptor
 */
export declare function MEMOIZE(target: any, property: any, descriptor: any): any;
