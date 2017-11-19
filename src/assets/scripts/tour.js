$(function() {
	var canvas = $('#bg_home');
	var app = new PIXI.Application(canvas.width(), canvas.height(), {backgroundColor : 0xf5f1ec});
  canvas.append(app.view);


	// PIXI.loader
	//   .add('assets/images/sprite/01m.json')
	//   .load(onAssetsLoaded);



	function onAssetsLoaded(){
		var frames = [];


		//init

		app.ticker.add(function() {
			// detect over world
			}
		});
	}


});