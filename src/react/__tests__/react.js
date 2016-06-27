jest.disableAutomock();
import {PURE} from '../react';

describe('PURE decorator', () => {
	it('should decorate passed class with shouldComponentUpdate', () => {
		//
		@PURE
		class Foo {
			props = {
				a: 'a',
				b: 0
			}

			state = {
				a: 'a',
				b: 0
			}

			render() {

			}
		}
		const foo = new Foo();
		expect(Foo.prototype.shouldComponentUpdate).toBeDefined();
		expect(foo.shouldComponentUpdate).toBeDefined();
		expect(foo.shouldComponentUpdate(
			foo.props,
			foo.state
		)).toBeFalsy();
		expect(foo.shouldComponentUpdate(
			Object.assign({}, foo.props, {
				a: 'b'
			}),
			foo.state
		)).toBeTruthy();
		expect(foo.shouldComponentUpdate(
			foo.props,
			Object.assign({}, foo.state, {
				b: 1
			})
		));
	});
});