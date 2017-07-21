import { capitalize } from '../string/string';

/**
 * Get bounding client rect of given element
 */
export function getBoundingClientRect(element: HTMLElement): ClientRect & { middle: number, center: number } {
	const rect = element.getBoundingClientRect();
	const {top, left, right, bottom} = rect;
	let {width, height} = rect;

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
 */
export function style(el: HTMLElement, styles: object) {
	if (el && isPlainObject(styles)) {
		Object.keys(styles).forEach((rule: string) => {
			el.style[rule] = styles[rule];
		});
	}
}

/**
 * Get vendors property
 */
export function getVendorProperty(property: string): string[] {
	const capitalizedProp = capitalize(property);
	return ['WebKit', 'Moz', 'ms', 'O'].map(prefix => {
		return `${prefix}${capitalizedProp}`;
	});
}

/**
 * Assign style property to element with all possible vendor prefixes.
 */
export function setVendorStyle(element: HTMLElement, property: string, value: any) {
	element.style[property] = value;
	getVendorProperty(property).forEach(vendorProperty => {
		element.style[vendorProperty] = value;
	});
}

/**
 * Checks that pass a variable object
 */
function isPlainObject(object: object): boolean {
	return object && typeof object === 'object' && !Array.isArray(object);
}