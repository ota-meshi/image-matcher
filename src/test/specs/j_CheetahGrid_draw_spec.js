/*global cheetahGrid*/
/*eslint-env es6*/
/*eslint prefer-arrow-callback:"off", object-shorthand:"off"*/
'use strict';
(function() {
	let mainEl = document.querySelector('#main');
	if (!mainEl) {
		mainEl = document.createElement('div');
		mainEl.id = 'main';
		document.body.appendChild(mainEl);
	}

	const GridCanvasHelper = cheetahGrid.GridCanvasHelper;

	const grid = new cheetahGrid.core.DrawGrid({
		parentElement: (function() {
			const parent = document.createElement('div');
			parent.id = 'parent';
			parent.style.width = '500px';
			parent.style.height = '300px';
			mainEl.appendChild(parent);
			return parent;
		})(),
		defaultRowHeight: 24,
	});
	window.gridElement = grid.getElement();
	window.grid = grid;
	grid.rowCount = 3;
	grid.colCount = 10;
	grid.frozenColCount = 2;
	grid.frozenRowCount = 1;

	const helper = new GridCanvasHelper(grid);
	const theme = {};
	grid.theme = cheetahGrid.themes.choices.BASIC.extends(theme);
	theme.frozenRowsBgColor = '#d3d3d3';
	grid.onDrawCell = function(col, row, context) {
		//cell全体を描画
		helper.fillCellWithState(context);
		helper.borderWithState(context);

		//文字描画
		const ctx = context.getContext();
		ctx.font = '16px sans-serif';
		ctx.fillStyle = '#000';
		helper.text('[' + col + ':' + row + ']', context);
	};
	grid.invalidate();
	function repeat(c, n) {
		let arr = [];
		for (let i = 0; i < n; i++) {
			arr = arr.concat(c);
		}
		return arr;
	}


	describe('DrawGrid draw image', function() {
		function createAnswerCanvas() {
			const rows = repeat([24], 3);
			const cols = repeat([80], 10);

			const canvasHelper = window.createCanvasHelper(grid.canvas.width, grid.canvas.height);
			const ctx = canvasHelper.context;
			const canvas = canvasHelper.canvas;

			const girdHelper = canvasHelper.createGridHelper(cols, rows);

			//塗りつぶし
			canvasHelper.fillRect('#f6f6f6');
			girdHelper.fillRect('white');
			girdHelper.fillRect('#d3d3d3', 0, 0, null, 0);
			girdHelper.fillRect('#F6F6F6', 0, 2, null, 2);

			//罫線
			girdHelper.lineAll(1);
			ctx.strokeStyle = '#5e9ed6';
			girdHelper.lineH(1, 0, 0, 0);
			girdHelper.lineH(2, 0, 0, 0, true);
			girdHelper.lineV(1, 0, 0, 0);
			girdHelper.lineV(2, 0, 0, 0, true);

			//TEXT
			ctx.font = '16px sans-serif';
			ctx.fillStyle = '#000';

			for (let row = 0; row < rows.length; row++) {
				for (let col = 0; col < cols.length; col++) {
					girdHelper.text('[' + col + ':' + row + ']', col, row, {
						offset: 3,
						textBaseline: 'middle'
					});
				}
			}
			return canvas;
		}
		const canvas = createAnswerCanvas();

		it('expect(grid.canvas).toMatchImage(canvas, {delta: \'20%\', blurLevel: 1})', function() {
			expect(grid.canvas).toMatchImage(canvas, {delta: '20%', blurLevel: 1});
		});
		it('expect(grid.canvas).toMatchImage(canvas, {delta: 0, blurLevel: 1})', function() {
			expect(grid.canvas).toMatchImage(canvas, {delta: 0, blurLevel: 1});
		});
		it('expect(grid.canvas).toMatchImage(canvas)', function() {
			expect(grid.canvas).toMatchImage(canvas);
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
			expect(act).toMatchImage(exp);
		});

	});

})();