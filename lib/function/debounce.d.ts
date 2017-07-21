/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for N milliseconds.
 * If immediate is passed, trigger the function on the leading edge, instead of the trailing.
 * @param {Function} func Function to decorate
 * @param {Number} [wait=0] Delay in ms
 * @param {Boolean} [immediate=false] Should be function invoked on the leading edge
 * @returns {Function} Decorated function
 */
export default function debounce(func: Function, wait?: number, immediate?: boolean): Function;
/**
 * Class method decorator for {@link debounce}.
 * @param {Number} [wait=0] Delay in ms
 * @param {Boolean} [immediate=false] Should be function invoked on the leading edge
 * @returns {Function}
 * @constructor
 */
export declare function DEBOUNCE(wait?: number, immediate?: boolean): any;
