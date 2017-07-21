/**
 * @template TFSActionPayload
 */
function TFSAction() {
}
/**
 * @type {string|String}
 */
TFSAction.prototype.type = '';
/**
 * @type {TFSActionPayload}
 */
TFSAction.prototype.payload = null;
/**
 * @type {*}
 */
TFSAction.prototype.error = null;
/**
 * @typedef {Object} TFSAction
 */
/**
 * @typedef {TFSAction|TThunkAction} TThunkActionResult
 */
/**
 * @typedef {function(action:TThunkActionResult):void} TThunkActionDispatch
 */
/**
 * @typedef {function(dispatch:TThunkActionDispatch, getState:function():*):TThunkActionResult} TThunkAction
 */ 
