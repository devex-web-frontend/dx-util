import {CSS_DECORATOR_STORAGE} from './__private__/css-pure-bridge';

/**
 * CSS decorator
 * @param {{}} cssModule
 * @returns {function(target: class):class}
 */
export function CSS(cssModule = {}) {
	return function(target) {
		//noinspection JSDuplicatedDeclaration
		const oldComponentWillMount = target.prototype.componentWillMount;
		const oldComponentWillUpdate = target.prototype.componentWillUpdate;
		const oldComponentWillUnmount = target.prototype.componentWillUnmount;

		//get parent class css module
		//prototype read is chained so we'll get parent's class css module
		const parentCss = target.prototype[CSS_DECORATOR_STORAGE];

		//mix parent with current css module and set on current prototype
		//prototype assignment is not chained - so we'll set only on current prototype
		const original = target.prototype[CSS_DECORATOR_STORAGE] = concatObjectValues(parentCss, cssModule);

		//create functions in this closure

		function componentWillMount() {
			//we need to check if we are already in decorated componentWillUmount
			//if so then we are called from child class it ITS CONTEXT (call(this))
			//so we don't need to overwrite this.css with wrong (child's) context

			if (oldComponentWillMount !== componentWillMount) {
				//noinspection JSPotentiallyInvalidUsageOfThis
				/**
				 * @type {{}}
				 */
				this.css = concatObjectValues(original, this.props.css);
			}

			//call old function
			if (oldComponentWillMount) {
				oldComponentWillMount.call(this);
			}
		}

		/**
		 * @param {{}} newProps
		 */
		function componentWillUpdate(newProps) {
			if (oldComponentWillUpdate !== componentWillUpdate) {
				//noinspection JSPotentiallyInvalidUsageOfThis
				/**
				 * @type {{}}
				 */
				this.css = concatObjectValues(original, newProps.css);
			}
			if (oldComponentWillUpdate) {
				oldComponentWillUpdate.call(this, newProps);
			}
		}

		function componentWillUnmount() {
			if (oldComponentWillUnmount !== componentWillUnmount) {
				delete this['css'];
			}
			if (componentWillUnmount) {
				componentWillUnmount.call(this);
			}
		}

		//inject react lifecycle methods to prototype
		target.prototype.componentWillMount = componentWillMount;
		target.prototype.componentWillUpdate = componentWillUpdate;
		target.prototype.componentWillUnmount = componentWillUnmount;
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