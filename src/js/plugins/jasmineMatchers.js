/*global jasmine*/
'use strict';

const matchers = require('../matchers');
const util = require('../util');

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

function toElement(html) {
	const e = document.createElement('div');
	e.innerHTML = html;
	return e;
}

function toMatchImage(actual, expected, {
	tolerance = 0, // accepts tolerance in pixels
	delta = 0, // the maximum color distance between actual and expected
	blurLevel = 0, // blur test level
	fitSize = true,
	textMessage = false,
	log
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


	return {
		pass,
		message() {
			const msg = `unmatch pixels: ${unmatchCount}, max color distance: ${maxColorDistance}, {tolerance: ${tolerance}, delta: ${delta}, blurLevel: ${blurLevel}}`;

			if (log) {
				let title = 'unknown';
				try {
					title = getCurTitle();
				} catch (e) {
					//noop
				}

				util.logImage(
						`${title}\n${msg}\n`,
						'Actual:', actual,
						'/Expected:', expected,
						...(blurLevel > 0 ? ['/Actual blur:', blurActual] : []),
						...(blurLevel > 0 ? ['/Expected blur:', blurExpected] : []),
						'/Diff:', diff,
						'/Color Distance:', colorDistance
				);
			}

			if (textMessage) {
				return msg;
			} else {
				const result = `
<div style="white-space: normal;">
	<div style="display: inline-block;">
		Actual:<br>
		<img src="${util.toDataURL(actual)}">
	</div>
	<div style="display: inline-block;">
		Expected:<br>
		<img src="${util.toDataURL(expected)}">
	</div>
	${blurLevel > 0 ? `<div style="display: inline-block;">Actual blur:<br><img src="${util.toDataURL(blurActual)}"></div>` : ''}
	${blurLevel > 0 ? `<div style="display: inline-block;">Expected blur:<br><img src="${util.toDataURL(blurExpected)}"></div>` : ''}
	<div style="display: inline-block;">
		Diff:<br>
		<img src="${util.toDataURL(diff)}">
	</div>
	<div style="display: inline-block;">
		Color Distance:<br>
		<img src="${util.toDataURL(colorDistance)}">
	</div>
	<div>${msg}</div>
</div>`;
				return toElement(result);
			}
		}
	};
}


module.exports = {
	toMatchImage() {
		return {compare: toMatchImage};
	}
};