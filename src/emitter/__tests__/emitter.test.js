jest.unmock('../Emitter.js');

import Emitter from '../Emitter.js';

describe('Emitter', () => {
	const event = 'fire';
	let callback;
	let emitter;

	beforeEach(() => {
		callback = jest.fn();
		emitter = new Emitter();
	});

	it('should fire event', () => {
		emitter.on(event, callback);
		expect(callback).not.toBeCalled();

		emitter.emit(event);
		expect(callback).toBeCalled();
		expect(callback.mock.calls.length).toBe(1);
	});

	it('should unbind event handler', () => {
		emitter.on(event, callback);
		emitter.emit(event);
		emitter.off(event);
		emitter.emit(event);

		expect(callback.mock.calls.length).toBe(1);
	});
});