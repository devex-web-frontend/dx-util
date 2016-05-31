/**
 * @typedef {Object} TThrottlingOptions
 * @property {Boolean} [leading]
 * @property {Boolean} [trailing]
 */

/**
 * Returns a function, that, when invoked, will only be triggered at most once during a given window of time.
 * Normally, the throttled function will run as much as it can, without ever going more than once per wait
 * duration; but if you’d like to disable the execution on the leading edge, pass {leading: false}.
 * To disable execution on the trailing edge, pass {trailing: false}.
 * @param {Function} func Function to decorate
 * @param {Number} [wait=0] Delay in ms
 * @param {TThrottlingOptions} [options={}] Throttling options
 * @returns {Function} Decorated function
 */
export default function throttle(func, wait = 0, options = {}) {
	let context;
	let args;
	let result;
	let timeout = null;
	let previous = 0;

	let later = () => {
		previous = options.leading === false ? 0 : Date.now();
		timeout = null;
		result = func.apply(context, args);

		if (!timeout) {
			context = args = null;
		}
	};

	return function() {
		let now = Date.now();
		if (!previous && options.leading === false) {
			previous = now;
		}

		let remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);

			if (!timeout) {
				context = args = null;
			}
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
};

/**
 * Class method decorator for {@link throttle}.
 * @param {Number} [wait=0] Delay in ms
 * @param {TThrottlingOptions} [options={}] Throttling options
 * @returns {Function}
 */
export function THROTTLE(wait = 0, options = {}) {
	return function(target, prop, descriptor) {
		descriptor.value = throttle(descriptor.value, wait, options);
		return descriptor;
	};
}