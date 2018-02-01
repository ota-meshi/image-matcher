'use strict';

// I referred to https://www.npmjs.com/package/imagediff
const TYPE_CANVAS = /\[object (Canvas|HTMLCanvasElement)\]/i;
const TYPE_CONTEXT = /\[object CanvasRenderingContext2D\]/i;
const TYPE_IMAGE = /\[object (Image|HTMLImageElement)\]/i;
const TYPE_IMAGE_DATA = /\[object ImageData\]/i;

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

function isImage(object) {
	return isType(object, TYPE_IMAGE);
}
function isCanvas(object) {
	return isType(object, TYPE_CANVAS);
}
function isContext(object) {
	return isType(object, TYPE_CONTEXT);
}
function isImageData(object) {
	return !!(object &&
      isType(object, TYPE_IMAGE_DATA) &&
      typeof object.width !== 'undefined' &&
      typeof object.height !== 'undefined' &&
      typeof object.data !== 'undefined');
}
function isType(object, type) {
	return typeof object === 'object' && !!Object.prototype.toString.apply(object).match(type);
}
  
function toImageData(object) {
	if (object instanceof Pixels) { return object.data; }
	if (isImage(object)) { return toImageDataFromImage(object); }
	if (isCanvas(object)) { return toImageDataFromCanvas(object); }
	if (isContext(object)) { return toImageDataFromContext(object); }
	if (isImageData(object)) { return object; }
	return undefined;
}
function toImageDataFromImage(image) {
	const {height, width} = image;
	canvas.width = width;
	canvas.height = height;
	context.clearRect(0, 0, width, height);
	context.drawImage(image, 0, 0);
	return context.getImageData(0, 0, width, height);
}
function toImageDataFromCanvas(canvas) {
	const {height, width} = canvas;
	const context = canvas.getContext('2d');
	return context.getImageData(0, 0, width, height);
}
function toImageDataFromContext(context) {
	return toImageDataFromCanvas(context.canvas);
}
function createImageData(width, height) {
	canvas.width = width;
	canvas.height = height;
	context.clearRect(0, 0, width, height);
	return context.createImageData(width, height);
}

function toCanvas(object) {
	const data = toImageData(object);
	const canvas = document.createElement('canvas');
	canvas.width = data.width;
	canvas.height = data.height;
	const context = canvas.getContext('2d');
	context.putImageData(data, 0, 0);
	return canvas;
}


////


class Pixels {
	constructor(object) {
		const data = toImageData(object);
		this.data = data;
		this.width = data.width;
		this.height = data.height;
		this.buf = data.data;

		this._lineCount = data.width * 4;
	}
	get(x, y) {
		if (x < 0 || this.width <= x) {
			return [0, 0, 0, 0];
		}
		if (y < 0 || this.height <= y) {
			return [0, 0, 0, 0];
		}
		const index = (x * 4) + (y * this._lineCount);
		return [
			this.buf[index], // r
			this.buf[index + 1], // g
			this.buf[index + 2], // b
			this.buf[index + 3], // a
		];
	}
	put(x, y, pixel) {
		if (x < 0 || this.width <= x) {
			return;
		}
		if (y < 0 || this.height <= y) {
			return;
		}
		const index = (x * 4) + (y * this._lineCount);
		this.buf[index] = pixel[0]; // r
		this.buf[index + 1] = pixel[1]; // g
		this.buf[index + 2] = pixel[2]; // b
		this.buf[index + 3] = (typeof pixel[3] === 'undefined') ? 255 : pixel[3]; // a
	}
}

function diffPixel(a, b) {
	const aa = typeof a[3] === 'undefined' ? 255 : a[3];
	const ba = typeof b[3] === 'undefined' ? 255 : b[3];
	return [
		Math.abs(a[0] - b[0]), // r
		Math.abs(a[1] - b[1]), // g
		Math.abs(a[2] - b[2]), // b
		Math.abs(255 - Math.abs(aa - ba)), // a
	];
}

function diffImageData(a, b) {
	const aPx = new Pixels(a);
	const bPx = new Pixels(b);

	const height = Math.max(aPx.height, bPx.height);
	const width = Math.max(aPx.width, bPx.width);
	const cPx = new Pixels(createImageData(width, height));

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			cPx.put(x, y, diffPixel(aPx.get(x, y), bPx.get(x, y)));
		}
	}

	return cPx.data;
}

/**
 * blur image
 * @param  {object} object    image object
 * @param  {number} blurLevel blur level
 * @return {object}           blur image
 */
function blur(object, blurLevel) {
	if (!blurLevel) {
		return object;
	}
	const px = new Pixels(object);
	const {height, width} = px;
	const blur = new Pixels(createImageData(width, height));
	
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {

			let r = 0;
			let g = 0;
			let b = 0;
			let a = 0;
			let count = 0;

			for (let offsetY = -blurLevel; offsetY <= blurLevel; offsetY++) {
				for (let offsetX = -blurLevel; offsetX <= blurLevel; offsetX++) {
					const buf = px.get(x + offsetX, y + offsetY);
					++count;
					r += buf[0];
					g += buf[1];
					b += buf[2];
					a += buf[3];
				}
			}

			blur.put(x, y, [
				Math.floor(r / count),
				Math.floor(g / count),
				Math.floor(b / count),
				Math.floor(a / count),
			]);
		}
	}

	return blur.data;
}

function toColorDistanceBox(object) {
	const px = new Pixels(object);
	const {height, width} = px;
	const result = [];
	for (let y = 0; y < height; y++) {
		result[y] = [];
		for (let x = 0; x < width; x++) {
			const data = px.get(x, y);
			const colorDistance = Math.sqrt(
					Math.pow(data[0], 2) +
								Math.pow(data[1], 2) +
								Math.pow(data[2], 2)// +
								// Math.pow(255 - data[3], 2)
			) * 100 / 441.6729559300637;
			result[y][x] = colorDistance;
		}
	}
	return result;
}

function toDataURL(object) {
	const canvas = toCanvas(object);
	const base64 = canvas.toDataURL('image/png');
	return 'data:image/png;base64,' + base64.replace(/^.*,/, '');
}

module.exports = {
	// utilitys
	createImageData,
	isImage,
	isCanvas,
	isContext,
	isImageData,
	toImageData,
	toCanvas,
	toDataURL,

	// process
	diffImageData,
	blur,
	toColorDistanceBox,


	// classes
	Pixels,
};