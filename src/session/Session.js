import {uuid} from '../string/string';
import {DISPOSABLE} from '../function/disposable';
import Emitter from '../emitter/Emitter';


const id = uuid();
const EVENT_KEY = '__SESSION_EVENT__';

/**
 * @enum
 */
export const E_SESSION = {
	REQUEST: 'E_SESSION:REQUEST'
};

/**
 * @typedef {{}} TRequestEvent
 * @property {String} receiver - sid
 * @property {*} request
 */

/**
 * @emits {@link E_SESSION}
 */
@DISPOSABLE
class Session extends Emitter {
	/**
	 * Current session id
	 * @returns {String}
	 */
	get id() {
		return id;
	}

	constructor() {
		super();
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', this._onStorage);
			this._using([
				window.removeEventListener('storage', this._onStorage)
			]);
		}
	}

	/**
	 * Sends message to another session by id
	 * @param {String} sid
	 * @param {*} request
	 */
	send(sid, request) {
		const data = JSON.stringify({
			receiver: sid,
			request
		});
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(EVENT_KEY, data);
		}
	}

	/**
	 * @param {Event} event
	 * @private
	 */
	_onStorage = (event) => {
		if (event.key === EVENT_KEY) {
			try {
				/**
				 * @type {TRequestEvent}
				 */
				const value = JSON.parse(event.newValue);
				if (value.receiver === id) {
					this._emit(E_SESSION.REQUEST, value.request);
				}
			} catch (e) {}
		}
	}
}

export default new Session();