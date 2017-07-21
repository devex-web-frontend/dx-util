"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var string_1 = require("../string/string");
var disposable_1 = require("../function/disposable");
var Emitter_1 = require("../emitter/Emitter");
var id = string_1.uuid();
var EVENT_KEY = '__SESSION_EVENT__';
/**
 * @enum
 */
exports.E_SESSION = {
    REQUEST: 'E_SESSION:REQUEST'
};
/**
 * @typedef {{}} TRequestData
 * @property {String} receiver_sid
 * @property {*} messageType
 * @property {*} payload
 */
/**
 * @emits {@link E_SESSION}
 */
var Session = (function (_super) {
    tslib_1.__extends(Session, _super);
    function Session() {
        var _this = _super.call(this) || this;
        /**
         * @param {Event} event
         * @private
         */
        _this._onStorage = function (event) {
            if (event.key === EVENT_KEY) {
                /**
                 * @type {TRequestData}
                 */
                var value = void 0;
                try {
                    if (event.newValue) {
                        value = JSON.parse(event.newValue);
                    }
                }
                catch (e) {
                }
                if (value && value.receiver_sid === id) {
                    _this._emit(exports.E_SESSION.REQUEST, value.messageType, value.payload);
                    _this._emit(value.messageType, value.payload);
                }
            }
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', _this._onStorage);
            _this['_using']([
                function () { return window.removeEventListener('storage', _this._onStorage); }
            ]);
        }
        return _this;
    }
    Object.defineProperty(Session.prototype, "id", {
        /**
         * Current session id
         * @returns {String}
         */
        get: function () {
            return id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sends message to another session by id
     * @param {String} sid
     * @param {*} messageType
     * @param {*} payload
     */
    Session.prototype.send = function (sid, messageType, payload) {
        var data = JSON.stringify({
            receiver_sid: sid,
            messageType: messageType,
            payload: payload
        });
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(EVENT_KEY, data);
        }
    };
    Session = tslib_1.__decorate([
        disposable_1.DISPOSABLE,
        tslib_1.__metadata("design:paramtypes", [])
    ], Session);
    return Session;
}(Emitter_1.default));
exports.Session = Session;
exports.default = new Session();
