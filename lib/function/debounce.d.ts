/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for N milliseconds.
 * If immediate is passed, trigger the function on the leading edge, instead of the trailing.
 */
export default function debounce<F extends Function>(func: F, wait?: number, immediate?: boolean): F;
/**
 * Class method decorator for {@link debounce}.
 */
export declare function DEBOUNCE(wait?: number, immediate?: boolean): any;
