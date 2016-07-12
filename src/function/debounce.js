/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for N milliseconds.
 * If immediate is passed, trigger the function on the leading edge, instead of the trailing.
 * @param {Function} func Function to decorate
 * @param {Number} [wait=0] Delay in ms
 * @param {Boolean} [immediate=false] Should be function invoked on the leading edge
 * @returns {Function} Decorated function
 */
export default function debounce(func, wait = 0, immediate = false) {
	let timeout;
	let args;
	let context;
	let timestamp;
	let result;

	const later = () => {
		const last = Date.now() - timestamp;

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			if (!immediate) {
				result = func.apply(context, args);

				if (!timeout) {
					context = args = null;
				}
			}
		}
	};

	return function() {
		context = this; //eslint-disable-line consistent-this
		args = arguments;
		timestamp = Date.now();
		const callNow = immediate && !timeout;

		if (!timeout) {
			timeout = setTimeout(later, wait);
		}

		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};
}

/**
 * Class method decorator for {@link debounce}.
 * @param {Number} [wait=0] Delay in ms
 * @param {Boolean} [immediate=false] Should be function invoked on the leading edge
 * @returns {Function}
 * @constructor
 */
export function DEBOUNCE(wait = 0, immediate = false) {
	return function(target, prop, descriptor) {
		if (descriptor.initializer) {
			const old = descriptor.initializer;
			descriptor.initializer = function initializer() {
				return debounce(old.call(this), wait, immediate);
			};
		} else if (descriptor.get) {
			descriptor.get = debounce(descriptor.get, wait, immediate);
		} else if (descriptor.value) {
			descriptor.value = debounce(descriptor.value, wait, immediate);
		}
		return descriptor;
	};
}