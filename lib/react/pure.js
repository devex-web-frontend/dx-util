"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("../object/object");
/**
 * Pure render checker
 * @param {object} props
 * @param {object} state
 * @param {object} newProps
 * @param {object} newState
 * @returns {boolean}
 */
function shouldComponentUpdate(props, state, newProps, newState) {
    return !object_1.shallowEqual(props, newProps) || !object_1.shallowEqual(state, newState);
}
exports.shouldComponentUpdate = shouldComponentUpdate;
/**
 * Pure render recorator
 */
function PURE(target) {
    //noinspection JSUnresolvedVariable
    var oldShouldComponentUpdate = target.prototype.shouldComponentUpdate;
    /**
     * @param {*} newProps
     * @param {*} newState
     * @returns {boolean}
     */
    target.prototype.shouldComponentUpdate = function (newProps, newState) {
        //check original shoulComponentUpdate
        var shouldUpdateByOriginal = !oldShouldComponentUpdate ||
            oldShouldComponentUpdate.call(this, newProps, newState);
        //check props.theme which can be set by react-css-themr
        var shouldCheckTheme = !!newProps['theme'];
        //check shallow equality
        //will be set further basing on shouldCheckCss
        var shouldUpdateByEquality;
        if (shouldCheckTheme) {
            //now we need to remove theme object from original props to avoid checking by shouldComponentUpdate
            var thisPropsCopy = Object.assign({}, this.props);
            var newPropsCopy = Object.assign({}, newProps);
            delete thisPropsCopy['theme'];
            delete newPropsCopy['theme'];
            //check
            shouldUpdateByEquality =
                //either props has changed (ignoring css)
                shouldComponentUpdate(thisPropsCopy, this.state, newPropsCopy, newState) ||
                    //or theme has changed
                    !object_1.deepEqual(this.props.theme, newProps['theme']);
        }
        else {
            //we don't need to do anything with the props so just call shouldComponentUpdate
            shouldUpdateByEquality = shouldComponentUpdate(this.props, this.state, newProps, newState);
        }
        return shouldUpdateByOriginal && shouldUpdateByEquality;
    };
    return target;
}
exports.PURE = PURE;
