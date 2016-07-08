import {shallowEqual} from '../object/object';

import {CSS_DECORATOR_STORAGE} from './__private__/css-pure-bridge';

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