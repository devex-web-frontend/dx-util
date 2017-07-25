"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./__private__/shared");
/**
 * Indicates that lifecycle method is overridden by {@link @CSS} decorator
 * @type {Symbol}
 */
var CSS_DECORATOR_OVERRIDE_MARKER = Symbol('CSS_DECORATOR_OVERRIDE_MARKER');
var CONTEXT = {};
/**
 * CSS decorator
 */
function CSS(cssModule) {
    if (cssModule === void 0) { cssModule = {}; }
    console.warn('CSS decorator is deprecated. Use react-css-themr');
    return function (target) {
        //noinspection JSUnresolvedVariable
        var oldComponentWillMount = target.prototype.componentWillMount;
        //noinspection JSUnresolvedVariable
        var oldComponentWillUpdate = target.prototype.componentWillUpdate;
        //noinspection JSUnresolvedVariable
        var oldComponentWillUnmount = target.prototype.componentWillUnmount;
        //get parent class css module
        //prototype read is chained so we'll get parent's class css module
        var parentCss = target.prototype[shared_1.CSS_DECORATOR_STORAGE];
        //mix parent with current css module and set on current prototype
        //prototype assignment is not chained - so we'll set only on current prototype
        var original = target.prototype[shared_1.CSS_DECORATOR_STORAGE] = concatObjectValues(parentCss, cssModule);
        //create lifecycle methods
        /**
         * componentWillMount
         */
        function componentWillMount() {
            //if this is CONTEXT then we are manually called from child's componentWillMount
            //extract child's context as this.context
            var context = extractContext(this);
            //noinspection JSValidateTypes
            if (this !== CONTEXT) {
                //we are called either as usual from react lifecycle
                //or manually wuth custom context but we are in original target class
                context.css = concatObjectValues(original, context.props.css);
            }
            //call old version of function if exists
            if (oldComponentWillMount) {
                oldComponentWillMount.call(composeContext(oldComponentWillMount, context));
            }
        }
        //mark method as overridden to check it further before composing context to call original method
        overrideMethod(componentWillMount);
        /**
         * componentWillUpdate
         * @param {{}} newProps
         */
        function componentWillUpdate(newProps) {
            var context = extractContext(this);
            //noinspection JSValidateTypes
            if (this !== CONTEXT) {
                this.css = concatObjectValues(original, newProps['css']);
            }
            if (oldComponentWillUpdate) {
                oldComponentWillUpdate.call(composeContext(oldComponentWillUpdate, context), newProps);
            }
        }
        overrideMethod(componentWillUpdate);
        /**
         * componentWillUnmount
         */
        function componentWillUnmount() {
            var context = extractContext(this);
            //noinspection JSValidateTypes
            if (this !== CONTEXT) {
                delete this['css'];
            }
            if (oldComponentWillUnmount) {
                oldComponentWillUnmount.call(composeContext(oldComponentWillUnmount, context));
            }
        }
        overrideMethod(componentWillUnmount);
        //inject react lifecycle methods to prototype
        target.prototype.componentWillMount = componentWillMount;
        target.prototype.componentWillUpdate = componentWillUpdate;
        target.prototype.componentWillUnmount = componentWillUnmount;
    };
}
exports.CSS = CSS;
/**
 * Merges second object into first by concatinating values with same keys
 * @param {{}} object1
 * @param {{}} [object2={}]
 * @returns {{}}
 */
function concatObjectValues(object1, object2) {
    if (object2 === void 0) { object2 = {}; }
    var result = Object.assign({}, object1);
    Object.keys(object2).forEach(function (key) {
        if (result[key]) {
            result[key] = (result[key] || '') + " " + object2[key];
        }
        else {
            result[key] = object2[key];
        }
    });
    return result;
}
/**
 * @param {*} context
 * @returns {{}}
 */
function extractContext(context) {
    return context === CONTEXT ? context['context'] : context;
}
function composeContext(method, context) {
    //we need to detect if old method is overridden to work with custom context
    if (method[CSS_DECORATOR_OVERRIDE_MARKER]) {
        //call in special context to differ from usual call
        return Object.assign(CONTEXT, {
            context: context
        });
    }
    return context;
}
function overrideMethod(method) {
    method[CSS_DECORATOR_OVERRIDE_MARKER] = true;
}
