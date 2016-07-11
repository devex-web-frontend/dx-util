/**
 * Stores original css module and indicates that css object should be checked for equality in {@link PURE} components
 * @type {Symbol}
 */
export const CSS_DECORATOR_STORAGE = Symbol('CSS_DECORATOR_STORAGE');

/**
 * Indicates that lifecycle method is overridden by {@link @CSS} decorator
 * @type {Symbol}
 */
export const CSS_DECORATOR_OVERRIDE_MARKER = Symbol('CSS_DECORATOR_OVERRIDE_MARKER');