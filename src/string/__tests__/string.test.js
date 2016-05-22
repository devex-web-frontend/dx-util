jest.unmock('../string.js');

import {dasherize, camelize, capitalize, randomId, decapitalize} from '../string';

describe('string', () => {
	describe('dasherize', () => {
		it('should replace camelCase with dashes', () => {
			expect(dasherize('aBcDe')).toBe('a-bc-de');
		});
		it('should replace CamelCase with dashed preserving case', () => {
			expect(dasherize('aBcDe', false)).toBe('a-Bc-De');
		});
	});

	describe('camelize', () => {
		it('should replace _,-,\\s with camelCase', () => {
			expect(camelize('aa_bb-cc dd')).toBe('aaBbCcDd');
		});
		it('should replace _,-,\\s with CamelCase with first letter capitalized', () => {
			expect(camelize('aa_bb-cc dd', false)).toBe('AaBbCcDd');
		});
	});

	describe('randomId', () => {
		it('should generate random id with prefix and postfix', () => {
			expect(randomId()).not.toBe(randomId());
			expect(/^prefix/.test(randomId('prefix'))).toBeTruthy();
			expect(/^prefix.+postfix$/.test(randomId('prefix', 'postfix'))).toBeTruthy();
		});
	});

	describe('capitalize', () => {
		it('should replace first letter with capital', () => {
			expect(capitalize('foo')).toBe('Foo');
		});
	});

	describe('decapitalize', () => {
		it('should replace first letter with noncapital', () => {
			expect(decapitalize('Foo')).toBe('foo');
		});
	});
});