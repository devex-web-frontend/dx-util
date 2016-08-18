jest.disableAutomock();
import {shouldComponentUpdate, PURE, DISPOSABLE, CSS} from '../react';

describe('react', () => {
	describe('shouldComponentUpdate', () => {
		it('should check for shallow equality', () => {
			const props = {
				a: 'a',
				b: 0
			};

			const state = {
				a: 'a',
				b: 0
			};

			expect(shouldComponentUpdate(
				props,
				state,
				props,
				state
			)).toBeFalsy();
			expect(shouldComponentUpdate(
				props,
				state,
				Object.assign({}, props, {
					a: 'b'
				}),
				state
			)).toBeTruthy();
			expect(shouldComponentUpdate(
				props,
				state,
				props,
				Object.assign({}, state, {
					b: 1
				})
			));
		});
	});
	describe('PURE decorator', () => {
		it('should decorate passed class with shouldComponentUpdate', () => {
			//
			@PURE()
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
		});
		it('should include base shouldComponentUpdate to resulting condition', () => {
			//
			@PURE()
			class Foo {
				props = {
					a: 1
				}

				shouldComponentUpdate() {
					return false;
				}
			}
			const foo = new Foo();
			expect(foo.shouldComponentUpdate({
				a: 2 //value is different
			})).toBeFalsy(); //but base shouldComponentUpdate returns false
		});
		it('should check options.shallow objects for equality', () => {
			const css = {
				container: 'container'
			};
			const css2 = { //different objects with same structure
				test: 'test'
			};
			const css3 = { //different objects with same structure
				test: 'test'
			};
			const css4 = {
				test: 'bla'
			};
			@PURE({
				shallow: ['theme']
			})
			class Foo {
				props = {
					theme: css2
				}
			}
			const foo = new Foo();
			expect(foo.shouldComponentUpdate({
				theme: css2
			})).toBeFalsy();
			expect(foo.shouldComponentUpdate({
				theme: css3
			})).toBeFalsy();
			expect(foo.shouldComponentUpdate({
				theme: css4
			})).toBeTruthy();
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