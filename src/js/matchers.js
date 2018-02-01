'use strict';

const util = require('./util');

function toElement(html) {
	const e = document.createElement('div');
	e.innerHTML = html;
	return e;
}

function toImageMatch(actual, expected, {
	tolerance = 0, // accepts tolerance in pixels
	delta = 0, // the maximum delta between
	blurLevel = 0, // blur test lebel
	textMessage = false
} = {}) {

	const blurActual = util.blur(actual, blurLevel);
	const blurExpected = util.blur(expected, blurLevel);
	const diffPx = new util.Pixels(util.diffImageData(blurActual, blurExpected));
	const {height, width} = diffPx;

	const colorDistanceBox = util.toColorDistanceBox(diffPx);


	const colorDistanceResultPx = new util.Pixels(util.createImageData(width, height));
	let maxColorDistance = 0;
	let unmatchCount = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const colorDistance = colorDistanceBox[y][x];
			maxColorDistance = Math.max(maxColorDistance, colorDistance);
			if (colorDistance > delta) {
				unmatchCount++;
				if (colorDistance < 20) {
					colorDistanceResultPx.put(x, y, [225, 225, 225]);
				} else if (colorDistance < 40) {
					colorDistanceResultPx.put(x, y, [0, 0, 225]);
				} else if (colorDistance < 60) {
					colorDistanceResultPx.put(x, y, [0, 225, 0]);
				} else if (colorDistance < 80) {
					colorDistanceResultPx.put(x, y, [225, 225, 0]);
				} else {
					colorDistanceResultPx.put(x, y, [225, 0, 0]);
				}
			} else {
				colorDistanceResultPx.put(x, y, [0, 0, 0]);
			}
		}
	}
	return {
		pass: unmatchCount <= tolerance,
		message() {
			const msg = `unmatch pixels: ${unmatchCount}, max diffpoint: ${maxColorDistance}, {tolerance: ${tolerance}, delta: ${delta}, blurLevel: ${blurLevel}}`;

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
						<img src="${util.toDataURL(diffPx)}">
					</div>
					<div style="display: inline-block;">
						Color Distance:<br>
						<img src="${util.toDataURL(colorDistanceResultPx)}">
					</div>
					<div>${msg}</div>
				</div>`;
			if (textMessage) {
				return result;
			} else {
				return toElement(result);
			}
		}
	};
}

module.exports = {
	toImageMatch() {
		return {
			compare: toImageMatch
		};
	}
};