import {shallowEqual} from '../object/object';
import {DISPOSABLE as fdisposable} from '../function/disposable';

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
		return (!oldShouldComponentUpdate || oldShouldComponentUpdate.call(this, newProps, newState)) &&
			shouldComponentUpdate(this.props, this.state, newProps, newState);
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
 * @param {{}} cssModule
 * @returns {function(target: class):class}
 */
export function CSS(cssModule) {
	return function(target) {
		//noinspection JSDuplicatedDeclaration
		const {componentWillMount, componentWillReceiveProps} = target.prototype;
		target.prototype.css = Object.assign({}, cssModule);
		target.prototype.componentWillMount = function() {
			if (this.props.css) {
				this.css = concatObjectValues(cssModule, this.props.css);
			}

			if (componentWillMount) {
				componentWillMount();
			}
		};
		target.prototype.componentWillReceiveProps = function(props) {
			if (this.props.css !== props.css) {
				this.css = concatObjectValues(cssModule, props.css);
			}

			if (componentWillReceiveProps) {
				componentWillReceiveProps();
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