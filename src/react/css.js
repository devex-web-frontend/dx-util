import {CSS_DECORATOR_STORAGE} from './__private__/shared';

const CONTEXT = {};

/**
 * CSS decorator
 * @param {{}} cssModule
 * @returns {function(target: class):class}
 */
export function CSS(cssModule = {}) {
	return function(target) {
		//noinspection JSUnresolvedVariable
		const oldComponentWillMount = target.prototype.componentWillMount;
		//noinspection JSUnresolvedVariable
		const oldComponentWillUpdate = target.prototype.componentWillUpdate;
		//noinspection JSUnresolvedVariable
		const oldComponentWillUnmount = target.prototype.componentWillUnmount;

		//get parent class css module
		//prototype read is chained so we'll get parent's class css module
		const parentCss = target.prototype[CSS_DECORATOR_STORAGE];

		//mix parent with current css module and set on current prototype
		//prototype assignment is not chained - so we'll set only on current prototype
		const original = target.prototype[CSS_DECORATOR_STORAGE] = concatObjectValues(parentCss, cssModule);

		//create lifecycle methods

		function componentWillMount() {
			//if this is CONTEXT then we are manually called from child's componentWillMount
			//extract child's context as this.context
			const context = extractContext(this);

			//noinspection JSValidateTypes
			if (checkContext(context, target)) {
				//we are in original class and not called from child class in another context via call(this)
				context.css = concatObjectValues(original, context.props.css);
			}

			//call old version of function if exists
			if (oldComponentWillMount) {
				//call in special context to differ from usual call
				oldComponentWillMount.call(Object.assign(CONTEXT, {
					context
				}));
			}
		}

		/**
		 * @param {{}} newProps
		 */
		function componentWillUpdate(newProps) {
			const context = extractContext(this);
			//noinspection JSValidateTypes
			if (checkContext(context, target)) {
				this.css = concatObjectValues(original, newProps.css);
			}
			if (oldComponentWillUpdate) {
				oldComponentWillUpdate.call(Object.assign(CONTEXT, {
					context
				}), newProps);
			}
		}

		function componentWillUnmount() {
			const context = extractContext(this);
			//noinspection JSValidateTypes
			if (checkContext(context, target)) {
				delete this['css'];
			}
			if (oldComponentWillUnmount) {
				oldComponentWillUnmount.call(Object.assign(CONTEXT, {
					context
				}));
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

function checkContext(context, target) {
	return this !== CONTEXT || this === CONTEXT && context.constructor === target;
}

/**
 * @param {*} context
 * @returns {{}}
 */
function extractContext(context) {
	return context === CONTEXT ? context.context : context;
}