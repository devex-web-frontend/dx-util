/**
 * @typedef {string} TBemStringModifier
 */

/**
 * @typedef {Array.<TBemStringModifier>} TBemNormalizedModifiers
 */

/**
 * @typedef {Object.<TBemStringModifier, boolean>} TBemKeyModifiers
 */

/**
 * @typedef {Array.<TBemStringModifier|TBemKeyModifiers>} TBemArrayModifiers
 */

/**
 * @typedef {TBemKeyModifiers|TBemArrayModifiers} TBemModifiers
 */

/**
 * @type {string}
 */
export const ERROR_MODIFIERS_VALIDATION = 'Modifiers should be either an object or an array of object or strings';

/**
 * @type {string}
 */
export const ERROR_DECORATOR_TARGET_VALIDATION = 'Decorator accepts only functions and classes';

/**
 * @type {string}
 */
export const ERROR_DECORATOR_BLOCKNAME_VALIDATION = 'Decorator parameter should be a string';

/**
 * Generates block className
 * @param {string} name
 * @param {TBemModifiers} modifiers
 * @returns {string}
 */
export function block(name, modifiers) {
	return modify(name, modifiers);
}

/**
 * Generates element className
 * @param {string} blockName
 * @param {string} name
 * @param {TBemModifiers} modifiers
 * @returns {string}
 */
export function element(blockName, name, modifiers) {
	return modify(`${blockName}--${name}`, modifiers);
}

/**
 * Generates modifier className
 * @param {string} name
 * @param {string} modifier
 * @returns {string}
 */
export function modifier(name, modifier) {
	return `${name}-${modifier}`;
}

/**
 * Combines selector with modifiers
 * @param {string} name
 * @param {TBemModifiers} modifiers
 * @private
 * @returns {string}
 */
function modify(name, modifiers) {
	const normalized = normalizeModifiers(modifiers);
	return [name].concat(normalized.map(m => {
		return modifier(name, m);
	})).join(' ');
}

/**
 * Normalizes {@link TBemModifiers} to array of strings
 * @param {TBemModifiers} modifiers
 * @returns {TBemNormalizedModifiers}
 */
function normalizeModifiers(modifiers) {
	if (!modifiers) {
		return [];
	} else if (isArrayModifiers(modifiers)) {
		return normalizeArrayModifiers(modifiers);
	} else if (isKeyModifiers(modifiers)) {
		return normalizeKeyModifiers(modifiers);
	} else {
		throw new Error(ERROR_MODIFIERS_VALIDATION);
	}
}

/**
 * Normalzies {@Link TBemKeyModifiers} to array of strings
 * @param {TBemKeyModifiers} modifiers
 * @returns {TBemNormalizedModifiers}
 */
function normalizeKeyModifiers(modifiers) {
	return Object.keys(modifiers).filter(key => !!modifiers[key]);
}

/**
 * Normalizes {@link TBemArrayModifiers} to array of string
 * @param {TBemArrayModifiers} modifiers
 * @returns {TBemNormalizedModifiers}
 */
function normalizeArrayModifiers(modifiers) {
	return modifiers.map(modifier => {
		if (isStringModifier(modifier)) {
			return modifier;
		} else if (isKeyModifiers(modifier)) {
			return normalizeKeyModifiers(modifier);
		} else {
			throw new Error(ERROR_MODIFIERS_VALIDATION);
		}
	});
}

/**
 * Checks if modifiers is an object with boolean values for classname keys
 * @param {TBemModifiers} modifiers
 * @return {boolean}
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
function isStringModifier(modifier) {
	return typeof modifier === 'string';
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
export default function bem(blockName, elementOrBlockModifiers, elementModifiers) {
	if (typeof elementOrBlockModifiers === 'string') {
		//block--element || block--element-modifiers
		return element(blockName, elementOrBlockModifiers, elementModifiers);
	} else if (isKeyModifiers(elementOrBlockModifiers) || isArrayModifiers(elementOrBlockModifiers)) {
		//block-modifiers
		return block(blockName, elementOrBlockModifiers);
	} else if (!elementOrBlockModifiers) {
		return blockName; //block
	}
}

/**
 * Class decorator, injects 'bem' method which is bound to passed block name
 * @param {String} blockName
 * @returns {Function.<Function>}
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
export function BEM(blockName) {
	if (typeof blockName !== 'string') {
		throw new Error(ERROR_DECORATOR_BLOCKNAME_VALIDATION);
	}

	return function(target) {
		if (typeof target !== 'function') {
			throw new Error(ERROR_DECORATOR_TARGET_VALIDATION);
		}

		target.prototype.bem = bem.bind(null, blockName);
		return target;
	};
}