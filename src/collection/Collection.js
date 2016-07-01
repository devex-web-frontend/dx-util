import Emitter from '../emitter/Emitter';

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
 * @class Collection
 * @extends Emitter
 * @template TCollectionItem
 */
export default class Collection extends Emitter {
	/**
	 * Length
	 * @returns {Number}
	 */
	get length() {
		return this._items.length;
	}

	/**
	 * Items copy
	 * @returns {Array.<TCollectionItem>}
	 */
	get items() {
		return this._items.slice();
	}

	/**
	 * @param {Array<TCollectionItem>} [items=[]]
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
		 * @type {Array<TCollectionItem>}
		 * @private
		 */
		this._items = items.slice();
	}

	/**
	 * Returns fresh new shiny copy of collection
	 * @param {TCollectionOptions} [options={}]
	 * @returns {Collection<TCollectionItem>}
	 */
	clone(options = {}) {
		return new Collection(this._items.slice(), Object.assign({}, this._options, options));
	}

	/**
	 * Adds item to collection
	 * @param {TCollectionItem} item
	 */
	add(item) {
		this._requireWriteAccess();
		this._items.push(item);
		this._emit(E_COLLECTION.ITEM_ADD, item);
		this._emit(E_COLLECTION.CHANGE);
	}

	/**
	 * Removes item from collection
	 * @param {TCollectionItem} item
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
	 * @returns {TCollectionItem}
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
	 * @returns {Array<TCollectionItem>}
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
	 * Reduces collection with callback and initial value
	 * @param {function(acc:T, element:TCollectionItem, index:number):T} callback
	 * @param {T} initial
	 * @returns {T}
	 * @template {T,TCollectionItem}
	 */
	reduce(callback, initial) {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		return this._items.reduce((acc, element, index) => callback(acc, element, index), initial);
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
	 * @param {TCollectionItem} item
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