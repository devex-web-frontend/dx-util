
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

export {is, shallowEqual} from './fb';