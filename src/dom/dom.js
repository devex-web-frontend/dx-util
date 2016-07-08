import {capitalize} from 'dx-util/src/string/string';

/**
 * Get bounding client rect of given element
 * @param {HTMLElement} element
 * @returns {Object} client rect
 */
export function getBoundingClientRect(element) {
	const rect = element.getBoundingClientRect();
	let {top, left, right, bottom, width, height} = rect;

	width = width || element.offsetWidth;
	height = height || element.offsetHeight;

	return {
		top,
		right: Math.round(right),
		bottom: Math.round(bottom),
		left: Math.round(left),
		width,
		height,
		middle: left + width / 2,
		center: top + height / 2
	};
}

/**
 * Set all styles from provided object to the element
 * @param {HTMLElement} el Target element
 * @param {Object} styles
 */
export function style(el, styles) {
	if (el && isPlainObject(styles)) {
		Object.keys(styles).forEach((rule) => {
			el.style[rule] = styles[rule];
		});
	}
}

/**
 * Get vendors property
 * @param {String} property
 * @returns {Array}
 */
export function getVendorProperty(property) {
	const capitalizedProp = capitalize(property);
	return ['wekbit', 'moz', 'ms', 'o'].map((prefix) => {
		return `${prefix}${capitalizedProp}`;
	});
}

/**
 * Assign style property to element with all possible vendor prefixes.
 * @param {HTMLElement} element
 * @param {String} property
 * @param {*} value
 */
export function setVendorStyle(element, property, value) {
	element.style[property] = value;
	getVendorProperty(property).forEach((vendorProperty) => {
		element.style[vendorProperty] = value;
	});
}

/**
 * Checks that pass a variable object
 * @param {object} object
 * @returns {*|boolean}
 */
function isPlainObject(object) {
	return object && typeof object === 'object' && !Array.isArray(object);
}