export { is, shallowEqual } from './fb';
/**
 * Generates new object with keys mapped with template
 * @param {Object} object
 * @param {Function} template
 * @returns {Object}
 */
export declare function mapKeys<T extends {}>(object: T, template: (key: string) => string): T;
/**
 * Deeply compares two objects
 * @param {*} objA
 * @param {*} objB
 * @returns {Boolean}
 */
export declare function deepEqual(objA: object, objB: object): boolean;
