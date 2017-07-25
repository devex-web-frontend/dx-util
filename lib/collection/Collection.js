"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Emitter_1 = require("../emitter/Emitter");
exports.ERROR_NOT_FOUND = 'Item not found';
exports.ERROR_READONLY = 'Collection is readonly';
exports.E_COLLECTION = {
    ITEM_ADD: 'COLLECTION:ITEM_ADD',
    ITEM_REMOVE: 'COLLECTION:ITEM_REMOVE',
    CLEAR: 'COLLECTION:CLEAR',
    CHANGE: 'COLLECTION:CHANGE'
};
/**
 * Basic observable collection
 */
var Collection = (function (_super) {
    tslib_1.__extends(Collection, _super);
    function Collection(items, options) {
        if (items === void 0) { items = []; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this._options = tslib_1.__assign({}, options);
        _this._items = items.slice();
        return _this;
    }
    Object.defineProperty(Collection.prototype, "length", {
        /**
         * Length
         */
        get: function () {
            return this._items.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "items", {
        /**
         * Items copy
         */
        get: function () {
            return this._items.slice();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns fresh new shiny copy of collection
     */
    Collection.prototype.clone = function (options) {
        if (options === void 0) { options = {}; }
        return new Collection(this._items.slice(), Object.assign({}, this._options, options));
    };
    /**
     * Adds item to collection
     */
    Collection.prototype.add = function (item) {
        this._requireWriteAccess();
        this._items.push(item);
        this._emit(exports.E_COLLECTION.ITEM_ADD, item);
        this._emit(exports.E_COLLECTION.CHANGE);
    };
    /**
     * Removes item from collection
     */
    Collection.prototype.remove = function (item) {
        this._requireWriteAccess();
        var index = this._items.indexOf(item);
        if (index !== -1) {
            this._items.splice(index, 1);
            this._emit(exports.E_COLLECTION.ITEM_REMOVE, item);
            this._emit(exports.E_COLLECTION.CHANGE);
        }
    };
    /**
     * Clears collection
     */
    Collection.prototype.clear = function () {
        this._requireWriteAccess();
        this._items.length = 0;
        this._emit(exports.E_COLLECTION.CHANGE);
        this._emit(exports.E_COLLECTION.CLEAR);
    };
    /**
     * Tries to find element by callback and throw if not found
     * @throws
     */
    Collection.prototype.find = function (callback) {
        //do not pass callback directly to not give access to items arrays as 3rd argument
        var item = this._items.find(function (element, index) { return callback(element, index); });
        if (typeof item !== 'undefined') {
            return item;
        }
        else {
            throw new Error(exports.ERROR_NOT_FOUND);
        }
    };
    /**
     * Filters collection by callback
     */
    Collection.prototype.filter = function (callback) {
        //do not pass callback directly to not give access to items arrays as 3rd argument
        return this._items.filter(function (element, index) { return callback(element, index); });
    };
    /**
     * Iterates over collection
     */
    Collection.prototype.forEach = function (callback) {
        //do not pass callback directly to not give access to items arrays as 3rd argument
        this._items.forEach(function (element, index) { return callback(element, index); });
    };
    /**
     * Maps collection with callback
     */
    Collection.prototype.map = function (callback) {
        //do not pass callback directly to not give access to items arrays as 3rd argument
        return this._items.map(function (element, index) { return callback(element, index); });
    };
    /**
     * Reduces collection with callback and initial value
     */
    Collection.prototype.reduce = function (callback, initial) {
        //do not pass callback directly to not give access to items arrays as 3rd argument
        return this._items.reduce(function (acc, element, index) { return callback(acc, element, index); }, initial);
    };
    /**
     * Checks if any element satisfies callback
     */
    Collection.prototype.some = function (callback) {
        return this._items.some(function (element, index) { return callback(element, index); });
    };
    /**
     * Checks if every element satisfies callback
     */
    Collection.prototype.every = function (callback) {
        return this._items.every(function (element, index) { return callback(element, index); });
    };
    /**
     * Checks if collection contains item
     */
    Collection.prototype.contains = function (item) {
        return this._items.indexOf(item) !== -1;
    };
    /**
     * Checks if collection is not readonly and throws if it is
     * @throws
     */
    Collection.prototype._requireWriteAccess = function () {
        if (this._options.readonly) {
            throw new Error(exports.ERROR_READONLY);
        }
    };
    return Collection;
}(Emitter_1.default));
exports.Collection = Collection;
exports.default = Collection;
