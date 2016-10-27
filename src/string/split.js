/**
 * Splits sources string by given substring
 * @param {string} string
 * @param {string} substring
 * @param {boolean} [caseSensitive=true]
 * @returns {Array.<string>}
 */
export default function split(string, substring, caseSensitive = true) {
	if (!substring && substring !== '0') {
		return [string];
	}

	const flags = `${caseSensitive ? '' : 'i'}gm`;
	const pattern = substring.replace(/([\[()*+?.\\^$|])/g, '\\$1');
	const regexp = new RegExp(`(${pattern})`, flags);

	return string.split(regexp);
}