interface IEvents {
	[key:string]:Array<Function>;
}

/**
 * Basic event emitter
 */
export default class Emitter {
	private _events:IEvents;

	constructor() {
		this._events = {};
	}

	/**
	 * Binds handler to specified event
	 */
	on(event:any, handler:Function) {
		if (this._events[event]) {
			this._events[event].push(handler);
		} else {
			this._events[event] = [handler];
		}
	}

	/**
	 * Unbinds handler from specified event. If handler is not specified, all callbacks are unbound.
	 */
	off(event:any, handler?:Function) {
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
	 */
	protected _emit(event:any, ...args:Array<any>) {
		let handlers = this._events[event];
		if (handlers) {
			let eventArgs = Array.prototype.slice.call(arguments, 1);
			handlers.forEach((handler:Function) => handler.apply(this, eventArgs));
		}
	}
}
