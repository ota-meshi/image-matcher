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
	fitSize = true,
	textMessage = false
} = {}) {
	if (typeof delta === 'string' && /^[+-]?\d+\.?\d*%$/.test(delta)) {
		delta = delta.substr(0, delta.length - 1) / 100;
	}
	let blurActual;
	let blurExpected;
	if (fitSize) {
		const aSize = util.getSize(expected);
		const eSize = util.getSize(actual);
		if (eSize.width !== aSize.width || eSize.height !== aSize.height) {
			const width = Math.min(aSize.width, eSize.width);
			const height = Math.min(aSize.height, eSize.height);
			blurActual = util.blur(
					util.fit(actual, width, height),
					blurLevel
			);
			blurExpected = util.blur(
					util.fit(expected, width, height),
					blurLevel
			);
		} else {
			blurActual = util.blur(actual, blurLevel);
			blurExpected = util.blur(expected, blurLevel);
		}
	} else {
		blurActual = util.blur(actual, blurLevel);
		blurExpected = util.blur(expected, blurLevel);
	}
	const diffPx = new util.Pixels(util.diff(blurActual, blurExpected));
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
				if (colorDistance < 0.20) {
					const m = colorDistance / 0.20;
					colorDistanceResultPx.put(x, y, [255 - 255 * m, 255 - 255 * m, 255]);
				} else if (colorDistance < 0.40) {
					const m = (colorDistance - 0.20) / 0.20;
					colorDistanceResultPx.put(x, y, [0, 255 * m, 255 - 255 * m]);
				} else if (colorDistance < 0.60) {
					const m = (colorDistance - 0.40) / 0.20;
					colorDistanceResultPx.put(x, y, [255 * m, 255, 0]);
				} else if (colorDistance < 0.80) {
					const m = (colorDistance - 0.60) / 0.20;
					colorDistanceResultPx.put(x, y, [255, 255 - 255 * m, 0]);
				} else {
					const m = (colorDistance - 0.80) / 0.20;
					colorDistanceResultPx.put(x, y, [255, 0, 255 * m]);
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
		<img src="${util.toDataURL(diffPx)}">
	</div>
	<div style="display: inline-block;">
		Color Distance:<br>
		<img src="${util.toDataURL(colorDistanceResultPx)}">
	</div>
	<div>${msg}</div>
</div>`;
				return toElement(result);
			}
		}
	};
}

module.exports = {
	toImageMatch,
};