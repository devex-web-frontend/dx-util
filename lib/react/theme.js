"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var PropTypes = require("prop-types");
var THEME_CONTEXT_KEY = '@@dx-util/theme-context-key'; //should be serializable
var THEME_CONFIG_KEY = Symbol('@@dx-util/theme-config-key');
function theme(name, defaultTheme) {
    function decorate(Target) {
        var config = Target.config;
        if (config && config.name === name) {
            //already wrapped - just merge in new defaultTheme
            config.theme = mergeTwo(config.theme, defaultTheme);
            return Target;
        }
        return _a = (function (_super) {
                tslib_1.__extends(Themed, _super);
                function Themed() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Themed.prototype.render = function () {
                    var props = tslib_1.__assign({}, this.props, { theme: mergeTwo(mergeTwo(defaultTheme, this.context.theme[name]), this.props.theme) });
                    return react_1.createElement(Target, props);
                };
                return Themed;
            }(react_1.Component)),
            _a.displayName = "Themed(" + Target.name + ")",
            _a.contextTypes = (_b = {},
                _b[THEME_CONTEXT_KEY] = PropTypes.object.isRequired,
                _b),
            _a;
        var _a;
        var _b;
    }
    return decorate;
}
exports.theme = theme;
/**
 * Merges passed themes by concatenating string keys and processing nested themes
 */
function merge() {
    var themes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        themes[_i] = arguments[_i];
    }
    return themes.reduce(function (acc, theme) { return merge(acc, theme); }, {});
}
exports.merge = merge;
function mergeTwo(original, mixin) {
    if (original === void 0) { original = {}; }
    if (mixin === void 0) { mixin = {}; }
    //make a copy to avoid mutations of nested objects
    //also strip all functions injected by isomorphic-style-loader
    var result = Object.keys(original).reduce(function (acc, key) {
        var value = original[key];
        if (typeof value !== 'function') {
            acc[key] = value;
        }
        return acc;
    }, {});
    //traverse mixin keys and merge them to resulting theme
    Object.keys(mixin).forEach(function (key) {
        //there's no need to set any defaults here
        var originalValue = result[key];
        var mixinValue = mixin[key];
        switch (typeof mixinValue) {
            case 'object': {
                //possibly nested theme object
                switch (typeof originalValue) {
                    case 'object': {
                        //exactly nested theme object - go recursive
                        result[key] = merge(originalValue, mixinValue);
                        break;
                    }
                    case 'undefined': {
                        //original does not contain this nested key - just take it as is
                        result[key] = mixinValue;
                        break;
                    }
                    default: {
                        //can't merge an object with a non-object
                        throw new Error("You are merging object " + key + " with a non-object " + originalValue);
                    }
                }
                break;
            }
            case 'undefined': //fallthrough - handles accidentally unset values which may come from props
            case 'function': {
                //this handles issue when isomorphic-style-loader addes helper functions to css-module
                break; //just skip
            }
            default: {
                //plain values
                switch (typeof originalValue) {
                    case 'object': {
                        //can't merge a non-object with an object
                        throw new Error("You are merging non-object " + mixinValue + " with an object " + key);
                    }
                    case 'undefined': {
                        //mixin key is new to original theme - take it as is
                        result[key] = mixinValue;
                        break;
                    }
                    case 'function': {
                        //this handles issue when isomorphic-style-loader addes helper functions to css-module
                        break; //just skip
                    }
                    default: {
                        //finally we can merge
                        result[key] = originalValue.split(' ')
                            .concat(mixinValue.split(' '))
                            .filter(function (item, pos, self) { return self.indexOf(item) === pos && item !== ''; })
                            .join(' ');
                        break;
                    }
                }
                break;
            }
        }
    });
    return result;
}
var ThemeProvider = (function (_super) {
    tslib_1.__extends(ThemeProvider, _super);
    function ThemeProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThemeProvider.prototype.render = function () {
        return react_1.Children.only(this.props.children);
    };
    ThemeProvider.prototype.getChildContext = function () {
        return {
            theme: this.props.theme
        };
    };
    ThemeProvider.childContextTypes = (_a = {},
        _a[THEME_CONTEXT_KEY] = PropTypes.object,
        _a);
    return ThemeProvider;
}(react_1.Component));
exports.ThemeProvider = ThemeProvider;
var _a;
