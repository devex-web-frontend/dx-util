import {shallowEqual} from '../object/object';
import {DISPOSABLE as fdisposable} from '../function/disposable';

/**
 * Indicates that css object should be checked for equality in {@link PURE} components
 * @type {Symbol}
 */
const CSS_DECORATOR_STORAGE = Symbol('_CHECK_FOR_CSS_EQUALITY_');

/**
 * Pure render checker
 * @param {object} props
 * @param {object} state
 * @param {object} newProps
 * @param {object} newState
 * @returns {boolean}
 */
export function shouldComponentUpdate(props, state, newProps, newState) {
	return !shallowEqual(props, newProps) || !shallowEqual(state, newState);
}

/**
 * Pure render recorator
 * @param {class} target
 * @returns {class}
 */
export function PURE(target) {
	//noinspection JSUnresolvedVariable
	const oldShouldComponentUpdate = target.prototype.shouldComponentUpdate;
	/**
	 * @param {*} newProps
	 * @param {*} newState
	 * @returns {boolean}
	 */
	target.prototype.shouldComponentUpdate = function(newProps, newState) {
		//check original shoulComponentUpdate
		const shouldUpdateByOriginal =
			!oldShouldComponentUpdate ||
			oldShouldComponentUpdate.call(this, newProps, newState);

		//check props.css if decorated with @CSS and should compare
		const shouldCheckCSS = !!target.prototype[CSS_DECORATOR_STORAGE];

		//check shallow equality
		//will be set further basing on shouldCheckCss
		let shouldUpdateByEquality;

		if (shouldCheckCSS) {
			//now we need to remove css object from original props to avoid checking by shouldComponentUpdate
			const thisPropsCopy = Object.assign({}, this.props);
			const newPropsCopy = Object.assign({}, newProps);
			delete thisPropsCopy['css'];
			delete newPropsCopy['css'];

			//check
			shouldUpdateByEquality =
				//either props has changed (ignoring css)
				shouldComponentUpdate(thisPropsCopy, this.state, newPropsCopy, newState) ||
				//or css has changed
				shouldComponentUpdate(this.props.css, null, newProps.css, null);
		} else {
			//we don't need to do anything with the props so just call shouldComponentUpdate
			shouldUpdateByEquality = shouldComponentUpdate(this.props, this.state, newProps, newState);
		}

		return shouldUpdateByOriginal && shouldUpdateByEquality;
	};
	return target;
}

/**
 * @param {class} target
 * @returns {class}
 */
export function DISPOSABLE(target) {
	/**
	 * @type {class}
	 */
	const disposable = fdisposable(target);
	//noinspection JSDuplicatedDeclaration
	const componentWillUnmount = disposable.prototype.componentWillUnmount;
	disposable.prototype.componentWillUnmount = function() {
		if (componentWillUnmount) {
			componentWillUnmount();
		}
		this.dispose();
	};
	return disposable;
}

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
				componentWillMount();
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
				componentWillUpdate(newProps);
			}
		};

		target.prototype.componentWillUnmount = function() {
			delete this['css'];
			if (componentWillUnmount) {
				componentWillUnmount();
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