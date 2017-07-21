/**
 * Replaces underscores and camelCase with dashes.
 */
export declare function dasherize(string: string, lower?: boolean): string;
/**
 * Camelizes given string
 */
export declare function camelize(string: string, lower?: boolean): string;
/**
 * Generate a unique id
 */
export declare function randomId(prefix?: string | number, postfix?: string | number): string;
/**
 * Capitalizes given string
 */
export declare function capitalize(string: string): string;
/**
 * Decapitalizes given string
 */
export declare function decapitalize(string: string): string;
/**
 * Chooses correct value for passed number (1, 2-4, 0 or many) for three base declensions (RUS)
 */
export declare function pluralize3(number: number, declensions: string[]): string;
/**
 * Chooses correct value for passed number (1, 0 or many) for two base declensions (EN, etc.)
 * @param {Number} number
 * @param {Array.<String>} declensions
 * @returns {String}
 */
export declare function pluralize2(number: number, declensions: string[]): string;
/**
 * Generates universal unique id
 * @see https://gist.github.com/gordonbrander/2230317#gistcomment-1618310
 */
export declare function uuid(): string;
