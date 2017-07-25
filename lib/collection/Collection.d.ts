import Emitter from '../emitter/Emitter';
export declare const ERROR_NOT_FOUND = "Item not found";
export declare const ERROR_READONLY = "Collection is readonly";
export declare const E_COLLECTION: {
    ITEM_ADD: string;
    ITEM_REMOVE: string;
    CLEAR: string;
    CHANGE: string;
};
export declare type TCollectionOptions = {
    readonly?: boolean;
};
/**
 * Basic observable collection
 */
export declare class Collection<T> extends Emitter {
    private _items;
    private _options;
    /**
     * Length
     */
    readonly length: number;
    /**
     * Items copy
     */
    readonly items: T[];
    constructor(items?: T[], options?: TCollectionOptions);
    /**
     * Returns fresh new shiny copy of collection
     */
    clone(options?: TCollectionOptions): Collection<T>;
    /**
     * Adds item to collection
     */
    add(item: T): void;
    /**
     * Removes item from collection
     */
    remove(item: T): void;
    /**
     * Clears collection
     */
    clear(): void;
    /**
     * Tries to find element by callback and throw if not found
     * @throws
     */
    find(callback: (element: T, index: number) => boolean): T;
    /**
     * Filters collection by callback
     */
    filter(callback: (element: T, index: number) => boolean): T[];
    /**
     * Iterates over collection
     */
    forEach(callback: (element: T, index: number) => void): void;
    /**
     * Maps collection with callback
     */
    map<U>(callback: (element: T, index: number) => U): U[];
    /**
     * Reduces collection with callback and initial value
     */
    reduce<U>(callback: (acc: U, element: T, index: number) => U, initial: U): U;
    /**
     * Checks if any element satisfies callback
     */
    some(callback: (element: T, index: number) => boolean): boolean;
    /**
     * Checks if every element satisfies callback
     */
    every(callback: (element: T, index: number) => boolean): boolean;
    /**
     * Checks if collection contains item
     */
    contains(item: T): boolean;
    /**
     * Checks if collection is not readonly and throws if it is
     * @throws
     */
    private _requireWriteAccess();
}
export default Collection;
