/**
 * @typedef {{}} TFSAction
 * @template TFSActionPayload
 * @property {String} type
 * @property {TFSActionPayload} payload
 */

/**
 * @typedef {TFSAction|TThunkAction} TThunkActionResult
 */

/**
 * @typedef {function(action:TThunkActionResult):void} TThunkActionDispatch
 */

/**
 * @typedef {function(dispatch:TThunkActionDispatch):TThunkActionResult} TThunkAction
 */