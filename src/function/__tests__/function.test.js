jest.unmock('../debounce.js');
jest.unmock('../throttle.js');

import debounce, {DEBOUNCE} from '../debounce';
import throttle, {THROTTLE} from '../throttle';

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
});
