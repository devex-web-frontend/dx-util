export {is, shallowEqual} from './fb';
import {is, hasOwnProperty} from './fb';

/**
 * Generates new object with keys mapped with template
 * @param {Object} object
 * @param {Function} template
 * @returns {Object}
 */
export function mapKeys(object, template) {
	return Object.keys(object).reduce((acc, key) => {
		acc[template(key)] = object[key];
		return acc;
	}, {});
}

/**
 * Deeply compares two objects
 * @param {*} objA
 * @param {*} objB
 * @returns {Boolean}
 */
export function deepEqual(objA, objB) {
	if (is(objA, objB)) {
		return true;
	}

	if (typeof objA !== 'object' || objA === null ||
		typeof objB !== 'object' || objB === null) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	for (let i = 0, len = keysA.length; i < len; i++) {
		if (
			!hasOwnProperty.call(objB, keysA[i]) ||
			!deepEqual(objA[keysA[i]], objB[keysA[i]])
		) {
			return false;
		}
	}

	return true;
}

