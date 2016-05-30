jest.unmock('../Collection.js');

import Collection from '../Collection';

describe('Collection', () => {
	/**
	 * @type {Collection.<number>}
	 */
	let collection;

	beforeEach(() => {
		collection = new Collection([1, 2, 3]);
	});

	it('should create collection with passed elements', () => {
		expect(collection.contains(1)).toBeTruthy();
		expect(collection.contains(2)).toBeTruthy();
		expect(collection.contains(3)).toBeTruthy();
		expect(collection.contains(4)).toBeFalsy();
	});

	it('should add items', () => {
		collection.add(4);
		expect(collection.contains(4)).toBeTruthy();
	});

	it('should remove items', () => {
		collection.remove(1);
		expect(collection.contains(1)).toBeFalsy();
	});

	it('should clear', () => {
		collection.clear();
		expect(collection.contains(1)).toBeFalsy();
		expect(collection.contains(2)).toBeFalsy();
		expect(collection.contains(3)).toBeFalsy();
	});

	it('should find and throw', () => {
		expect(collection.find(item => item === 1)).toBe(1);
		expect(collection.find.bind(null, item => item === 4)).toThrow();
	});

	it('should filter', () => {
		expect(collection.filter(item => item === 1 || item === 2)).toEqual([1, 2]);
	});

	it('should iterate', () => {
		const callback = jest.fn();
		collection.forEach(callback);
		console.log(callback.mock.calls);
		expect(callback.mock.calls.length).toBe(3);
		expect(callback.mock.calls[0][0]).toBe(1);
		expect(callback.mock.calls[1][0]).toBe(2);
		expect(callback.mock.calls[2][0]).toBe(3);
	});

	it('should map', () => {
		expect(collection.map(item => item * item)).toEqual([1, 4, 9]);
	});

	it('should some', () => {
		expect(collection.some(item => item === 1)).toBeTruthy();
		expect(collection.some(item => item === 4)).toBeFalsy();
	});

	it('should every', () => {
		expect(collection.every(item => [1, 2, 3].indexOf(item) !== -1));
		expect(collection.every(item => item === 4)).toBeFalsy();
	});

	it('should clone', () => {
		const clone = collection.clone();
		expect(clone !== collection).toBeTruthy();
	});

	it('should support readonly mode', () => {
		check(new Collection([1], {
			readonly: true
		}));

		check(new Collection([1]).clone({
			readonly: true
		}));

		function check(collection) {
			expect(collection.add.bind(null, 1)).toThrow();
			expect(collection.remove.bind(null, 1)).toThrow();
			expect(collection.clear.bind(null)).toThrow();
		}
	});
});