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
		});
		it('should include base shouldComponentUpdate to resulting condition', () => {
			//
			@PURE
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

	describe('CSS decorator', () => {
		const css = {
			container: 'container',
			test: 'original'
		};
		const componentWillMount = jest.fn();
		const componentWillReceiveProps = jest.fn();
		@CSS(css)
		class Foo {
			componentWillMount() {
				componentWillMount();
			}

			componentWillReceiveProps() {
				componentWillReceiveProps();
			}
		}
		const foo = new Foo();
		it('should decorate and inject passed initial css to prototype', () => {
			expect(Foo.prototype.css).toEqual(css);
		});
		it('should inject css names from props on mount and on recieve props', () => {
			const newCss = {
				test: 'test'
			};
			foo.props  = {
				css: newCss
			};
			foo.componentWillMount();
			expect(Foo.prototype.css).toEqual(css); //prototype is still clean
			expect(foo.css).toEqual({
				container: 'container',
				test: 'original test'
			}); //instance is merged
			expect(componentWillMount).toBeCalled(); //old componentWillMount is also called
			const newCss2 = {
				test: 'test2'
			};
			const newProps = {
				css: newCss2
			};
			foo.componentWillReceiveProps(newProps);
			expect(Foo.prototype.css).toEqual(css); //prototype is still clean
			expect(foo.css).toEqual({
				container: 'container',
				test: 'original test2'
			});
			foo.componentWillReceiveProps({}); //pass empty props without css
			expect(Foo.prototype.css).toEqual(css); //prototype is still clean
			expect(foo.css).toEqual(css); //should take original css module
		});
	});
});