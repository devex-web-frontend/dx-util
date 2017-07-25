export declare type IEmitterEvents<F extends Function = Function> = {
    [key: string]: F[];
};
/**
 * Basic event emitter
 */
export default class Emitter {
    private _events;
    /**
     * Binds handler to specified event
     */
    on<H extends Function>(event: string, handler: H): () => void;
    /**
     * Unbinds handler from specified event. If handler is not specified, all callbacks are unbound.
     */
    off<H extends Function>(event: string, handler: H): void;
    /**
     * Emits event
     */
    protected _emit(event: string, ...args: any[]): void;
}
