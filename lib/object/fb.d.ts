export declare const hasOwnProperty: {
    (v: string): boolean;
    (v: PropertyKey): boolean;
};
/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 * @param {*} x
 * @param {*} y
 * @returns {boolean}
 */
export declare function is(x: any, y: any): boolean;
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 * @param {*} objA
 * @param {*} objB
 * @returns {boolean}
 */
export declare function shallowEqual(objA: any, objB: any): boolean;
