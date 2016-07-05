/**
 * Memoizes function for passed arguments
 * @param {Function} fn
 * @returns {Function}
 */
export function memoize(fn) {
	const storage = {};
	return function() {
		const args = Array.prototype.slice.call(arguments);
		const argsAreValid = args.every(arg => {
			return typeof arg === 'number' || typeof arg === 'string';
		});
		if (!argsAreValid) {
			throw Error('Arguments to memoized function can only be strings or numbers');
		}
		const key = JSON.stringify(args);
		if (typeof storage[key] === 'undefined') {
			storage[key] = fn.apply(this, args);
		}
		return storage[key];
	}.bind(this);
}

export default memoize;

/**
 * Decorator for {@link memoize} function
 * @param {Object} target
 * @param {String} property
 * @param {Object} descriptor
 * @returns {Object} descriptor
 */
export function MEMOIZE(target, property, descriptor) {
	if (descriptor.initializer) {
		//noinspection JSDuplicatedDeclaration
		const old = descriptor.initializer;
		descriptor.initializer = function initializer() {
			return memoize(old.call(this));
		};
	} else if (descriptor.get) {
		descriptor.get = memoize(descriptor.get);
	} else if (descriptor.value) {
		descriptor.value = memoize(descriptor.value);
	}
	return descriptor;
}