/**
 * Replaces underscores and camelCase with dashes.
 * @param {String} string
 * @param {Boolean} lower
 * @returns {String}
 */
export function dasherize(string, lower = true) {
	const dasherized = string.replace(/([a-z])(?=[A-Z])/g, '$1-');
	if (lower) {
		return dasherized.toLowerCase();
	} else {
		return dasherized;
	}
}

/**
 * Camelizes given string,
 * @param {String} string
 * @param {boolean} [lower=true]
 * @returns {String}
 */
export function camelize(string, lower = true) {
	//camelize
	const camelized = string.replace(/[-_\s]+(.)?/g, (match, c) => {
		return c ? c.toUpperCase() : '';
	});
	if (lower) {
		//decapitalize
		return decapitalize(camelized);
	} else {
		return capitalize(camelized);
	}
}

/**
 * @private
 * @type {number}
 */
let uniqueIdCounter = 0;

/**
 * Generate a unique id
 * @param {string|number} prefix
 * @param {string|number} postfix
 * @returns {string}
 */
export function randomId(prefix = '', postfix = '') {
	const id = ++uniqueIdCounter;
	return prefix + id + postfix;
}

/**
 * Capitalizes given string
 * @param {String} string
 * @returns {string}
 */
export function capitalize(string) {
	return string.slice(0, 1).toUpperCase() + string.slice(1);
}

/**
 * Decapitalizes given string
 * @param {String} string
 * @returns {string}
 */
export function decapitalize(string) {
	return string.slice(0, 1).toLowerCase() + string.slice(1);
}

/**
 * Chooses correct value for passed number (1, 2-4, 0 or many) for three base declensions (RUS)
 * @param {Number} number
 * @param {Array.<String>} declensions
 * @returns {String}
 */
export function pluralize3(number, declensions) {
	const cases = [2, 0, 1, 1, 1, 2];
	const floored = Math.floor(Math.abs(number));
	if (floored % 100 > 4 && floored % 100 < 20) {
		return declensions[2];
	} else if (floored % 10 < 5) {
		return declensions[cases[floored % 10]];
	} else {
		return declensions[cases[5]];
	}
}

/**
 * Chooses correct value for passed number (1, 0 or many) for two base declensions (EN, etc.)
 * @param {Number} number
 * @param {Array.<String>} declensions
 * @returns {String}
 */
export function pluralize2(number, declensions) {
	const floored = Math.floor(Math.abs(number));

	if (floored % 10 === 1 && floored !== 11) {
		return declensions[0];
	} else {
		return declensions[1];
	}
}

/**
 * Generates universal unique id
 * @see https://gist.github.com/gordonbrander/2230317#gistcomment-1618310
 * @returns {String}
 */
export function uuid() {
	const chr4 = () => Math.random().toString(16).slice(-4);
	return `${chr4() + chr4()}-${chr4()}-${chr4()}-${chr4()}-${chr4() + chr4() + chr4()}`;
}