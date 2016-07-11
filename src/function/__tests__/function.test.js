jest.disableAutomock();

import debounce, {DEBOUNCE} from '../debounce';
import throttle, {THROTTLE} from '../throttle';
import memoize, {MEMOIZE} from '../memoize';
import {DISPOSABLE} from '../disposable';

describe('function', () => {
	describe('debounce', () => {
		it('should invoke decorated func after timeout', () => {
			const callback = jest.fn();
			const debounced = debounce(callback, 100);

			debounced();
			expect(callback).not.toBeCalled();

			jest.runAllTimers();
			expect(callback).toBeCalled();

			debounced();
			expect(callback.mock.calls.length).toBe(1);
		});
	});

	describe('DEBOUNCE', () => {
		it('should decorate class method', () => {
			const callback = jest.fn();
			const decorated = new class {
				@DEBOUNCE(100)
				debounced(arg) {
					callback();
				}
			};

			decorated.debounced(2);
			expect(callback).not.toBeCalled();

			jest.runAllTimers();
			expect(callback).toBeCalled();

			decorated.debounced(2);
			expect(callback.mock.calls.length).toBe(1);
		});

		it('should decorate properties', () => {
			const callback = jest.fn();
			const foo = new class {
				@DEBOUNCE(100)
				bar = () => {
					callback();
				}
			};
			foo.bar();
			expect(callback).not.toBeCalled();
			jest.runAllTimers();
			expect(callback).toBeCalled();
			foo.bar();
			expect(callback.mock.calls.length).toBe(1);
		});
	});

	describe('throttle', () => {
		it('should invoke decorated func once during time interval', () => {
			const callback = jest.fn();
			const throttled = throttle(callback, 100);

			throttled();
			expect(callback).toBeCalled();

			throttled();
			expect(callback.mock.calls.length).toBe(1);

			jest.runAllTimers();
			throttled();
			expect(callback.mock.calls.length).toBe(2);
		});

		it('should decorate properties', () => {
			const callback = jest.fn();
			const foo = new class {
				@THROTTLE(100)
				bar = () => {
					callback();
				}
			};

			foo.bar();
			expect(callback).toBeCalled();

			foo.bar();
			expect(callback.mock.calls.length).toBe(1);

			jest.runAllTimers();
			foo.bar();
			expect(callback.mock.calls.length).toBe(2);
		});
	});

	describe('THROTTLE', () => {
		it('should decorate class method', () => {
			const callback = jest.fn();
			const decorated = new class {
				@THROTTLE(100)
				throttled() {
					callback();
				}
			};

			decorated.throttled();
			expect(callback).toBeCalled();

			decorated.throttled();
			expect(callback.mock.calls.length).toBe(1);

			jest.runAllTimers();
			decorated.throttled();
			expect(callback.mock.calls.length).toBe(2);
		});
	});

	describe('memoize', () => {
		it('should memoize passed function for it\'s arguments', () => {
			const callback = jest.fn();
			const fn = memoize(function(a, b) {
				callback();
				return a + b;
			});
			expect(fn(1, 2)).toBe(3);
			expect(fn(1, 2)).toBe(3);
			expect(callback.mock.calls.length).toBe(1);
		});

		it('should throw on invalid arguments', () => {
			const fn = memoize(function() { //eslint-disable-line no-empty-function
			});
			expect(fn.bind(null, [])).toThrow();
			expect(fn.bind(null, {})).toThrow();
		});
	});

	describe('MEMOIZE', () => {
		it('should decorate getter', () => {
			const callback = jest.fn();
			const foo = new class {
				@MEMOIZE
				get bar() {
					callback();
					return 1;
				}
			};
			expect(foo.bar).toBe(1);
			expect(foo.bar).toBe(1);
			expect(callback.mock.calls.length).toBe(1);
		});

		it('should decorate methods', () => {
			const callback = jest.fn();
			const foo = new class {
				@MEMOIZE
				bar(a, b) {
					callback();
					return a + b;
				}
			};
			expect(foo.bar('1', '2')).toBe('12');
			expect(foo.bar('1', '2')).toBe('12');
			expect(callback.mock.calls.length).toBe(1);
		});

		it('should decorate properties', () => {
			const callback = jest.fn();
			const foo = new class {
				@MEMOIZE
				bar = (a, b) => {
					callback();
					return a + b;
				}
			};
			expect(foo.bar('1', '2')).toBe('12');
			expect(foo.bar('1', '2')).toBe('12');
			expect(callback.mock.calls.length).toBe(1);
		});

		it('should support static fields', () => {
			const callback = jest.fn();
			class Foo {
				@MEMOIZE
				static getBar() {
					callback();
					return 1;
				}

				@MEMOIZE
				static get bar() {
					callback();
					return 1;
				}
			}
			expect(Foo.getBar()).toBe(1);
			expect(Foo.getBar()).toBe(1);
			expect(Foo.bar).toBe(1);
			expect(Foo.bar).toBe(1);
			expect(callback.mock.calls.length).toBe(2);
		});
	});

	describe('DISPOSABLE', () => {
		it('should decorate class', () => {
			//
			@DISPOSABLE
			class Foo {
			}
			expect(Foo.prototype._using).toBeDefined();
			expect(Foo.prototype.dispose).toBeDefined();
		});
		it('should implement disposing', () => {
			const callback = jest.fn();
			@DISPOSABLE
			class Foo {
				constructor() {
					this._using([callback]);
				}
			}
			const foo = new Foo();
			foo.dispose();
			expect(callback).toBeCalled();
		});
	});
});
