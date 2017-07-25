/**
 * @typedef {string|number} TBemPlainModifier
 */
/**
 * @typedef {Array.<TBemPlainModifier>} TBemNormalizedModifiers
 */
/**
 * @typedef {Object.<TBemPlainModifier, boolean>} TBemKeyModifiers
 */
/**
 * @typedef {Array.<TBemPlainModifier|TBemKeyModifiers|TBemNormalizedModifiers>} TBemArrayModifiers
 */
/**
 * @typedef {TBemKeyModifiers|TBemArrayModifiers} TBemModifiers
 */
/**
 * @type {string}
 */
export declare const ERROR_MODIFIERS_VALIDATION = "Modifiers should be either an object or an array of objects, strings or numbers";
/**
 * @type {string}
 */
export declare const ERROR_DECORATOR_TARGET_VALIDATION = "Decorator accepts only functions and classes";
/**
 * @type {string}
 */
export declare const ERROR_DECORATOR_BLOCKNAME_VALIDATION = "Decorator parameter should be a string";
/**
 * Generates block className
 * @param {string} name
 * @param {TBemModifiers} [modifiers]
 * @returns {string}
 */
export declare function block(name: string, modifiers?: any): string;
/**
 * Generates element className
 * @param {string} blockName
 * @param {string} name
 * @param {TBemModifiers} [modifiers]
 * @returns {string}
 */
export declare function element(blockName: string, name: string, modifiers?: any): string;
/**
 * Generates modifier className
 * @param {string} name
 * @param {string} modifier
 * @returns {string}
 */
export declare function modifier(name: string, modifier: string | number): string;
/**
 * Universal helper for creating bem-based classNames
 * @param {string} blockName
 * @param {string|TBemModifiers} [elementOrBlockModifiers]
 * @param {TBemModifiers} [elementModifiers]
 * @returns {string}
 * @example
 * const block = bem('block'); //block
 * const blockModifiers = bem('block', ['first', {second: true}]); //block-first block-second
 * const blockModifiers2 = bem('block', {second: false}); //block
 * const blockElement = bem('block', 'element'); //block--element
 * const blockElementModifiers = bem('block', 'element', ['m']); //block--element-m
 */
export default function bem(blockName: string, elementOrBlockModifiers?: any, elementModifiers?: any): string;
/**
 * Class decorator, injects 'bem' method which is bound to passed block name
 * @example
 * @BEM('foo')
 * class Foo extends React.Component {
 *  render() {
 *   return (
 *    <div className={this.bem()}> //foo
 *        <div className={this.bem('sub')}></div> //foo--sub
 *    </div>
 *   );
 *  }
 * }
 */
export declare function BEM(blockName: string): (target: any) => any;
