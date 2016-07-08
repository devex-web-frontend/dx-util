jest.disableAutomock();
import {is, shallowEqual} from '../object';

describe('object', () => {
	describe('is', () => {
		it('should compare objects', () => {
			/*eslint-disable no-undefined*/
			expect(is(undefined, undefined)).toBeTruthy();
			expect(is(undefined, 1)).toBeFalsy();
			expect(is(null, null)).toBeTruthy();
			expect(is(1, null)).toBeFalsy();
			expect(is(true, true)).toBeTruthy();
			expect(is(false, false)).toBeTruthy();
			expect(is(true, false)).toBeFalsy();
			expect(is('123', '123')).toBeTruthy();
			expect(is('foo', 'bar')).toBeFalsy();
			const a = {};
			expect(is(a, a)).toBeTruthy();
			expect(is(a, {})).toBeFalsy();
			expect(is(1, 1)).toBeTruthy();
			expect(is(-1, -1)).toBeTruthy();
			expect(is(NaN, NaN)).toBeTruthy();
			expect(is(+0, +0)).toBeTruthy();
			expect(is(-0, -0)).toBeTruthy();
			expect(is(0, -0)).toBeFalsy();
			expect(is(NaN, 0/0)).toBeTruthy(); //eslint-disable-line space-infix-ops
		});
	});
});