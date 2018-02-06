/*global mocha*/
'use strict';

const matchers = require('../matchers');
const MessageBuilder = require('../MessageBuilder');
const optionParser = require('../optionParser');


function getCurTitle(suites) {
	for (let i = suites.length - 1; i >= 0; i--) {
		const suite = suites[i];
		if (suite.suites.length > 0) {
			const r = getCurTitle(suite.suites);
			if (r) {
				return r;
			}
		}
		if (suite.ctx.test) {
			return suite.ctx.test.title;
		}
	}
	return null;
}

function toMatchImage(actual, expected, {
	tolerance = 0, // accepts tolerance in pixels
	delta = 0, // the maximum color distance between actual and expected
	blurLevel = 0, // test blur level
	fitSize = true,
	log,
} = {}) {
	const result = matchers.toMatchImage(actual, expected, {
		tolerance,
		delta,
		blurLevel,
		fitSize,
	});

	const msg = new MessageBuilder(result, actual, expected, {
		tolerance,
		delta,
		blurLevel,
		fitSize,
	});

	return {
		pass: msg.pass,
		message() {
			if (log) {
				msg.log(() => getCurTitle(mocha.suite.suites));
			}
			return msg.message;
		},
	};
}


module.exports = function(chai, utils) {
	const flag = utils.flag;
	chai.Assertion.addMethod('matchImage', function(expected, {
		tolerance = flag(this, 'tolerance'),
		delta = flag(this, 'delta'),
		blurLevel = flag(this, 'blurLevel'),
		fitSize = flag(this, 'fitSize'),
		log,
		browser,
		os,
	}) {
		const actual = flag(this, 'object');
		const opt = optionParser({
			tolerance,
			delta,
			blurLevel,
			fitSize,
		}, browser, os);
		opt.log = log;

		const {pass, message} = toMatchImage(actual, expected, opt);
		this.assert(
				pass
				, message
				, message
		);
	});

	chai.Assertion.addChainableMethod('tolerance', function(val) {
		flag(this, 'tolerance', val);
	});
	chai.Assertion.addChainableMethod('delta', function(val) {
		flag(this, 'delta', val);
	});
	chai.Assertion.addChainableMethod('blurLevel', function(val) {
		flag(this, 'blurLevel', val);
	});
	chai.Assertion.addProperty('fitTheSize', function() {
		flag(this, 'fitSize', true);
	});


};