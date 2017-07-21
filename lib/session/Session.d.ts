import Emitter from '../emitter/Emitter';
/**
 * @enum
 */
export declare const E_SESSION: {
    REQUEST: string;
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
export declare class Session extends Emitter {
    /**
     * Current session id
     * @returns {String}
     */
    readonly id: string;
    constructor();
    /**
     * Sends message to another session by id
     * @param {String} sid
     * @param {*} messageType
     * @param {*} payload
     */
    send(sid: string, messageType: any, payload: any): void;
    /**
     * @param {Event} event
     * @private
     */
    _onStorage: (event: StorageEvent) => void;
}
declare const _default: Session;
export default _default;
