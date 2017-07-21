"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Basic event emitter
 */
var Emitter = (function () {
    function Emitter() {
        this._events = {};
    }
    /**
     * Binds handler to specified event
     */
    Emitter.prototype.on = function (event, handler) {
        if (this._events[event]) {
            this._events[event].push(handler);
        }
        else {
            this._events[event] = [handler];
        }
        return this.off.bind(this, event, handler);
    };
    /**
     * Unbinds handler from specified event. If handler is not specified, all callbacks are unbound.
     */
    Emitter.prototype.off = function (event, handler) {
        if (handler) {
            var handlers = this._events[event];
            if (handlers) {
                var index = handlers.indexOf(handler);
                if (index !== -1) {
                    if (handlers.length === 1) {
                        delete this._events[event];
                    }
                    else {
                        handlers.splice(index, 1);
                    }
                }
            }
        }
        else {
            delete this._events[event];
        }
    };
    /**
     * Emits event
     */
    Emitter.prototype._emit = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this._events[event]) {
            this._events[event].forEach(function (handler) { return handler.apply(_this, args); });
        }
    };
    return Emitter;
}());
exports.default = Emitter;
