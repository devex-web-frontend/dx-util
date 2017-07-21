/**
 * Pure render checker
 * @param {object} props
 * @param {object} state
 * @param {object} newProps
 * @param {object} newState
 * @returns {boolean}
 */
export declare function shouldComponentUpdate(props: {}, state: {}, newProps: {}, newState: {}): boolean;
/**
 * Pure render recorator
 */
export declare function PURE(target: any): any;
