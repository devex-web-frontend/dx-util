/**
 * Get bounding client rect of given element
 */
export declare function getBoundingClientRect(element: HTMLElement): ClientRect & {
    middle: number;
    center: number;
};
/**
 * Set all styles from provided object to the element
 */
export declare function style(el: HTMLElement, styles: object): void;
/**
 * Get vendors property
 */
export declare function getVendorProperty(property: string): string[];
/**
 * Assign style property to element with all possible vendor prefixes.
 */
export declare function setVendorStyle(element: HTMLElement, property: string, value: any): void;
