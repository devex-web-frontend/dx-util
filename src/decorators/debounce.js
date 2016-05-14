/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for N milliseconds.
 * If immediate is passed, trigger the function on the leading edge, instead of the trailing.
 * @param {Function} func Function to decorate
 * @param {Number} wait Delay in ms
 * @param {Boolean} [immediate] Should be function invoked on the leading edge
 * @returns {Function} Decorated function
 */
export default function debounce(func, wait, immediate) {
	let timeout;
	let args;
	let context;
	let timestamp;
	let result;

	let later = () => {
		let last = Date.now() - timestamp;

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
		context = this;
		args = arguments;
		timestamp = Date.now();
		let callNow = immediate && !timeout;

		if (!timeout) {
			timeout = setTimeout(later, wait);
		}

		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};
};