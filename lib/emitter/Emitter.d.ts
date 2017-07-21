export declare type IEmitterEvents = {
    [key: string]: Function[];
};
/**
 * Basic event emitter
 */
export default class Emitter {
    private _events;
    /**
     * Binds handler to specified event
     */
    on(event: string, handler: Function): () => void;
    /**
     * Unbinds handler from specified event. If handler is not specified, all callbacks are unbound.
     */
    off(event: string, handler: Function): void;
    /**
     * Emits event
     */
    protected _emit(event: string, ...args: any[]): void;
}
