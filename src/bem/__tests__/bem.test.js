jest.autoMockOff();

const {['default']: bem, block, element, modifier, BEM} = require('../bem.js');
const React = require('react');

describe('bem', () => {
	describe('block', () => {
		it('should generate block className', () => {
			expect(block('foo')).toBe('foo');
		});
		it('should create block className with modifiers', () => {
			expect(block('foo', ['m1', {m2: true, m3: false}])).toBe('foo foo-m1 foo-m2');
		});
		it('should ignore null and undefined as modifiers', () => {
			expect(block('foo', null)).toBe('foo');
			expect(block('foo', undefined)).toBe('foo');
		});
		it('should operate complex nested modifiers', () => {
			expect(block.bind(null, 'foo', ['1', {a: '2'}, [3, {b: '4'}]])).not.toThrow();
		});
	});

	describe('element', () => {
		it('should generate element className', () => {
			expect(element('foo', 'bar')).toBe('foo--bar');
		});
		it('should generate element className with modifiers', () => {
			expect(element('foo', 'bar', ['m'])).toBe('foo--bar foo--bar-m');
		});
	});

	describe('modifier', () => {
		it('should generate modifier className', () => {
			expect(modifier('foo', 'm')).toBe('foo-m');
		});
	});

	describe('bem', () => {
		it('should generate block className with 1 argument', () => {
			expect(bem('foo')).toBe('foo');
		});
		it('should generate modified block className with second argument as modifiers', () => {
			expect(bem('foo', ['m', {m2: true}])).toBe('foo foo-m foo-m2');
		});
		it('should generate element className with second element as string', () => {
			expect(bem('foo', 'bar')).toBe('foo--bar');
		});
		it('should generate modified element classname with third argument as modifiers', () => {
			expect(bem('foo', 'bar', ['m', {m2: true}])).toBe('foo--bar foo--bar-m foo--bar-m2');
		});
	});

	/*eslint-disable padded-blocks*/
	describe('BEM decorator', () => {
		@BEM('foo')
		class Foo {

		}
		const foo = new Foo();

		@BEM('foo')
		class FooComponent extends React.Component {

		}
		it('should inject bem() method to target prototype', () => {
			expect(Foo.prototype.bem).toBeDefined();
			expect(foo.bem).toBeDefined();
		});
		it('should inject bem() method bound to passed block name', () => {
			expect(foo.bem()).toBe('foo');
			expect(foo.bem('bar')).toBe('foo--bar');
		});
		it('should extend propTypes and defaultProps with modifiers array', () => {
			expect(FooComponent.propTypes).toBeDefined();
			expect(FooComponent.propTypes.modifiers).toBeDefined();
			expect(FooComponent.defaultProps).toBeDefined();
			expect(FooComponent.defaultProps.modifiers).toEqual([]);
		});
	});
});

/////////////////////////////////////////
//FIXME: place this tests here until upgrade to jest > 0.4
//jest <= 0.4 breaks on multiple file tests on windows
////////////////////////////////////////
const {dasherize, camelize, capitalize, randomId, decapitalize} = require('../../string/string.js');
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