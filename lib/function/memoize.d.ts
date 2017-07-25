/**
 * @type {Symbol}
 */
export declare const MEMOIZE_CLEAR_FUNCTION: symbol;
/**
 * Memoizes function for passed arguments
 */
export declare function memoize<F extends Function>(this: any, fn: F): F;
export default memoize;
/**
 * Decorator for {@link memoize} function
 * @param {Object} target
 * @param {String} property
 * @param {Object} descriptor
 * @returns {Object} descriptor
 */
export declare function MEMOIZE(target: any, property: any, descriptor: any): any;
