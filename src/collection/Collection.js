import Emitter from '../emitter/Emitter.ts';

/**
 * @typedef {Function} TCollectionIterationCallback
 * @callback TCollectionIterationCallback
 * @param {*} element
 * @param {Number} [index]
 * @returns {*|void}
 */

/**
 * @type {string}
 */
export const ERROR_NOT_FOUND = 'Item not found';

/**
 * @type {String}
 */
export const ERROR_READONLY = 'Collection is readonly';

/**
 * @enum {String}
 */
export const E_COLLECTION = {
	ITEM_ADD: 'COLLECTION:ITEM_ADD',
	ITEM_REMOVE: 'COLLECTION:ITEM_REMOVE',
	CLEAR: 'COLLECTION:CLEAR',
	CHANGE: 'COLLECTION:CHANGE'
};

/**
 * @typedef {Object} TCollectionOptions
 * @property {boolean} [readonly=false]
 */

/**
 * Basic observable collection
 * @template T
 */
export default class Collection extends Emitter {
	//noinspection JSDuplicatedDeclaration
	/**
	 * @param {Array<T>} [items=[]]
	 * @param {TCollectionOptions} [options={}]
	 */
	constructor(items = [], options = {}) {
		super();

		/**
		 * @type {TCollectionOptions}
		 * @private
		 */
		this._options = Object.assign({}, options);

		/**
		 * @type {Array<T>}
		 * @private
		 */
		this._items = items.slice();
	}

	/**
	 * Returns fresh new shiny copy of collection
	 * @param {TCollectionOptions} [options={}]
	 * @returns {Collection<T>}
	 */
	clone(options = {}) {
		return new Collection(this._items.slice(), Object.assign({}, this._options, options));
	}

	/**
	 * Adds item to collection
	 * @param {T} item
	 */
	add(item) {
		this._requireWriteAccess();
		this._items.push(item);
		this._emit(E_COLLECTION.ITEM_ADD, item);
		this._emit(E_COLLECTION.CHANGE);
	}

	/**
	 * Removes item from collection
	 * @param {T} item
	 */
	remove(item) {
		this._requireWriteAccess();
		const index = this._items.indexOf(item);
		if (index !== -1) {
			this._items.splice(index, 1);
			this._emit(E_COLLECTION.ITEM_REMOVE, item);
			this._emit(E_COLLECTION.CHANGE);
		}
	}

	/**
	 * Clears collection
	 */
	clear() {
		this._requireWriteAccess();
		this._items.length = 0;
		this._emit(E_COLLECTION.CHANGE);
		this._emit(E_COLLECTION.CLEAR);
	}

	/**
	 * Tries to find element by callback and throw if not found
	 * @param {TCollectionIterationCallback} callback
	 * @returns {T}
	 * @throws
	 */
	find(callback) {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		const item = this._items.find((element, index) => callback(element, index));
		if (typeof item !== 'undefined') {
			return item;
		} else {
			throw new Error(ERROR_NOT_FOUND);
		}
	}

	/**
	 * Filters collection by callback
	 * @param {TCollectionIterationCallback} callback
	 * @returns {Array<T>}
	 */
	filter(callback) {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		return this._items.filter((element, index) => callback(element, index));
	}

	/**
	 * Iterates over collection
	 * @param {TCollectionIterationCallback} callback
	 */
	forEach(callback) {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		this._items.forEach((element, index) => callback(element, index));
	}

	/**
	 * Maps collection with callback
	 * @param {TCollectionIterationCallback} callback
	 * @returns {Array<*>}
	 */
	map(callback) {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		return this._items.map((element, index) => callback(element, index));
	}

	/**
	 * Checks if any element satisfies callback
	 * @param {TCollectionIterationCallback} callback
	 * @returns {boolean}
	 */
	some(callback) {
		return this._items.some((element, index) => callback(element, index));
	}

	/**
	 * Checks if every element satisfies callback
	 * @param {TCollectionIterationCallback} callback
	 * @returns {boolean}
	 */
	every(callback) {
		return this._items.every((element, index) => callback(element, index));
	}

	/**
	 * Checks if collection contains item
	 * @param {T} item
	 * @returns {boolean}
	 */
	contains(item) {
		return this._items.indexOf(item) !== -1;
	}

	/**
	 * Checks if collection is not readonly and throws if it is
	 * @private
	 * @throws
	 */
	_requireWriteAccess() {
		if (this._options.readonly) {
			throw new Error(ERROR_READONLY);
		}
	}
}