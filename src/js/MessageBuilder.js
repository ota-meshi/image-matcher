'use strict';

const util = require('./util');
function toElement(html) {
	const e = document.createElement('div');
	e.innerHTML = html;
	return e;
}
function escape(s) {
	return s.replace(/'/g, '\\\'').
		replace(/"/g, '\\"');
}

class MessageBuilder {

	constructor(result, actual, expected, opt) {
		this.result = result;
		this.actual = actual;
		this.expected = expected;
		this.opt = opt;
	}
	get pass() {
		return this.result.pass;
	}
	get message() {
		const {
			// pass,
			unmatchCount,
			maxColorDistance,
			// images: {
			// 	diff,
			// 	colorDistance,
			// 	blurActual,
			// 	blurExpected,
			// },
		} = this.result;
		const {
			tolerance,
			delta,
			blurLevel,
			// fitSize,
		} = this.opt;
		return `unmatch pixels: ${unmatchCount}, max color distance: ${maxColorDistance}, {tolerance: ${tolerance}, delta: ${delta}, blurLevel: ${blurLevel}}`;
	}
	get element() {
		const {
			// pass,
			// unmatchCount,
			// maxColorDistance,
			images: {
				diff,
				colorDistance,
				blurActual,
				blurExpected,
			},
		} = this.result;
		const {
			// tolerance,
			// delta,
			blurLevel,
			// fitSize,
		} = this.opt;
		const result = `
<div style="white-space: normal;">
	<div style="display: inline-block;">
		Actual:<br>
		<img src="${util.toDataURL(this.actual)}">
	</div>
	<div style="display: inline-block;">
		Expected:<br>
		<img src="${util.toDataURL(this.expected)}">
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
	<div>${this.message}</div>
</div>`;
		return toElement(result);
		
	}
	log(title) {
		if (typeof title === 'function') {
			try {
				title = title();
			} catch (e) {
				title = 'unknown';
			}
		}
		const {
			// pass,
			// unmatchCount,
			// maxColorDistance,
			images: {
				diff,
				colorDistance,
				blurActual,
				blurExpected,
			},
		} = this.result;
		const {
			// tolerance,
			// delta,
			blurLevel,
			// fitSize,
		} = this.opt;

		util.logImage(
				`title: ${escape(title)}`,
				`/result message: ${escape(this.message)}`,
				'/Actual:', this.actual,
				'/Expected:', this.expected,
				...(blurLevel > 0 ? ['/Actual blur:', blurActual] : []),
				...(blurLevel > 0 ? ['/Expected blur:', blurExpected] : []),
				'/Diff:', diff,
				'/Color Distance:', colorDistance
		);
	}
}

module.exports = MessageBuilder;