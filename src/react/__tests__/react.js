jest.disableAutomock();
import {PURE, DISPOSABLE} from '../react';

describe('react', () => {
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

	describe('DISPOSABLE', () => {
		it('should decorate', () => {
			//
			@DISPOSABLE
			class Foo {

			}
			const foo = new Foo();
			expect(foo.dispose).toBeDefined();
			expect(Foo.prototype.componentWillUnmount).toBeDefined();
		});
		it('should dispose on componentWillUnmount', () => {
			const callback = jest.fn();
			@DISPOSABLE
			class Component {
				constructor() {
					this._using([callback]);
				}
			}
			const c = new Component();
			c.componentWillUnmount();
			expect(callback).toBeCalled();
		});
		it('should dispose with custom componentWillUnmount', () => {
			const callback = jest.fn();
			const componentWillUnmount = jest.fn();
			@DISPOSABLE
			class Component {
				constructor() {
					this._using([callback]);
				}
				componentWillUnmount() {
					componentWillUnmount();
				}
			}
			const c = new Component();
			c.componentWillUnmount();
			expect(callback).toBeCalled();
			expect(componentWillUnmount).toBeCalled();
		});
	});
});