"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_1 = require("../string/string");
var properties = [
    'alignContent',
    'alignItems',
    'alignSelf',
    'animation',
    'animationDelay',
    'animationDirection',
    'animationDuration',
    'animationFillMode',
    'animationIterationCount',
    'animationName',
    'animationPlayState',
    'animationTimingFunction',
    'appearance',
    'aspectRatio',
    'backfaceVisibility',
    'backgroundClip',
    'borderImage',
    'borderImageSlice',
    'boxShadow',
    'columnCount',
    'columnFill',
    'columnGap',
    'columnRule',
    'columnRuleColor',
    'columnRuleStyle',
    'columnRuleWidth',
    'columnSpan',
    'columnWidth',
    'columns',
    'flex',
    'flexBasis',
    'flexDirection',
    'flexFlow',
    'flexGrow',
    'flexShrink',
    'flexWrap',
    'fontFeatureSettings',
    'fontKearning',
    'fontVariantLigatures',
    'justifyContent',
    'grid',
    'gridArea',
    'gridAutoColumns',
    'gridAutoFlow',
    'gridAutoRows',
    'gridColumn',
    'gridColumnEnd',
    'gridColumnStart',
    'gridRow',
    'gridRowEnd',
    'gridRowStart',
    'gridTemplate',
    'gridTemplateAreas',
    'gridTemplateColumns',
    'gridTemplateRows',
    'hyphens',
    'lineBreak',
    'perspective',
    'perspectiveOrigin',
    'perspectiveOriginX',
    'perspectiveOriginY',
    'rubyPosition',
    'scrollSnapCoordinate',
    'scrollSnapDestination',
    'scrollSnapPoints',
    'scrollSnapPointsX',
    'scrollSnapPointsY',
    'scrollSnapType',
    'tabSize',
    'textDecoration',
    'textDecorationColor',
    'textDecorationLine',
    'textDecorationStyle',
    'textOrientation',
    'textSizeAdjust',
    'transform',
    'transition',
    'transformOrigin',
    'transformOriginX',
    'transformOriginY',
    'transformOriginZ',
    'transformStyle',
    'transitionProperty',
    'transitionDuration',
    'transitionTimingFunction',
    'transitionDelay',
    'userModify',
    'userSelect'
];
/**
 * Prefixes vendor keys
 * @param {{}} styles
 * @returns {{}}
 */
function prefix(styles) {
    return Object.keys(styles).reduce(function (acc, key) {
        var value = styles[key];
        acc[key] = value;
        if (properties.indexOf(key) !== -1) {
            acc["WebKit" + string_1.capitalize(key)] = value;
            acc["Moz" + string_1.capitalize(key)] = value;
            acc["ms" + string_1.capitalize(key)] = value;
            acc["O" + string_1.capitalize(key)] = value;
        }
        return acc;
    }, {});
}
exports.default = prefix;
