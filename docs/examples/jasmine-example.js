/*eslint-env es6*/
/*eslint prefer-arrow-callback:"off", object-shorthand:"off"*/
'use strict';
window.testCode = function() {

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
		const targetCanvas = init(document.querySelector('#target'));
		const targetCtx = targetCanvas.getContext('2d');
		targetCtx.fillStyle = '#ddd';
		targetCtx.font = '16px sans-serif';
		targetCtx.fillText('test', 30, 30);
		const answerCanvas = init(document.querySelector('#answer'));

		it('expect(targetCanvas).toImageMatch(answerCanvas, {tolerance: 5, delta: \'10%\', blurLevel: 1})', function() {
			expect(targetCanvas).toImageMatch(answerCanvas, {tolerance: 5, delta: '10%', blurLevel: 1});
		});
		it('expect(targetCanvas).toImageMatch(answerCanvas, {delta: \'10%\', blurLevel: 1})', function() {
			expect(targetCanvas).toImageMatch(answerCanvas, {delta: '10%', blurLevel: 1});
		});
		it('expect(targetCanvas).toImageMatch(answerCanvas, {delta: \'11%\', blurLevel: 1})', function() {
			expect(targetCanvas).toImageMatch(answerCanvas, {delta: '11%', blurLevel: 1});
		});
		it('expect(targetCanvas).toImageMatch(answerCanvas, {blurLevel: 1})', function() {
			expect(targetCanvas).toImageMatch(answerCanvas, {blurLevel: 1});
		});
		it('expect(targetCanvas).toImageMatch(answerCanvas, {delta: \'11%\'})', function() {
			expect(targetCanvas).toImageMatch(answerCanvas, {delta: '11%'});
		});
		it('expect(targetCanvas).toImageMatch(answerCanvas)', function() {
			expect(targetCanvas).toImageMatch(answerCanvas);
		});
		it('test Color Distance', function() {

			const act = document.createElement('canvas');
			act.width = 100;
			act.height = 100;
			let ctx = act.getContext('2d');
			let grad = ctx.createLinearGradient(0, 0, 0, 100);
			grad.addColorStop(0, '#000');
			grad.addColorStop(1, '#FFF');
			ctx.fillStyle = grad;
			ctx.beginPath();
			ctx.rect(0, 0, 50, 100);
			ctx.fill();

			grad = ctx.createLinearGradient(0, 0, 0, 100);
			grad.addColorStop(0, '#0FF');
			grad.addColorStop(1, '#FFF');
			ctx.fillStyle = grad;
			ctx.beginPath();
			ctx.rect(50, 0, 50, 100);
			ctx.fill();


			const exp = document.createElement('canvas');
			exp.width = 100;
			exp.height = 100;
			ctx = exp.getContext('2d');
			ctx.fillStyle = '#FFF';
			ctx.beginPath();
			ctx.rect(0, 0, 100, 100);
			ctx.fill();
			expect(act).toImageMatch(exp);
		});

	});

};
window.testCode();