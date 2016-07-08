import {CSS_DECORATOR_STORAGE} from './__private__/css-pure-bridge';

/**
 * CSS decorator
 * @param {{}} cssModule
 * @returns {function(target: class):class}
 */
export function CSS(cssModule = {}) {
	return function(target) {
		//noinspection JSDuplicatedDeclaration
		const {componentWillMount, componentWillUpdate, componentWillUnmount} = target.prototype;

		//get parent class css module
		//prototype read is chained so we'll get parent's class css module
		const parentCss = target.prototype[CSS_DECORATOR_STORAGE];

		//mix parent with current css module and set on current prototype
		//prototype assignment is not chained - so we'll set only on current prototype
		const original = target.prototype[CSS_DECORATOR_STORAGE] = concatObjectValues(parentCss, cssModule);

		//inject react lifecycle methods to prototype
		target.prototype.componentWillMount = function() {
			//noinspection JSPotentiallyInvalidUsageOfThis
			/**
			 * @type {{}}
			 */
			this.css = concatObjectValues(original, this.props.css);
			if (componentWillMount) {
				componentWillMount.call(this);
			}
		};

		/**
		 * @param {{}} newProps
		 */
		target.prototype.componentWillUpdate = function(newProps) {
			//noinspection JSPotentiallyInvalidUsageOfThis
			/**
			 * @type {{}}
			 */
			this.css = concatObjectValues(original, newProps.css);
			if (componentWillUpdate) {
				componentWillUpdate.call(this, newProps);
			}
		};

		target.prototype.componentWillUnmount = function() {
			delete this['css'];
			if (componentWillUnmount) {
				componentWillUnmount.call(this);
			}
		};
	};
}

/**
 * Merges second object into first by concatinating values with same keys
 * @param {{}} object1
 * @param {{}} [object2={}]
 * @returns {{}}
 */
function concatObjectValues(object1, object2 = {}) {
	const result = Object.assign({}, object1);
	Object.keys(object2).forEach(key => {
		if (result[key]) {
			result[key] = `${result[key] || ''} ${object2[key]}`;
		} else {
			result[key] = object2[key];
		}
	});
	return result;
}