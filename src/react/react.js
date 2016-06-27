import {shallowEqual} from '../object/object';

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