var mv = function() {
	// params.img (Array)
	// params.music (Text)
	// params.onComplete (Function)
	var self = this;

	var ww = window.width;

	var v = document.getElementById("myVideo"); 
	var a = document.querySelector(".video__audioElement");
	// var globalParams = params;

	function FireWorkEffect() {
		var self = this;

		self.isShooting = false;
		self.loadComplete = false;
		var c = document.createElement("canvas");
		var ctx = c.getContext("2d");
		var pointData = [];
		var completeFn;

		var textImg = new Image();
		textImg.onload = function() {
			c.width = textImg.width;
			c.height = textImg.height;
			ctx.drawImage(textImg, 0, 0, textImg.width, textImg.height);

			var imgData = ctx.getImageData(0, 0, c.width, c.height);

			for( var i=0; i<imgData.data.length; i+=4 ) {
				var r = imgData.data[i];
				var g = imgData.data[i+1];
				var b = imgData.data[i+2];
				var a = imgData.data[i+3];

				var x = ((i/4)%c.width);
				var y = Math.floor( (i/4) / c.width );
				

				if( a !== 0 ) {
					pointData.push({x:x, y:y});
				}

			}

			// var c2 = document.createElement("canvas");
			// var ctx2 = c2.getContext("2d");
			// c2.width = c.width;
			// c2.height = c.height;
			// for( var i=0; i<dd.length; i++ ) {
			// 	ctx2.fillRect(dd[i].x, dd[i].y, 1, 1);
			// }
			// document.querySelector("body").append(c2);

			pixiInit();

		}
		

		function pixiInit() {
			var w = 850;
			var h = 400;
			var app = new PIXI.Application(w, h, {forceCanvas: false, view: document.getElementById('firework'), transparent:true});

			var texture = PIXI.Texture.fromImage('/tc/assets/images/test/particle2.png');

			var container = new PIXI.particles.ParticleContainer(10000, {
			    scale: false,
			    position: true,
			    rotation: false,
			    uvs: false,
			    alpha: true
			});

			// var container = new PIXI.Container();

			app.stage.addChild(container);

			container.x = w/2 - c.width/2;
			container.y = 30;
			var timer;

			var pixels = [];

			var pixelColors = [0xff0000];

			var usedPoint = [];
			for( var i=0; i<4000; i++ ) {
				// var rnd;
				// do {
				// 	rnd = Math.floor(Math.random()*pointData.length);
				// } while( usedPoint.indexOf(rnd) !== -1 )
				var rnd = Math.floor(Math.random()*pointData.length);

			    var pixel = new PIXI.Sprite(texture);
			    pixel.data = {x:pointData[rnd].x, y:pointData[rnd].y, scale:1};

			    pixel.anchor.set(0.5);
			    pixel.x = pixel.data.x;
			    pixel.y = pixel.data.y;
			    pixel.alpha = 0;
			    pixel.scale.x = pixel.scale.y = pixel.data.scale;
			    // pixel.blendMode = blend;
			    // pixel.blendMode = PIXI.BLEND_MODES.ADD;
			    // pixel.tint = Math.random() * 0xffffff;
			    pixel.tint = 0xfffd4b;
			    container.addChild(pixel);
			    
			    // container.scale.x = container.scale.y = 0.6;
			    // var du = Math.random()*1+1;

			    // var tl = new TimelineMax({repeat:-1});
			    // tl.to(pixel, du, {alpha:0});
			    // tl.to(pixel, du, {alpha:1});

			    // TweenMax.to(pixel, 1, {y:pointData[rnd].y-20, alpha:1, ease:Power2.easeOut});
			    // TweenMax.to(pixel, 2, {y:pointData[rnd].y+40, ease:Power2.easeIn, delay:1});

			    // tl.add( TweenMax.to(pixel, du, {alpha:1}) );
			    
			    // pixel.tint = 0x66CCFF;
			    pixels.push(pixel);

				// var x = pointData[rnd].x;
			}

			function shotComplete() {
				self.isShooting = false;
			}

			self.shot = function() {
				clearTimeout(timer);
				self.isShooting = true;
				for( var i=0; i<pixels.length; i++ ) {
					// TweenMax.to(pixels[i], Math.random()*2+2, {y:"+=100", alpha:0});
					// var rnd1 = 0;
					var rndDelay = Math.random()*0.3;
					TweenMax.killTweensOf(pixels[i]);

				    pixels[i].x = pixels[i].data.x; 
				    pixels[i].y = pixels[i].data.y+10;
				    pixels[i].scale.x = pixels[i].scale.y = pixels[i].data.scale;
				    pixels[i].alpha = 0;

				    TweenMax.to(pixels[i], 1.5, {x:pixels[i].data.x, y:pixels[i].data.y, alpha:1, ease:Power2.easeOut});
				    
				    TweenMax.to(pixels[i], 3+Math.random()*1, {x:pixels[i].data.x, y:pixels[i].data.y+100, ease:Power2.easeIn, delay:2});
				    TweenMax.to(pixels[i], 1+Math.random()*2, {alpha:0, ease:Power2.easeIn, delay:2.5});
					// TweenMax.to(pixels[i].scale, 3+Math.random()*2, {x: 0.5, y: 0.5, ease:Linear.easeNone, delay:2});
				}

				timer = setTimeout(function() {
					self.isShooting = false;
				}, 7000)

			}

			self.show = function() {
				document.getElementById('firework').style.display = "block";
			}

			self.hide = function() {
				document.getElementById('firework').style.display = "none";
			}

			self.loadComplete = true;
			completeFn();
			// app.stage.addChild(graphics);
		}

		self.loadAssets = function(src, complete) {
			completeFn = complete;
			if( textImg.src !== "" ) textImg.src = "";
			textImg.src = src;
		}
		
	}

	


	function VideoNameTransform() {
		var self = this;

		self.nowImgID = 0;
		var controlPoints = [
		    { x: 0, y: 0 },
		    { x: 1, y: 0 },
		    { x: 0, y: 1 },
		    { x: 1, y: 1 }
		];

		var srcPoints;

		var qualityOptions = { 
			anisotropicFiltering: true,
			mipMapping: true,
			linearFiltering: true
		};

		var screenCanvasElement = document.getElementById('screen');
		var glOpts = { antialias: false, depth: false, preserveDrawingBuffer: false };
		var gl =
		    screenCanvasElement.getContext('webgl', glOpts) ||
		    screenCanvasElement.getContext('experimental-webgl', glOpts);
		if(!gl) {
		    addError("Your browser doesn't seem to support WebGL.");
		}


		var anisoExt =
		    gl.getExtension('EXT_texture_filter_anisotropic') ||
		    gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
		    gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');


		if(!anisoExt) {
		    anisotropicFilteringElement.checked = false;
		    anisotropicFilteringElement.disabled = true;
		    addError("Your browser doesn't support anisotropic filtering. "+
		             "Ordinary MIP mapping will be used.");
		}

		var glResources = setupGlContext();
		var screenTextureSize;	
		var loadChecker = 0;
		var imgArray = [];
		var maskArray = [];
		var completeFn;

		self.loadAssets = function(img, complete) {
			completeFn = complete;
			loadChecker = 0;
			imgArray = [];
			for( var i=0; i<img.length; i++ ) {
				var text = new Image();
				imgArray.push(text);
				text.onload = imgLoaded;
				text.src = img[i];
			}

			for( var i=0; i<3; i++ ) {
				var mask = new Image();
				maskArray.push(mask);
				mask.onload = imgLoaded;
				mask.src = "/tc/assets/images/test/mask"+(i+1)+"-mobile.png";
			}



		}


		// var dot = new Image();
		// dot.src = "/tc/assets/images/test/dot3.png";

		function imgLoaded() {
			loadChecker++;
			if( loadChecker == imgArray.length+maskArray.length ) {
				screenImgElement = imgArray[self.nowImgID];
				loadScreenTexture();
				completeFn();
			}
		}

		var screenImgElement = new Image();
		screenImgElement.crossOrigin = '';

		function setupGlContext() {
		    // Store return values here
		    var rv = {};
		    
		    // Vertex shader:
		    var vertShaderSource = [
		        'attribute vec2 aVertCoord;',
		        'uniform mat4 uTransformMatrix;',
		        'varying vec2 vTextureCoord;',
		        'void main(void) {',
		        '    vTextureCoord = aVertCoord;',
		        '    gl_Position = uTransformMatrix * vec4(aVertCoord, 0.0, 1.0);',
		        '}'
		    ].join('\n');

		    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		    gl.shaderSource(vertexShader, vertShaderSource);
		    gl.compileShader(vertexShader);

		    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		        addError('Failed to compile vertex shader:' +
		              gl.getShaderInfoLog(vertexShader));
		    }
		       
		    // Fragment shader:
		    var fragShaderSource = [
		        'precision mediump float;',
		        'varying vec2 vTextureCoord;',
		        'uniform sampler2D uSampler;',
		        'void main(void)  {',
		        '    gl_FragColor = texture2D(uSampler, vTextureCoord);',
		        '}'
		    ].join('\n');

		    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		    gl.shaderSource(fragmentShader, fragShaderSource);
		    gl.compileShader(fragmentShader);

		    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		        addError('Failed to compile fragment shader:' +
		              gl.getShaderInfoLog(fragmentShader));
		    }
		    
		    // Compile the program
		    rv.shaderProgram = gl.createProgram();
		    gl.attachShader(rv.shaderProgram, vertexShader);
		    gl.attachShader(rv.shaderProgram, fragmentShader);
		    gl.linkProgram(rv.shaderProgram);

		    if (!gl.getProgramParameter(rv.shaderProgram, gl.LINK_STATUS)) {
		        addError('Shader linking failed.');
		    }
		        
		    // Create a buffer to hold the vertices
		    rv.vertexBuffer = gl.createBuffer();

		    // Find and set up the uniforms and attributes        
		    gl.useProgram(rv.shaderProgram);
		    rv.vertAttrib = gl.getAttribLocation(rv.shaderProgram, 'aVertCoord');
		        
		    rv.transMatUniform = gl.getUniformLocation(rv.shaderProgram, 'uTransformMatrix');
		    rv.samplerUniform = gl.getUniformLocation(rv.shaderProgram, 'uSampler');
		        
		    // Create a texture to use for the screen image
		    rv.screenTexture = gl.createTexture();

		    // 重要 png光暈
		    gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		    return rv;
		}


		function loadScreenTexture(params) {
		    if(!gl || !glResources) { return; }
		    // params.ratio.x y
		    // params.position.x y
		    // params.type

		    var image = screenImgElement;
		    var extent = { w: image.naturalWidth, h: image.naturalHeight };
		    
		    gl.bindTexture(gl.TEXTURE_2D, glResources.screenTexture);
		    
		    // Scale up the texture to the next highest power of two dimensions.
		    var canvas = document.createElement("canvas");
		    canvas.width = nextHighestPowerOfTwo(extent.w);
		    canvas.height = nextHighestPowerOfTwo(extent.h);



		    var ctx = canvas.getContext("2d");
		    // ctx.drawImage(image, 0, 0, image.width, image.height, -600, 0, image.width/1.2, image.height);


		    if( params == undefined ) {
		    	ctx.drawImage(image, 0, 0, image.width, image.height);
		    	
		    } else {
		    	ctx.drawImage(image, image.width*params.position.x, image.height*params.position.y, image.width*params.ratio.x, image.height*params.ratio.y);
		    	// if( params.type == "horizontal" ) {
		    	// 	ctx.drawImage(image, image.width*params.position, 0, image.width*params.ratio, image.height);
		    	// }
		    	// if( params.type == "vertical" ) {
		    	// 	ctx.drawImage(image, 0, image.height*params.position, image.width, image.height*params.ratio);
		    	// }

		    	if( params.mask !== undefined ) {
		    		ctx.drawImage(maskArray[params.mask], 0, 0, image.width, image.height);
		    	}
		    	
	  		    	
		    }
		    
		    // ctx.drawImage(image, 0, 0, image.width, image.height);
		    
		    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
		    
		    if(qualityOptions.linearFiltering) {
		        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
		                         qualityOptions.mipMapping
		                             ? gl.LINEAR_MIPMAP_LINEAR
		                             : gl.LINEAR);
		        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		    } else {
		        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
		                         qualityOptions.mipMapping
		                             ? gl.NEAREST_MIPMAP_NEAREST
		                             : gl.LINEAR);
		        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		    }
		    
		    if(anisoExt) {
		        // turn the anisotropy knob all the way to 11 (or down to 1 if it is
		        // switched off).
		        var maxAniso = qualityOptions.anisotropicFiltering ?
		            gl.getParameter(anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
		        gl.texParameterf(gl.TEXTURE_2D, anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
		    }
		    
		    if(qualityOptions.mipMapping) {
		        gl.generateMipmap(gl.TEXTURE_2D);
		    }
		    
		    gl.bindTexture(gl.TEXTURE_2D, null);
		    
		    // Record normalised height and width.
		    var w = extent.w / canvas.width, h = extent.h / canvas.height;
		    


		    srcPoints = [
		        { x: 0, y: 0 }, // top-left
		        { x: w, y: 0 }, // top-right
		        { x: 0, y: h }, // bottom-left
		        { x: w, y: h }  // bottom-right
		    ];
		        
		    // setup the vertex buffer with the source points
		    var vertices = [];
		    for(var i=0; i<srcPoints.length; i++) {
		        vertices.push(srcPoints[i].x);
		        vertices.push(srcPoints[i].y);
		    }
		    
		    gl.bindBuffer(gl.ARRAY_BUFFER, glResources.vertexBuffer);
		    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		    
		    // Redraw the image
		    redrawImg();

			self.updatePoint = function(data){
				controlPoints = data;
				redrawImg();
			}
		}

		function isPowerOfTwo(x) { return (x & (x - 1)) == 0; }
		 
		function nextHighestPowerOfTwo(x) {
		    --x;
		    for (var i = 1; i < 32; i <<= 1) {
		        x = x | x >> i;
		    }
		    return x + 1;
		}

		function redrawImg() {
		    if(!gl || !glResources || !srcPoints) { return; }
		    
		    var vpW = screenCanvasElement.width;
		    var vpH = screenCanvasElement.height;
		    
		    // Find where the control points are in 'window coordinates'. I.e.
		    // where thecanvas covers [-1,1] x [-1,1]. Note that we have to flip
		    // the y-coord.
		    var dstPoints = [];
		    for(var i=0; i<controlPoints.length; i++) {
		        dstPoints.push({
		            x: (2 * controlPoints[i].x / vpW) - 1,
		            y: -(2 * controlPoints[i].y / vpH) + 1
		        });
		    }
		    
		    // Get the transform
		    var v = transformationFromQuadCorners(srcPoints, dstPoints);
		    
		    // set background to full transparency
		    gl.clearColor(0,0,0,0);
		    gl.viewport(0, 0, vpW, vpH);
		    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		    gl.useProgram(glResources.shaderProgram);

		    // draw the triangles
		    gl.bindBuffer(gl.ARRAY_BUFFER, glResources.vertexBuffer);
		    gl.enableVertexAttribArray(glResources.vertAttrib);
		    gl.vertexAttribPointer(glResources.vertAttrib, 2, gl.FLOAT, false, 0, 0);
		    
		    /*  If 'v' is the vector of transform coefficients, we want to use
		        the following matrix:
		    
		        [v[0], v[3],   0, v[6]],
		        [v[1], v[4],   0, v[7]],
		        [   0,    0,   1,    0],
		        [v[2], v[5],   0,    1]
		    
		        which must be unravelled and sent to uniformMatrix4fv() in *column-major*
		        order. Hence the mystical ordering of the array below.
		    */
		    gl.uniformMatrix4fv(
		        glResources.transMatUniform,
		        false, [
		            v[0], v[1],    0, v[2],
		            v[3], v[4],    0, v[5],
		               0,    0,    0,    0,
		            v[6], v[7],    0,    1
		        ]);
		        
		    gl.activeTexture(gl.TEXTURE0);
		    gl.bindTexture(gl.TEXTURE_2D, glResources.screenTexture);
		    gl.uniform1i(glResources.samplerUniform, 0);

		    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);    
		}

		function transformationFromQuadCorners(before, after)
		{
		    /*
		     Return the 8 elements of the transformation matrix which maps
		     the points in *before* to corresponding ones in *after*. The
		     points should be specified as
		     [{x:x1,y:y1}, {x:x2,y:y2}, {x:x3,y:y2}, {x:x4,y:y4}].
		     
		     Note: There are 8 elements because the bottom-right element is
		     assumed to be '1'.
		    */
		 
		    var b = numeric.transpose([[
		        after[0].x, after[0].y,
		        after[1].x, after[1].y,
		        after[2].x, after[2].y,
		        after[3].x, after[3].y ]]);
		    
		    var A = [];
		    for(var i=0; i<before.length; i++) {
		        A.push([
		            before[i].x, 0, -after[i].x*before[i].x,
		            before[i].y, 0, -after[i].x*before[i].y, 1, 0]);
		        A.push([
		            0, before[i].x, -after[i].y*before[i].x,
		            0, before[i].y, -after[i].y*before[i].y, 0, 1]);
		    }
		    
		    // Solve for T and return the elements as a single array
		    return numeric.transpose(numeric.dot(numeric.inv(A), b))[0];
		}

		// function syncQualityOptions() {
		//     qualityOptions.anisotropicFiltering = !!(anisotropicFilteringElement.checked);
		//     qualityOptions.mipMapping = !!(mipMappingFilteringElement.checked);
		//     qualityOptions.linearFiltering = !!(linearFilteringElement.checked);
		    
		//     // re-load the texture if possible
		//     loadScreenTexture();
		// }

		function addError(message)
		{
		    var container = document.getElementById('errors');
			var errMessage = document.createElement('div');
			errMessage.textContent = message;
			errMessage.className = 'errorMessage';
			container.appendChild(errMessage);
		}

		this.changeTexture = function(imgID, params) {
			self.nowImgID = imgID;
			screenImgElement = imgArray[self.nowImgID];
			loadScreenTexture(params);
		}

	}


	var PlayerUI = function() {

		var beforeSeekIsPlaying = false;
		var isMousedown = false;
		var el = document.querySelectorAll(".video__play, .video__pause, .video__cover");

		for( var i=0; i<el.length; i++ ) {
			el[i].addEventListener('click', toggleVideoStatus)
		}

		function toggleVideoStatus(event) {
			document.querySelector(".video__cover").classList.remove("video__cover--active");
			if( v.paused ) {
				v.play();
				a.play();
				document.querySelector(".video__play").classList.remove("video__play--active");
				document.querySelector(".video__pause").classList.add("video__pause--active");
			} else {
				v.pause();
				a.pause();
				document.querySelector(".video__play").classList.add("video__play--active");
				document.querySelector(".video__pause").classList.remove("video__pause--active");
			}	
		}
		document.querySelector(".video__repeat").addEventListener('click', function(){
			v.loop = !v.loop;
			a.loop = !a.loop;

			if( v.loop ) {
				document.querySelector(".video__repeat").classList.add("video__repeat--active");
			} else {
				document.querySelector(".video__repeat").classList.remove("video__repeat--active");
			}
		})

		v.addEventListener('play', function() {
			console.log('play');
		})

		// document.querySelectorAll(".video__play, .video__pause").addEventListener('click', function() {
		// 	if( v.paused ) {
		// 		v.play();
		// 		a.play();
		// 		document.querySelector(".video__play").classList.remove("video__play--active");
		// 		document.querySelector(".video__pause").classList.add("video__pause--active");
		// 	} else {
		// 		v.pause();
		// 		a.pause();
		// 		document.querySelector(".video__play").classList.add("video__play--active");
		// 		document.querySelector(".video__pause").classList.remove("video__pause--active");
		// 	}		
		// })

		// document.querySelector(".video__cover").addEventListener("click", function() {
		// 	v.play();
		// 	a.play();
		// 	this.classList.remove("video__cover--active");
		// })

		document.querySelector(".video__timeline").addEventListener("mousedown", timelineMoveStart)
		document.querySelector(".video__timeline").addEventListener("touchstart", timelineMoveStart)

		function timelineMoveStart(event) {
			event.preventDefault();
			var x;
			if( event.touches ) {
				x = event.touches[0].offsetX;
			} else {
				x = event.offsetX+1;
			}
			
			if( v.paused ) {
				beforeSeekIsPlaying = false;
			} else {
				beforeSeekIsPlaying = true;
			}
			v.pause();
			a.pause();
			isMousedown = true;

			var progress = Math.min(Math.max( x / document.querySelector(".video__timeline").offsetWidth, 0), 1) * 100;
			TweenMax.set('.video__progress', {width: progress+"%"});
			v.currentTime = a.currentTime = v.duration * progress/100;


		}

		document.addEventListener("mouseup", timelineMoveEnd)
		document.addEventListener("touchend", timelineMoveEnd)

		function timelineMoveEnd(event) {
			if( isMousedown ) {
				event.preventDefault();
				// var progress = parseInt(document.querySelector(".video__progress").style.width);
				// v.currentTime = v.duration * progress/100;
				if( beforeSeekIsPlaying ) {
					v.play();
					a.play();
				}
				isMousedown = false;
			}
		}


		document.addEventListener("mousemove", timelineMoveing)
		document.addEventListener("touchmove", timelineMoveing)

		function timelineMoveing(event) {
			if( isMousedown ) {
				console.log('move');
				event.preventDefault();
				var x;
				if( event.touches ) {
					x = event.touches[0].pageX;
				} else {
					x = event.pageX;
				}

				var timeline = document.querySelector(".video__timeline");
				var progress = Math.min(Math.max( (x - timeline.getBoundingClientRect().x) / timeline.offsetWidth, 0), 1) * 100;

				v.currentTime = a.currentTime = v.duration * progress/100;

				// var progress = Math.min(Math.max( (event.offsetX+1) / timeline.offsetWidth, 0), 1) * 100;
				TweenMax.set('.video__progress', {width: progress+"%"});
			}
		}

		// document.addEventListener("touchstart", function(event) {
		// 	event.preventDefault();

		// });


		function updateProgressBar() {
			var progress = v.currentTime / v.duration * 100;
			TweenMax.set('.video__progress', {width: progress+"%"});
		}

		update();
		function update() {
			updateProgressBar();
			requestAnimationFrame(update);
		}
	};


	function Main() {
		var self = this;

		var loadedCounter = 0;
		var completeFn;

		self.loadAssets = function(music, complete) {
			completeFn = complete;
			loadedCounter = 0;
			var req = new XMLHttpRequest();
			req.open('GET', '/tc/assets/videos/mv.mp4', true);
			req.responseType = 'blob';
			req.onload = function() {
			   if (this.status === 200) {
			      var blob = this.response;
			      var vid = URL.createObjectURL(blob); // IE10+
			      v.src = vid;
			      sourceLoaded();
			   }
			}
			req.onerror = function() {
			   // Error
			}
			req.send();

			var req2 = new XMLHttpRequest();
			req2.open('GET', music, true);
			req2.responseType = 'blob';
			req2.onload = function() {
			   if (this.status === 200) {
			      var blob = this.response;
			      var audio = URL.createObjectURL(blob); // IE10+
			      a.src = audio;
			      sourceLoaded();
			   }
			}
			req2.onerror = function() {
			   // Error
			}
			req2.send();
		}



		function sourceLoaded() {
			loadedCounter++;

			if( loadedCounter == 2 ) {
				mediaReady();
			}
		}

		function mediaReady() {
			var frameRate = 24;
			var isFire = false;
			getCurrentVideoFrame();
			var transformData = {};
			var lastCurrentFrame = 0;
			function getCurrentVideoFrame() {
				requestAnimationFrame(getCurrentVideoFrame);
			    var curTime = v.currentTime;
			    var theCurrentFrame = Math.floor(curTime*frameRate);
			    if( theCurrentFrame == lastCurrentFrame ) return;
			    lastCurrentFrame = theCurrentFrame;
			    // console.log( theCurrentFrame );
			    if( f.loadComplete ) {
				    if( theCurrentFrame >= 2860 && theCurrentFrame <= 2993 && !f.isShooting) {
						f.show();
						f.shot();
						console.log("SHOT");
				    }
				    if( theCurrentFrame < 2860 || theCurrentFrame > 2993 ) {
				    	f.hide();
				    	f.isShooting = false;
				    }
			    }

			    var isShow = false;
			    loop1:
			    for( var i=0; i<keyFrameData.length; i++ ) {

			    		loop2:
			   			for( var j=1; j<keyFrameData[i].data[0].length; j++ ) {

			   				if( keyFrameData[i].data[0][j][0] == theCurrentFrame ) { // j-1

			   					// test.visibility = true;
			   					// test.set({cornersData: [keyFrameData[i].data[0][j][1], keyFrameData[i].data[0][j][2], keyFrameData[i].data[1][j][1], keyFrameData[i].data[1][j][2], keyFrameData[i].data[2][j][1], keyFrameData[i].data[2][j][2], keyFrameData[i].data[3][j][1], keyFrameData[i].data[3][j][2]]})

			   					vntf.updatePoint([
								    { x: keyFrameData[i].data[0][j][1], y: keyFrameData[i].data[0][j][2] },
								    { x: keyFrameData[i].data[1][j][1], y: keyFrameData[i].data[1][j][2] },
								    { x: keyFrameData[i].data[3][j][1], y: keyFrameData[i].data[3][j][2] },
								    { x: keyFrameData[i].data[2][j][1], y: keyFrameData[i].data[2][j][2] }						    
								]);
			   					
								if( keyFrameData[i].img !== vntf.nowImgID ) {
									TweenMax.killTweensOf(transformData.position);
									vntf.changeTexture(keyFrameData[i].img);

									if( keyFrameData[i].marquee !== undefined ) {
										transformData = {
											mask: keyFrameData[i].marquee.mask,
											position: {
												x: 0,
												y: 0
											},
											ratio: {
												x: keyFrameData[i].marquee.ratio.x,
												y: keyFrameData[i].marquee.ratio.y,
											},
											type: keyFrameData[i].marquee.type
										};

										var tweenFrom = {
											x: keyFrameData[i].marquee.position.start.x,
											y: keyFrameData[i].marquee.position.start.y
										}

										var tweenTo = {
											x: keyFrameData[i].marquee.position.end.x,
											y: keyFrameData[i].marquee.position.end.y,
											ease: Power1.easeOut,
											onUpdate: function() {
												vntf.changeTexture(keyFrameData[i].img, transformData);
												// console.log( transformData );
											}
										}

										TweenMax.fromTo(transformData.position, keyFrameData[i].marquee.duration, tweenFrom, tweenTo);
										// TweenMax.fromTo(transformData.position, keyFrameData[i].marquee.duration, {x:keyFrameData[i].marquee.position.start.x, y:keyFrameData[i].marquee.position.start.y}, {x:keyFrameData[i].marquee.position.end.x, y:keyFrameData[i].marquee.position.end.x});
									}
								}
								// redrawImg();
								// loadScreenTexture();
								isShow = true;
								break loop1;
			   				} else {

			   				}

			   			}
			   			
			    }

			    if( isShow ) {
			    	TweenMax.set("#screen", {opacity: 1});
			    } else {
			    	TweenMax.set("#screen", {opacity: 0});
			    }

			    

			    
			}

			var syncChecker = 0;
			mediaSync();
			function mediaSync() {
				syncChecker++;

				if( syncChecker == 60 ) {
					// document.querySelector(".msg").innerHTML = Math.abs(a.currentTime - v.currentTime );
					// console.log( Math.abs(a.currentTime - v.currentTime ) );
					if( Math.abs(a.currentTime - v.currentTime ) > 0.4 ) {
						a.currentTime = v.currentTime;
						console.log("sync!!");
					}
					syncChecker = 0;
				}


				requestAnimationFrame(mediaSync);
			}

			completeFn();
		}
	}

	var f = new FireWorkEffect();
	var vntf = new VideoNameTransform();
	var main = new Main();
	var ui = new PlayerUI();

	self.start = function(params) {
		console.log("start");
		var checker = 0;
		main.loadAssets(params.music, complete);
		vntf.loadAssets([params.img[0], params.img[1], params.img[2], params.img[3], params.img[4], params.img[5], params.img[6]], complete);
		f.loadAssets(params.img[7], complete);

		function complete() {
			checker++;
			if( checker == 3 ) params.complete();
		}
	}

	self.playVideo = function() {
		v.play();
		a.play();
	}

	self.seekTo = function(number) {
		document.querySelector(".video__cover").classList.remove("video__cover--active");
		v.currentTime = a.currentTime = number; 
		// a.play();
	}


}



// var myMv = new mv();

// myMv.start({
// 	img: ['assets/images/test/testname1-2.png', 'assets/images/test/testname2-2.png', 'assets/images/test/testname3-2.png', 'assets/images/test/testname4-2.png', 'assets/images/test/testname5-2.png', 'assets/images/test/testname6-2.png', 'assets/images/test/testname7-2.png', 'assets/images/test/fireworktext.png'],
// 	music: 'assets/videos/testaudio.mp3',
// 	complete: function() {
// 		console.log("OK");
// 	}
// });





	// document.querySelector()