'use strict';

const util = require('./util');
const matchers = require('./matchers');

if (window.jasmine) {
	beforeEach(() => {
		jasmine.addMatchers(matchers);
	});
}

module.exports = {
	util,
};