/**
 * @typedef {string|number} TEmitterEvent
 */

/**
 * @typedef {Object.<TEmitterEvent, Array.<Function>>} IEmitterEvents
 */

/**
 * Basic event emitter
 */
export default class Emitter {
	/**
	 * @type {IEmitterEvents}
	 * @private
	 */
	_events = {};

	/**
	 * Binds handler to specified event
	 * @param {TEmitterEvent} event
	 * @param {Function} handler
	 */
	on(event, handler) {
		if (this._events[event]) {
			this._events[event].push(handler);
		} else {
			this._events[event] = [handler];
		}
	}

	/**
	 * Unbinds handler from specified event. If handler is not specified, all callbacks are unbound.
	 * @param {TEmitterEvent} event
	 * @param {Function} handler
	 */
	off(event, handler) {
		if (handler) {
			const handlers = this._events[event];
			if (handlers) {
				const index = handlers.indexOf(handler);
				if (index !== -1) {
					if (handlers.length === 1) {
						delete this._events[event];
					} else {
						handlers.splice(index, 1);
					}
				}
			}
		} else {
			delete this._events[event];
		}
	}

	/**
	 * Emits event
	 * @protected
	 * @param {TEmitterEvent} event
	 * @param {...any} args
	 */
	emit(event, ...args) {
		if (this._events[event]) {
			this._events[event].forEach(handler => handler.apply(this, Array.prototype.slice.call(arguments, 1)));
		}
	}
}