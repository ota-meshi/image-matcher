/*global mocha*/
'use strict';

const matchers = require('../matchers');
const util = require('../util');


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
	blurLevel = 0, // blur test level
	fitSize = true,
	log,
} = {}) {
	const {
		pass,
		unmatchCount,
		maxColorDistance,
		images: {
			diff,
			colorDistance,
			blurActual,
			blurExpected,
		},
	} = matchers.toMatchImage(actual, expected, {
		tolerance,
		delta,
		blurLevel,
		fitSize,
	});

	if (!pass && log) {

		let title = 'unknown';
		try {
			title = getCurTitle(mocha.suite.suites);
		} catch (e) {
		//noop
		}

		util.logImage(
				`${title}\n`,
				'Actual:', actual,
				'/Expected:', expected,
				...(blurLevel > 0 ? ['/Actual blur:', blurActual] : []),
				...(blurLevel > 0 ? ['/Expected blur:', blurExpected] : []),
				'/Diff:', diff,
				'/Color Distance:', colorDistance
		);
	}

	return {
		pass,
		message: `unmatch pixels: ${unmatchCount}, max color distance: ${maxColorDistance}, {tolerance: ${tolerance}, delta: ${delta}, blurLevel: ${blurLevel}}`,
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
	}) {
		const actual = flag(this, 'object');

		const {pass, message} = toMatchImage(actual, expected, {
			tolerance,
			delta,
			blurLevel,
			fitSize,
			log
		});
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