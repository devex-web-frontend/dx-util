import {shallowEqual} from '../object/object';
import {DISPOSABLE as fdisposable} from '../function/disposable';

/**
 * Indicates that css object should be checked for equality in {@link PURE} components
 * @type {Symbol}
 */
const CHECK_FOR_CSS_EQUALITY = Symbol('_CHECK_FOR_CSS_EQUALITY_');

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
		const shouldCheckCSS = !!target.prototype[CHECK_FOR_CSS_EQUALITY];

		//check shallow equality
		//will be set further basing on shouldCheckCss
		let shouldUpdateByEquality;

		if (shouldCheckCSS) {
			//now we need to remove css object from original props to avoid checking by shouldComponentUpdate
			const thisPropsCss = this.props.css;
			delete this.props['css'];
			const newPropsCss = newProps.css;
			delete newProps['css'];
			//check
			shouldUpdateByEquality =
				//either props has changed (ignoring css)
				shouldComponentUpdate(this.props, this.state, newProps, newState) ||
				//or css has changed
				shouldComponentUpdate(thisPropsCss, null, newPropsCss, null);
			//restore css on the props
			this.props.css = thisPropsCss;
			newProps.css = newPropsCss;
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
 * @typedef {Object} TCSSDecoratorOptions
 * @property {boolean} [compare] - Check props.css equality in {@link PURE} components
 */

/**
 * @param {{}} cssModule
 * @param {TCSSDecoratorOptions} [options={}]
 * @returns {function(target: class):class}
 */
export function CSS(cssModule, options = {}) {
	return function(target) {
		//noinspection JSDuplicatedDeclaration
		const {componentWillMount, componentWillUpdate} = target.prototype;
		if (options.compare) {
			target.prototype[CHECK_FOR_CSS_EQUALITY] = true;
		}
		target.prototype.css = Object.assign({}, cssModule);
		target.prototype.componentWillMount = function() {
			if (this.props.css) {
				this.css = concatObjectValues(cssModule, this.props.css);
			}

			if (componentWillMount) {
				componentWillMount();
			}
		};
		target.prototype.componentWillUpdate = function(nextProps) {
			if (this.props.css !== nextProps.css) {
				this.css = concatObjectValues(cssModule, nextProps.css);
			}

			if (componentWillUpdate) {
				componentWillUpdate();
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
		result[key] = `${result[key] || ''} ${object2[key]}`;
	});
	return result;
}