"use strict";
/**
 * @typedef {string|number} TBemPlainModifier
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.ERROR_MODIFIERS_VALIDATION = 'Modifiers should be either an object or an array of objects, strings or numbers';
/**
 * @type {string}
 */
exports.ERROR_DECORATOR_TARGET_VALIDATION = 'Decorator accepts only functions and classes';
/**
 * @type {string}
 */
exports.ERROR_DECORATOR_BLOCKNAME_VALIDATION = 'Decorator parameter should be a string';
/**
 * Generates block className
 * @param {string} name
 * @param {TBemModifiers} [modifiers]
 * @returns {string}
 */
function block(name, modifiers) {
    return modify(name, modifiers);
}
exports.block = block;
/**
 * Generates element className
 * @param {string} blockName
 * @param {string} name
 * @param {TBemModifiers} [modifiers]
 * @returns {string}
 */
function element(blockName, name, modifiers) {
    return modify(blockName + "--" + name, modifiers);
}
exports.element = element;
/**
 * Generates modifier className
 * @param {string} name
 * @param {string} modifier
 * @returns {string}
 */
function modifier(name, modifier) {
    return name + "-" + modifier;
}
exports.modifier = modifier;
/**
 * Combines selector with modifiers
 * @param {string} name
 * @param {TBemModifiers} [modifiers]
 * @private
 * @returns {string}
 */
function modify(name, modifiers) {
    var normalized = normalizeModifiers(modifiers);
    return [name].concat(normalized.map(function (m) {
        return modifier(name, m);
    })).join(' ');
}
/**
 * Normalizes {@link TBemModifiers} to array of strings
 * @param {TBemModifiers} [modifiers]
 * @returns {TBemNormalizedModifiers}
 */
function normalizeModifiers(modifiers) {
    if (!modifiers) {
        return [];
    }
    else if (isArrayModifiers(modifiers)) {
        return normalizeArrayModifiers(modifiers);
    }
    else if (isKeyModifiers(modifiers)) {
        return normalizeKeyModifiers(modifiers);
    }
    else {
        throw new Error(exports.ERROR_MODIFIERS_VALIDATION);
    }
}
/**
 * Normalzies {@Link TBemKeyModifiers} to array of strings
 * @param {TBemKeyModifiers} modifiers
 * @returns {TBemNormalizedModifiers}
 */
function normalizeKeyModifiers(modifiers) {
    return Object.keys(modifiers).filter(function (key) { return !!modifiers[key]; });
}
/**
 * Recursively normalizes {@link TBemArrayModifiers} to array of string
 * @param {TBemArrayModifiers} modifiers
 * @returns {TBemNormalizedModifiers}
 */
function normalizeArrayModifiers(modifiers) {
    return modifiers.reduce(function (acc, modifier) {
        if (isPlainModifier(modifier)) {
            return acc.concat(modifier);
        }
        else if (isKeyModifiers(modifier)) {
            return acc.concat(normalizeKeyModifiers(modifier));
        }
        else if (isArrayModifiers(modifier)) {
            return acc.concat(normalizeArrayModifiers(modifier));
        }
        else {
            throw new Error(exports.ERROR_MODIFIERS_VALIDATION);
        }
    }, []);
}
/**
 * Checks if modifiers is an object with boolean values for classname keys
 * @param {TBemModifiers} modifiers
 * @returns {boolean}
 */
function isKeyModifiers(modifiers) {
    return !isArrayModifiers(modifiers) && !!modifiers && typeof modifiers === 'object';
}
/**
 * Checks if modifiers is an array of plain strings or {@link TBemKeyModifiers}
 * @param {TBemModifiers} modifiers
 * @returns {boolean}
 */
function isArrayModifiers(modifiers) {
    return Array.isArray(modifiers);
}
/**
 * Checks if modifier is a string
 * @param {TBemModifiers} modifier
 * @returns {boolean}
 */
function isPlainModifier(modifier) {
    return typeof modifier === 'string' || typeof modifier === 'number';
}
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
function bem(blockName, elementOrBlockModifiers, elementModifiers) {
    if (typeof elementOrBlockModifiers === 'string') {
        //block--element || block--element-modifiers
        return element(blockName, elementOrBlockModifiers, elementModifiers);
    }
    else if (isKeyModifiers(elementOrBlockModifiers) || isArrayModifiers(elementOrBlockModifiers)) {
        //block-modifiers
        return block(blockName, elementOrBlockModifiers);
    }
    else if (!elementOrBlockModifiers) {
        return blockName; //block
    }
    return '';
}
exports.default = bem;
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
function BEM(blockName) {
    if (typeof blockName !== 'string') {
        throw new Error(exports.ERROR_DECORATOR_BLOCKNAME_VALIDATION);
    }
    return function (target) {
        if (typeof target !== 'function') {
            throw new Error(exports.ERROR_DECORATOR_TARGET_VALIDATION);
        }
        target.prototype.bem = bem.bind(null, blockName);
        return target;
    };
}
exports.BEM = BEM;
