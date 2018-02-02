'use strict';

const matchers = require('../matchers');


function toMatchImage(actual, expected, {
	tolerance = 0, // accepts tolerance in pixels
	delta = 0, // the maximum color distance between actual and expected
	blurLevel = 0, // blur test level
	fitSize = true
} = {}) {
	const {
		pass,
		unmatchCount,
		maxColorDistance,
	} = matchers.toMatchImage(actual, expected, {
		tolerance,
		delta,
		blurLevel,
		fitSize,
	});

	return {
		pass,
		message: `unmatch pixels: ${unmatchCount}, max diffpoint: ${maxColorDistance}, {tolerance: ${tolerance}, delta: ${delta}, blurLevel: ${blurLevel}}`,
	};
}


module.exports = function(chai, utils) {
	const flag = utils.flag;
	chai.Assertion.addMethod('matchImage', function(expected, {
		tolerance = flag(this, 'tolerance'),
		delta = flag(this, 'delta'),
		blurLevel = flag(this, 'blurLevel'),
		fitSize = flag(this, 'fitSize')
	}) {
		const actual = flag(this, 'object');

		const {pass, message} = toMatchImage(actual, expected, {
			tolerance,
			delta,
			blurLevel,
			fitSize
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