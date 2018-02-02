'use strict';

const util = require('./util');
const matchers = require('./matchers');
const jasmineMatchers = require('./plugins/jasmineMatchers');
const chaiPlugin = require('./plugins/chaiPlugin');


if (typeof window !== 'undefined') {
	if (window.jasmine) {
		beforeEach(() => {
			jasmine.addMatchers(jasmineMatchers);
		});
	}
	if (window.mocha) {
		if (window.chai) {
			window.chai.use(chaiPlugin);
		}
	}
}

module.exports = {
	util,
	matchers,
	plugins: {
		jasmineMatchers,
		chaiPlugin,
	}
};