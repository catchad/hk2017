var mv = function() {
	// params.img (Array)
	// params.music (Text)
	// params.onComplete (Function)
	var self = this;

	var ww = window.width;
	var v = document.getElementById("mv"); 
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
			pixiInit();

		}
		
		function pixiInit() {
			var w = 850;
			var h = 400;
			var app = new PIXI.Application(w, h, {forceCanvas: false, view: document.getElementById('firework'), transparent:true});

			var texture = PIXI.Texture.fromImage('/tc/assets//images/mv/particle.png');

			var container = new PIXI.particles.ParticleContainer(10000, {
			    scale: false,
			    position: true,
			    rotation: false,
			    uvs: false,
			    alpha: true
			});

			// var container = new PIXI.Container();

			app.stage.addChild(container);

			container.x = w/2 - c.width/2 ;
			container.y = 30;
			var timer;

			var pixels = [];


			for( var i=0; i<3500; i++ ) {
				var rnd = Math.floor(Math.random()*pointData.length);

			    var pixel = new PIXI.Sprite(texture);
			    pixel.data = {x:pointData[rnd].x, y:pointData[rnd].y, scale:1, tint: 0xfffd4b};

			    pixel.anchor.set(0.5);
			    pixel.x = pixel.data.x;
			    pixel.y = pixel.data.y;
			    pixel.alpha = 0;
			    pixel.scale.x = pixel.scale.y = pixel.data.scale;
			    pixel.tint = 0xfffd4b;
			    container.addChild(pixel);			    

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
					var rndDelay = Math.random()*0.75;
					TweenMax.killTweensOf(pixels[i]);


				    // pixels[i].x = pixels[i].data.x; 
				    // pixels[i].y = pixels[i].data.y+10;
				    var p = getPoint(angleBetween({x:pixels[i].data.x, y:pixels[i].data.y}, {x:c.width/2, y:c.height/2}) , distanceBetween({x:pixels[i].data.x, y:pixels[i].data.y}, {x:c.width/2, y:c.height/2})/2.5);
				    pixels[i].x = pixels[i].data.x + p.x; 
				    pixels[i].y = pixels[i].data.y + p.y;
			    
				    // console.log(p);
				    pixels[i].scale.x = pixels[i].scale.y = pixels[i].data.scale;
				    pixels[i].alpha = 0;
				    pixels[i].tint = pixels[i].data.tint;

				    TweenMax.to(pixels[i], 2.5, {x:pixels[i].data.x, y:pixels[i].data.y, alpha:1, ease:Power2.easeOut, delay:rndDelay});

				    TweenMax.to(pixels[i], 3, {x:pixels[i].data.x, y:pixels[i].data.y+100, alpha:0, ease:Power2.easeIn, delay:2.5+rndDelay});
				    // TweenMax.to(pixels[i], 1+Math.random()*2, {alpha:0, ease:Power2.easeIn, delay:2.5});


				    // TweenMax.to(pixels[i], 3, {colorProps:{tint: 0xff0000} });
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

			function getPoint(theta, r) {
				var x = (r *Math.sin(theta));
				var y = (r *Math.cos(theta));
				return {x:x, y:y};
			}

			function angleBetween(point1, point2) {
				return Math.atan2( point2.x - point1.x, point2.y - point1.y );
			}
			function distanceBetween(point1, point2) {
				return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
			}

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
		self.nowActiveID = 0;
		self.nowImgID = 0;

		// Math.min(window.width, 1150)
		
		if( document.querySelector('.video__screen').offsetWidth < 800 ) {
			self.screenWidth = document.querySelector('.video__screen').offsetWidth*2;
			self.screenHeight = document.querySelector('.video__screen').offsetHeight*2;
		} else {
			self.screenWidth = document.querySelector('.video__screen').offsetWidth;
			self.screenHeight = document.querySelector('.video__screen').offsetHeight;
		}

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
		screenCanvasElement.setAttribute('width', self.screenWidth);
		screenCanvasElement.setAttribute('height', self.screenHeight);
		

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
				mask.src = "/tc/assets//images/mv/mask"+(i+1)+"-mobile.png";
			}

		}


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

		var loadScreenCanvas = document.createElement("canvas");
		var loadScreenCtx = loadScreenCanvas.getContext("2d");

		function loadScreenTexture(params) {
		    if(!gl || !glResources) { return; }
		    // params.ratio.x y
		    // params.position.x y
		    // params.type
		    // params.clear


		    var image = screenImgElement;
		    var extent = { w: image.naturalWidth, h: image.naturalHeight };
		    
		    gl.bindTexture(gl.TEXTURE_2D, glResources.screenTexture);
		    
		    // Scale up the texture to the next highest power of two dimensions.
		    // var canvas = document.createElement("canvas");
		    loadScreenCanvas.width = nextHighestPowerOfTwo(extent.w);
		    loadScreenCanvas.height = nextHighestPowerOfTwo(extent.h);

		    // var ctx = canvas.getContext("2d");
		    // ctx.drawImage(image, 0, 0, image.width, image.height, -600, 0, image.width/1.2, image.height);


		    if( params == undefined ) {
		    	loadScreenCtx.drawImage(image, 0, 0, image.width, image.height);
		    } else {
		    	if( params.clear ) {
		    		// console.log("clear");
		    		// console.log(image);
		    		// loadScreenCtx.drawImage(image, 0, 0, image.width, image.height);
		    		self.nowActiveID = -1;

		    		// loadScreenCtx.clearRect(0,0, image.width, image.height);
		    	} else {
			    	loadScreenCtx.drawImage(image, image.width*params.position.x, image.height*params.position.y, image.width*params.ratio.x, image.height*params.ratio.y);

			    	if( params.mask !== undefined ) {
			    		loadScreenCtx.drawImage(maskArray[params.mask], 0, 0, image.width, image.height);
			    	}
		    	}

		    	
		    }
		    
		    // ctx.drawImage(image, 0, 0, image.width, image.height);
		    
		    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, loadScreenCanvas);
		    
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
		    var w = extent.w / loadScreenCanvas.width, h = extent.h / loadScreenCanvas.height;
		    
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

		function addError(message)
		{
		    var container = document.getElementById('errors');
			var errMessage = document.createElement('div');
			errMessage.textContent = message;
			errMessage.className = 'errorMessage';
			container.appendChild(errMessage);
		}

		this.changeTexture = function(activeID, imgID, params) {
			if( params == undefined ) {
				if( activeID == self.nowActiveID ) return;
				self.nowActiveID = activeID;
				self.nowImgID = imgID;
				screenImgElement = imgArray[self.nowImgID];
				loadScreenTexture();
			} else {
				self.nowActiveID = activeID;
				self.nowImgID = imgID;
				screenImgElement = imgArray[self.nowImgID];
				loadScreenTexture(params);
			}

		}
		this.clearTexture = function() {
			loadScreenTexture({clear:true});
		}

	}


	var PlayerUI = function() {

		function iOSversion() {
			if (/iP(hone|od|ad)/.test(navigator.platform)) {
				// supports iOS 2.0 and later: <https://bit.ly/TJjs1V>
				var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
				return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
			}
		}

		var iosV = new iOSversion();

		var beforeSeekIsPlaying = false;
		var isPaning = false;
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

		if( iosV[0] > 10 ) {
			var mc = new Hammer(document.querySelector(".video__timeline"));
			mc.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
			mc.on("panstart", function(event) {
				isPaning = true;
				if( v.paused ) {
					beforeSeekIsPlaying = false;
				} else {
					beforeSeekIsPlaying = true;
				}
				v.pause();
				a.pause();
			})
			mc.on("panend", function(event) {
				isPaning = false;
				// v.currentTime = a.currentTime = v.duration * progress/100;
				if( beforeSeekIsPlaying ) {
					a.play();
					v.play();
				}
			})

			// var timer;
			mc.on("pan tap press", function(event) {
				// clearTimeout(timer);

				var timeline =  document.querySelector(".video__timeline");
				var x = event.center.x - timeline.getBoundingClientRect().left;
				var progress = Math.min(Math.max( x / document.querySelector(".video__timeline").offsetWidth, 0), 1) * 100;
				updateProgressBar(progress);
				// document.querySelector(".msg").innerHTML = timeline.getBoundingClientRect().left;
				// timer = setTimeout(function() {
					v.currentTime = a.currentTime = v.duration * progress/100;
					// console.log("change");
				// }, 1000)
				
			});

		}


		function updateProgressBar(progress) {
			// var progress = v.currentTime / v.duration * 100;
			TweenMax.set('.video__progress', {width: progress+"%"});
		}

		update();
		function update() {			
			requestAnimationFrame(update);
			if( isPaning ) return;
			var progress = v.currentTime / v.duration * 100;
			updateProgressBar(progress);
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
			req.open('GET', '/tc/assets//videos/mv.mp4?v1', true);
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
			var transformData = {};
			var lastCurrentFrame = 0;
			var isActive = false;
			var lastActive = false;
			var targetKeyFrameID;

			getCurrentVideoFrame();
			function getCurrentVideoFrame() {
				requestAnimationFrame(getCurrentVideoFrame);
			    var curTime = v.currentTime;
			    var theCurrentFrame = Math.floor(curTime*frameRate);
			    // var targetKeyFrame;
			    
			    if( theCurrentFrame == lastCurrentFrame ) return;
			    lastCurrentFrame = theCurrentFrame;
			    if( f.loadComplete ) {
				    if( theCurrentFrame >= 2846 && theCurrentFrame <= 2993 && !f.isShooting) {
						f.show();
						f.shot();
						// console.log("SHOT");
				    }
				    if( theCurrentFrame < 2846 || theCurrentFrame > 2993 ) {
				    	f.hide();
				    	f.isShooting = false;
				    }
			    }

			    isActive = false;

			    loop1:
			    for( var i=0; i<keyFrameData.length; i++ ) {
			    		loop2:
			   			for( var j=1; j<keyFrameData[i].data[0].length; j++ ) {
			   				if( keyFrameData[i].data[0][j][0] == theCurrentFrame ) {
			   					targetKeyFrameID =  i;
			   					vntf.updatePoint([
								    { x: vntf.screenWidth*keyFrameData[i].data[0][j][1]/1920, y: vntf.screenHeight*keyFrameData[i].data[0][j][2]/1080 },
								    { x: vntf.screenWidth*keyFrameData[i].data[1][j][1]/1920, y: vntf.screenHeight*keyFrameData[i].data[1][j][2]/1080 },
								    { x: vntf.screenWidth*keyFrameData[i].data[3][j][1]/1920, y: vntf.screenHeight*keyFrameData[i].data[3][j][2]/1080 },
								    { x: vntf.screenWidth*keyFrameData[i].data[2][j][1]/1920, y: vntf.screenHeight*keyFrameData[i].data[2][j][2]/1080 }						    
								]);
								isActive = true;
								break loop1;
			   				}
			   			}			   			
			    }

			    if( isActive !== lastActive ) {
			    	// console.log("change");
			    	if( isActive ) {
			    		// 出現貼圖
						var targetKeyFrameData = keyFrameData[targetKeyFrameID];
						TweenMax.killTweensOf(transformData.position);	

						if( targetKeyFrameData.marquee !== undefined ) {
							// 需要做跑馬燈動畫
							transformData = {
								mask: targetKeyFrameData.marquee.mask,
								position: {
									x: 0,
									y: 0
								},
								ratio: {
									x: targetKeyFrameData.marquee.ratio.x,
									y: targetKeyFrameData.marquee.ratio.y,
								},
								type: targetKeyFrameData.marquee.type
							};

							var tweenFrom = {
								x: targetKeyFrameData.marquee.position.start.x,
								y: targetKeyFrameData.marquee.position.start.y
							}

							var tweenTo = {
								x: targetKeyFrameData.marquee.position.end.x,
								y: targetKeyFrameData.marquee.position.end.y,
								ease: Power1.easeOut,
								onUpdate: function() {
									// console.log(i);
									// console.log(targetKeyFrameID, targetKeyFrameData.img, transformData);
									vntf.changeTexture(targetKeyFrameID, targetKeyFrameData.img, transformData);
									// console.log( transformData );
								}
							}

							TweenMax.fromTo(transformData.position, targetKeyFrameData.marquee.duration, tweenFrom, tweenTo);

						} else {
	
							vntf.changeTexture(targetKeyFrameID, targetKeyFrameData.img);
						}
	
			    	} else {
			    		// 沒有出現貼圖
			    		TweenMax.killTweensOf(transformData.position);
			    		vntf.clearTexture();
			    	}
			    }


			    lastActive = isActive;
		    
			}
			var syncTimes = 0;
			var syncChecker = 0;
			mediaSync();
			function mediaSync() {
				syncChecker++;
				if( syncChecker == 60 ) {
					// document.querySelector(".msg").innerHTML = Math.abs(a.currentTime - v.currentTime );
					// console.log( Math.abs(a.currentTime - v.currentTime ) );
					// document.querySelector(".msg").innerHTML = "同步次數: "+syncTimes+ " 目前誤差: " + Math.abs(a.currentTime - v.currentTime );
					if( Math.abs(a.currentTime - v.currentTime ) > 0.1 ) {
						v.currentTime = a.currentTime;
						// syncTimes++;
						// console.log("sync!!");
						// document.querySelector(".msg").innerHTML = "同步次數: "+syncTimes;
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
		// vntf.clearTexture();
		// document.querySelector(".video__cover").classList.remove("video__cover--active");
		// v.currentTime = a.currentTime = number;
		// alert(v.currentTime);
		// alert(a.currentTime);
		// a.play();
	}

}