'use strict';

const util = require('./util');
const matchers = require('./matchers');

if (window.jasmine) {
	beforeEach(() => {
		const jm = {};
		for (const k in matchers) {
			const compare = matchers[k];
			jm[k] = () => ({
				compare,
			});
			
		}
		
		jasmine.addMatchers(jm);
	});
}
if (window.mocha && window.expect) {
	expect.Assertion.prototype.imageMatch = function(obj, opt) {
		const {textMessage = true} = opt;
		opt.textMessage = textMessage;
		const res = matchers.toImageMatch(this.obj, obj, opt);
		this.assert(
				res.pass
				, () => res.message()
				, () => res.message()
				, obj);
		return this;

	};
}

module.exports = {
	util,
};