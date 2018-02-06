/*eslint-env es6*/
/*eslint prefer-arrow-callback:"off", object-shorthand:"off"*/
'use strict';
window.testCode = function() {
	function find(selector, html) {
		const r = document.querySelector(selector);
		if (!r) {
			const doc = document.createElement('div');
			doc.innerHTML = html;
			const children = doc.children;
			if (children[0]) {
				const c = children[0];
				document.body.appendChild(c);
				return c;
			}
		}
		return r;
	}

	describe('image-matcher jasmine example', function() {
		function init(canvas) {
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

			ctx.fillStyle = '#ffd';
			ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);

			ctx.fillStyle = '#fdf';
			ctx.fillRect(0, canvas.height / 2, canvas.width / 2, canvas.height / 2);

			ctx.fillStyle = '#dff';
			ctx.fillRect(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
			return canvas;
		}
		const targetCanvas = init(find('#target', '<canvas width="100" height="100"></canvas>'));
		const targetCtx = targetCanvas.getContext('2d');
		targetCtx.fillStyle = '#fefefe';
		targetCtx.font = '16px sans-serif';
		targetCtx.fillText('test', 30, 30);
		const answerCanvas = init(find('#answer', '<canvas width="100" height="100"></canvas>'));

		it('tolerance, delta', function() {
			expect(targetCanvas).toMatchImage(answerCanvas, {tolerance: 8, delta: '5%', blurLevel: 1, log: true});
		});
		it('tolerance', function() {
			expect(targetCanvas).toMatchImage(answerCanvas, {tolerance: 350, blurLevel: 1, log: true});
		});
		it('delta', function() {
			expect(targetCanvas).toMatchImage(answerCanvas, {delta: '6%', blurLevel: 1, log: true});
		});
		it('not match', function() {
			expect(targetCanvas).not.toMatchImage(answerCanvas, {log: true});
		});
		it('not match delta', function() {
			expect(targetCanvas).not.toMatchImage(answerCanvas, {delta: '3%', blurLevel: 1, log: true});
		});

	});

};
window.testCode();