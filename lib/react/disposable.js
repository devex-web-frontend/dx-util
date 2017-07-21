"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var disposable_1 = require("../function/disposable");
function DISPOSABLE(target) {
    var disposable = disposable_1.DISPOSABLE(target);
    //noinspection JSDuplicatedDeclaration
    var componentWillUnmount = disposable.prototype.componentWillUnmount;
    disposable.prototype.componentWillUnmount = function () {
        if (componentWillUnmount) {
            componentWillUnmount();
        }
        this.dispose();
    };
    return disposable;
}
exports.DISPOSABLE = DISPOSABLE;
