/*global jasmine*/
'use strict';

const matchers = require('../matchers');
const MessageBuilder = require('../MessageBuilder');
const optionParser = require('../optionParser');

function getCurTitle(suites) {
	return reporterCurrentSpec.name;
}

const reporterCurrentSpec = {
	name: 'unknown',
	specStarted(result) {
		this.name = result.fullName;
	}
};

if (typeof jasmine !== 'undefined') {
	jasmine.getEnv().addReporter(reporterCurrentSpec);
}


function toMatchImage(actual, expected, {
	tolerance = 0, // accepts tolerance in pixels
	delta = 0, // the maximum color distance between actual and expected
	blurLevel = 0, // test blur level
	fitSize = true,
	textMessage = false,
	log,
	browser,
	os,
} = {}) {
	const opt = optionParser({
		tolerance,
		delta,
		blurLevel,
		fitSize,
	}, browser, os);
	const result = matchers.toMatchImage(actual, expected, opt);

	const msg = new MessageBuilder(result, actual, expected, opt);


	return {
		pass: msg.pass,
		message() {
			if (log) {
				msg.log(getCurTitle);
			}

			if (textMessage) {
				return msg.message;
			} else {
				return msg.element;
			}
		}
	};
}


module.exports = {
	toMatchImage() {
		return {compare: toMatchImage};
	}
};