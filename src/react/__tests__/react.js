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
		it('should check css object for equality when using with @CSS', () => {
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
			@CSS(css)
			@PURE
			class Foo {
				props = {
					css: css2 //this.css is a mix of css and css2
				}
			}
			const foo = new Foo();
			expect(foo.shouldComponentUpdate({ //same css
				css: css2
			})).toBeFalsy();
			expect(foo.shouldComponentUpdate({ //different css but with same structure
				css: css3
			})).toBeFalsy();
			expect(foo.shouldComponentUpdate({ //different css
				css: css4
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

	describe('CSS decorator', () => {
		const css = {
			test: 'original'
		};
		const componentWillMount = jest.fn();
		const componentWillUpdate = jest.fn();
		const componentWillUnmount = jest.fn();
		@CSS(css)
		class Foo {
			componentWillMount() {
				componentWillMount();
			}

			componentWillUpdate(newProps) {
				componentWillUpdate(newProps);
			}

			componentWillUnmount() {
				componentWillUnmount();
			}
		}
		const foo = new Foo();
		it('should inject this.css mixed from original css and props.css', () => {
			foo.props = {
				css: {
					test: 'test2'
				}
			};
			foo.componentWillMount();
			expect(foo.css).toEqual({
				test: 'original test2'
			});
			expect(componentWillMount).toBeCalled();
		});

		it('should mix original css and props.css on update', () => {
			const newProps = {
				css: {
					test3: '111'
				}
			};
			foo.componentWillUpdate(newProps);
			expect(foo.css).toEqual({
				test: 'original',
				test3: '111'
			});
			expect(componentWillUpdate).toBeCalledWith(newProps);
		});

		it('should remove link to css storage on unmount', () => {
			foo.componentWillUnmount();
			expect(foo.css).not.toBeDefined();
			expect(componentWillUnmount).toBeCalled();
		});

		fdescribe('inheritance', () => {
			const fooCss = {
				foo: 'foo'
			};
			@CSS(fooCss)
			class Foo2 {

			}
			const barCss = {
				bar: 'bar'
			};
			@CSS(barCss)
			class Bar extends Foo2 {
				props = {
					css: {
						p: 'p'
					}
				}

				//to preserve context
				componentWillMount() {
				}

				componentWillUpdate(newProps) {

				}
			}
			it('should mix both child and parent css modules and props.css', () => {
				const bar = new Bar();
				bar.componentWillMount();
				expect(bar.css).toEqual({
					foo: 'foo',
					bar: 'bar',
					p: 'p'
				});
			});

			it('should mix both child and parent css modules and props.css on update', () => {
				const bar = new Bar();
				bar.componentWillUpdate({
					css: {
						fff: 'fff'
					}
				});
				expect(bar.css).toEqual({
					foo: 'foo',
					bar: 'bar',
					fff: 'fff'
				});
			});

			it('should inject only to current class prototype and ignore parent', () => {
				const foo = new Foo2();
				const bar = new Bar();
				foo.componentWillUpdate({
					css: {
						ddd: 'ddd'
					}
				});
				bar.componentWillUpdate({
					css: {
						fff: 'fff'
					}
				});
				expect(foo.css).toEqual({
					foo: 'foo',
					ddd: 'ddd'
				});
				expect(bar.css).toEqual({
					foo: 'foo',
					bar: 'bar',
					fff: 'fff'
				});
			});
		});
		// it('should inject css names from props on mount and on recieve props', () => {
		// 	const newCss = {
		// 		test: 'test'
		// 	};
		// 	foo.props = {
		// 		css: newCss
		// 	};
		// 	foo.componentWillMount();
		// 	expect(Foo.prototype.css).toEqual(css); //prototype is still clean
		// 	expect(foo.css).toEqual({
		// 		container: 'container',
		// 		test: 'original test'
		// 	}); //instance is merged
		// 	expect(componentWillMount).toBeCalled(); //old componentWillMount is also called
		// 	const newCss2 = {
		// 		test: 'test2'
		// 	};
		// 	const newProps = {
		// 		css: newCss2
		// 	};
		// 	foo.componentWillUpdate(newProps);
		// 	expect(componentWillUpdate).toBeCalled();
		// 	expect(Foo.prototype.css).toEqual(css); //prototype is still clean
		// 	expect(foo.css).toEqual({
		// 		container: 'container',
		// 		test: 'original test2'
		// 	});
		// 	foo.componentWillUpdate({}); //pass empty props without css
		// 	expect(componentWillUpdate).toBeCalled();
		// 	expect(Foo.prototype.css).toEqual(css); //prototype is still clean
		// 	expect(foo.css).toEqual(css); //should take original css module
		// });
	});
});