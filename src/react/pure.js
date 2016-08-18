import {shallowEqual} from '../object/object';

import {CSS_DECORATOR_STORAGE} from './__private__/shared';

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
 * @typedef {Object} TPUREDecoratorOptions
 * @property {Array.<String>} [shallow=['theme']]
 */

let deprecatedMessagePrinted = false;

/**
 * Pure render recorator
 * @param {class|TPUREDecoratorOptions} [targetOrOptions]
 * @returns {class|function(target:class):class}
 */
export function PURE(targetOrOptions) {
	if (typeof targetOrOptions === 'function') {
		//no options - deprecated usage
		if (!deprecatedMessagePrinted) {
			deprecatedMessagePrinted = true;
			console.warn('DEPRECATION: @PURE decorator now should be called as function');
		}
		return pureWithOptions()(targetOrOptions);
	} else {
		return pureWithOptions(targetOrOptions);
	}
}

/**
 * @param {TPUREDecoratorOptions} [options]
 * @returns {function(target:class):class}
 */
function pureWithOptions(options = {}) {
	return target => {
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

			//check props.theme which can be set by react-css-themr
			const shallows = options.shallow || ['theme'];

			//check shallow equality
			//will be set further basing on shouldCheckCss
			let shouldUpdateByEquality;

			if (shallows.length > 0) {
				//now we need to remove object for separate shallow comparation
				// from original props to avoid checking by shouldComponentUpdate
				const thisPropsCopy = Object.assign({}, this.props);
				const newPropsCopy = Object.assign({}, newProps);
				shallows.forEach(shallow => {
					delete thisPropsCopy[shallow];
					delete newPropsCopy[shallow];
				});

				//check
				shouldUpdateByEquality =
					//either props has changed (ignoring css)
					shouldComponentUpdate(thisPropsCopy, this.state, newPropsCopy, newState) ||
					//or one of object for shallow comparisons has changed
					shallows.reduce((acc, shallow) => {
						return acc || shouldComponentUpdate(this.props[shallow], null, newProps[shallow], null);
					}, false);
			} else {
				//we don't need to do anything with the props so just call shouldComponentUpdate
				shouldUpdateByEquality = shouldComponentUpdate(this.props, this.state, newProps, newState);
			}

			return shouldUpdateByOriginal && shouldUpdateByEquality;
		};
		return target;
	};
}