import {shallowEqual} from '../object/object';
import {DISPOSABLE as fdisposable} from '../function/disposable';

/**
 * Pure render recorator
 * @param {class} target
 * @returns {class}
 */
export function PURE(target) {
	target.prototype.shouldComponentUpdate = function(newProps, newState) {
		return !shallowEqual(this.props, newProps) || !shallowEqual(this.state, newState);
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
	//noinspection JSUnresolvedVariable
	const componentWillUnmount = disposable.prototype.componentWillUnmount;
	disposable.prototype.componentWillUnmount = function() {
		if (componentWillUnmount) {
			componentWillUnmount();
		}
		this.dispose();
	};
	return disposable;
}