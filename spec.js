'use strict';

const should = require('should');
const maybePromiseFactory = require('./');

describe('maybePromiseFactory', () => {
	it('returns a function', () => {
		maybePromiseFactory().should.be.a.Function();
	});
	
	it('uses the Promise constructor passed', () => {
		class PromiseImpl extends Promise {}
		const maybePromise = maybePromiseFactory(PromiseImpl);
		maybePromise(42).should.be.instanceof(PromiseImpl);
	});

	it('uses the ES6 Promise implementation by default', () => {
		const maybePromise = maybePromiseFactory();
		maybePromise(42).should.be.instanceof(Promise);
	});
});

describe('maybePromise', () => {
	const maybePromise = maybePromiseFactory();
	
	describe('accepts a non-function parameter and', () => {
		it('returns the passed-in value if it is a promise', () => {
			let promise = new Promise(resolve => resolve(42));
			maybePromise(promise).should.equal(promise);
		});

		it('returns a promise that evaluates to the passed-in value otherwise', () => {
			let value = 42;
			let promise = maybePromise(value);
			promise.should.be.instanceof(Promise);
			return promise.then(result => result.should.equal(value));
		});
	});
	
	describe('invokes a passed-in function and', () => {
		it('returns its result if it is a promise', () => {
			let promise = new Promise(resolve => resolve(42));
			maybePromise(() => promise).should.equal(promise);
		});

		it('returns a promise that evaluates to its result otherwise', () => {
			let value = 42;
			let promise = maybePromise(() => value);
			promise.should.be.instanceof(Promise);
			return promise.then(result => result.should.equal(value));
		});

		it('returns a promise that rejects if the function throws an exception', () => {
			let ex = new Error();
			let promise = maybePromise(() => { throw ex; });
			promise.should.be.instanceof(Promise);
			return promise.catch(error => error.should.equal(ex));
		});
	});
});
