/*
	Storm.js
	v1.0
*/

var Storm={};

/* rAF */
var raf_lastTime = 0;
var raf_vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < raf_vendors.length && !window.requestAnimationFrame; ++x) {
	window.requestAnimationFrame = window[raf_vendors[x]+'RequestAnimationFrame'];
	window.cancelAnimationFrame = window[raf_vendors[x]+'CancelAnimationFrame'] || window[raf_vendors[x]+'CancelRequestAnimationFrame'];
} 
if (!window.requestAnimationFrame){
	window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - raf_lastTime));
		var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
		raf_lastTime = currTime + timeToCall;
		return id;
	};
}	
if (!window.cancelAnimationFrame){
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}
	
/* init */
Storm.init=function(_obj){
	if(_obj.debug==true){	Storm.debug=true;	}else{	Storm.debug=false; }
	
	var divStorm = document.createElement("div");
	divStorm.style.display = "none";
	divStorm.style.position = "absolute";
	divStorm.style.top = "0px";
	divStorm.style.left = "0px";
	divStorm.innerHTML='<canvas id="stageTemp" width="'+_obj.width+'" height="'+_obj.height+'" style="display:none;"></canvas>';	
	document.body.appendChild(divStorm);
	
	Storm.isGlobalUpdate=true;
	Storm.isRenderNum=0;
	
	Storm.maskBakeId=0;
	
	Storm.stage = document.getElementById(_obj.elementId);
	Storm.ctx = Storm.stage.getContext && Storm.stage.getContext('2d');

	Storm.stageTemp = document.getElementById("stageTemp");
	Storm.ctxTemp = Storm.stageTemp.getContext && Storm.stageTemp.getContext('2d');
	
	if(_obj.retinaCanvas){
		Storm.stageRetina = document.getElementById(_obj.retinaCanvas);
		Storm.ctxRetina = Storm.stageRetina.getContext && Storm.stageRetina.getContext('2d');

	}	
	
	Storm.activeUser=false;
	Storm.tmEF=false;
	
	Storm.toRAD = Math.PI/180; 
	Storm.aRand=[0.55,0.86,0.065,0.408,0.423,0.628,0.672,0.634,0.671,0.794,0.328,0.649,0.172,0.531,0.803,0.583,0.528,0.527,0.396,0.153,0.198,0.418,0.021,0.712,0.553,0.03,0.811,0.495,0.186,0.119,0.421,0.039,0.889,0.345,0.889,0.161,0.931,0.358,0.762,0.254,0.729,0.568,0.979,0.607,0.894,0.616,0.841,0.128,0.05,0.856,0.997,0.543,0.841,0.877,0.563,0.358,0.853,0.906,0.115,0.339,0.788,0.988,0.326,0.123,0.413,0.308,0.723,0.121,0.762,0.916,0.406,0.491,0.942,0.7,0.554,0.958,0.562,0.182,0.956,0.056,0.867,0.692,0.26,0.215,0.801,0.668,0.168,0.17,0.977,0.876,0.088,0.296,0.116,0.904,0.498,0.056,0.062,0.008,0.335,0.392,0.67,0.697,0.647,0.87,0.648,0.529,0.6,0.583,0.689,0.176,0.722,0.612,0.005,0.218,0.33,0.401,0.004,0.344,0.066,0.517,0.038,0.307,0.183,0.03,0.272,0.591,0.846,0.403,0.581,0.34,0.094,0.49,0.167,0.26,0.676,0.344,0.657,0.147,0.134,0.662,0.813,0.213,0.435,0.548,0.676,0.628,0.986,0.265,0.539,0.633,0.33,0.947,0.354,0.183,0.413,0.479,0.015,0.576,0.606,0.723,0.313,0.43,0.976,0.37,0.745,0.328,0.599,0.654,0.037,0.36,0.826,0.725,0.921,0.868,0.503,0.144,0.956,0.281,0.961,0.808,0.001,0.206,0.602,0.137,0.587,0.848,0.819,0.804,0.857,0.319,0.431,0.723,0.993,0.37,0.738,0.313,0.331,0.728,0.809,0.101,0.711,0.482,0.494,0.545,0.502,0.047,0.495,0.224,0.749,0.826,0.554,0.459,0.329,0.834,0.239,0.645,0.695,0.824,0.651,0.341,0.82,0.724,0.233,0.52,0.968,0.035,0.778,0.7,0.454,0.153,0.677,0.025,0.825,0.909,0.027,0.731,0.616,0.158,0.46,0.467,0.23,0.998,0.429,0.481,0.028,0.511,0.742,0.379,0.022,0.629,0.039,0.985,0.931,0.491,0.057,0.929,0.91,0.599,0.741,0.073,0.388,0.745,0.359,0.581,0.065,0.633,0.211,0.005,0.738,0.992,0.621,0.493,0.497,0.575,0.247,0.139,0.549,0.122,0.191,0.168,0.329,0.278,0.279,0.706,0.252,0.823,0.027,0.592,0.197,0.87,0.498,0.903,0.563,0.043,0.868,0.648,0.123,0.171,0.982,0.154,0.758,0.61,0.301,0.385,0.981,0.714,0.69,0.721,0.434,0.857,0.814,0.361,0.036,0.672,0.239,0.021,0.22,0.871,0.928,0.276,0.846,0.267,0.215,0.05,0.422,0.857,0.279,0.86,0.676,0.134,0.908,0.738,0.73,0.094,0.218,0.978,0.873,0.8,0.235,0.059,0.684,0.255,0.584,0.392,0.917,0.787,0.431,0.323,0.945,0.568,0.5,0.383,0.271,0.613,0.344,0.695,0.652,0.22,0.743,0.022,0.016,0.269,0.242,0.022,0.826,0.917,0.338,0.066,0.126,0.048,0.595,0.426,0.604,0.256,0.51,0.574,0.895,0.766,0.681,0.717,0.479,0.484,0.879,0.666,0.439,0.969,0.542,0.896,0.326,0.402,0.232,0.052,0.913,0.793,0.446,0.535,0.939,0.125,0.868,0.393,0.925,0.771,0.685,0.542,0.219,0.051,0.038,0.189,0.994,0.14,0.992,0.115,0.046,0.05,0.363,0.524,0.793,0.819,0.542,0.173,0.65,0.26,0.743,0.773,0.068,0.141,0.714,0.836,0.83,0.592,0.086,0.721,0.87,0.251,0.849,0.812,0.806,0.643,0.878,0.62,0.539,0.51,0.632,0.839,0.211,0.838,0.626,0.107,0.478,0.753,0.215,0.273,0.647,0.778,0.776,0.108,0.66,0.925,0.751,0.075,0.369,0.463,0.319,0.841,0.141,0.064,0.465,0.152,0.768,0.869,0.497,0.822,0.568,0.865,0.725,0.22,0.356,0.062,0.843,0.321,0.426,0.662,0.772,0.334,0.919,0.747,0.527,0.192,0.754,0.442,0.904,0.029,0.679,0.975,0.326,0.481,0.661,0.143,0.21,0.011,0.476,0.648,0.268,0.781,0.262,0.65,0.502,0.917,0.833,0.148,0.626,0.898,0.399,0.03,0.201,0.92,0.801,0.363,0.354,0.639,0.158,0.039,0.196,0.093,0.677,0.416,0.954,0.379,0.276,0.701,0.733,0.148,0.305,0.48,0.8,0.808,0.274,0.553,0.268,0.895,0.703,0.979,0.243,0.967,0.857,0.73,0.605,0.2,0.415,0.398,0.658,0.363,0.839,0.366,0.451,0.375,0.998,0.532,0.685,0.289,0.649,0.125,0.299,0.718,0.903,0.16,0.284,0.114,0.748,0.684,0.455,0.313,0.815,0.831,0.83,0.146,0.646,0.707,0.545,0.091,0.143,0.174,0.081,0.246,0.001,0.166,0.95,0.891,0.58,0.323,0.56,0.184,0.185,0.703,0.286,0.035,0.76,0.255,0.089,0.083,0.193,0.091,1,0.824,0.326,0.029,0.866,0.6,0.905,0.253,0.911,0.529,0.023,0.996,0.21,0.431,0.456,0.616,0.087,0.126,0.055,0.023,0.751,0.807,0.437,0.94,0.502,0.271,0.267,0.886,0.195,0.342,0.569,0.899,0.421,0.87,0.941,0.83,0.111,0.886,0.461,0.165,0.295,0.67,0.298,0.719,0.896,0.266,0.126,0.677,0.694,0.098,0.764,0.027,0.182,0.526,0.218,0.07,0.912,0.535,0.931,0.717,0.979,0.827,0.827,0.068,0.018,0.99,0.404,0.378,0.121,0.266,0.722,0.22,0.333,0.029,0.603,0.372,0.881,0.345,0.35,0.177,0.375,0.33,0.697,0.364,0.875,0.976,0.139,0.895,0.083,0.883,0.795,0.639,0.53,0.467,0.437,0.556,0.781,0.505,0.956,0.445,0.971,0.077,0.065,0.786,0.157,0.039,0.114,0.211,0.929,0.19,0.379,0.797,0.001,0.91,0.543,0.792,0.364,0.49,0.534,0.954,0.01,0.484,0.641,0.922,0.216,0.732,0.87,0.808,0.07,0.591,0.823,0.805,0.859,0.414,0.789,0.791,0.727,0.532,0.296,0.002,0.463,0.877,0.969,0.158,0.27,0.922,0.691,0.964,0.59,0.67,0.084,0.435,0.628,0.037,0.631,0.795,0.448,0.502,0.568,0.417,0.049,0.154,0.257,0.182,0.536,0.678,0.351,0.3,0.5,0.301,0.779,0.8,0.685,0.458,0.576,0.888,0.04,0.053,0.855,0.171,0.872,0.521,0.118,0.972,0.301,0.651,0.863,0.009,0.907,0.447,0.981,0.534,0.559,0.508,0.216,0.098,0.583,0.792,0.659,0.357,0.819,0.334,0.256,0.553,0.675,0.158,0.637,0.748,0.297,0.17,0.332,0.817,0.057,0.154,0.282,0.299,0.678,0.626,0.731,0.134,0.882,0.562,0.817,0.672,0.819,0.671,0.607,0.219,0.399,0.51,0.179,0.821,0.612,0.646,0.204,0.769,0.489,0.177,0.654,0.021,0.178,0.393,0.732,0.203,0.43,0.645,0.917,0.325,0.209,0.221,0.947,0.158,0.922,0.072,0.153,0.07,0.734,0.316,0.871,0.067,0.295,0.244,0.217,0.109,0.83,0.736,0.042,0.332,0.623,0.625,0.697,0.032,0.809,0.861,0.385,0.562,0.76,0.171,0.8,0.947,0.059,0.243,0.445,0.924,0.884,0.616,0.612,0.027,0.721,0.611,0.736,0.658,0.352,0.82,0.71,0.245,0.656,0.456,0.766,0.513,0.596,0.467,0.29,0.532,0.562,0.985,0.314,0.099,0.204,0.014,0.084,0.543,0.6,0.238,0.714,0.015,0.928,0.493,0.127,0.78,0.68,0.88,0.198,0.113,0.857,0.371,0.153,0.344,0.36,0.653,0.731,0.845,0.651,0.532,0.894,0.321,0.23,0.876,0.117,0.52,0.128,0.793,0.323,0.999,0.732,0.45,0.348,0.995,0.014,0.554,0.474,0.121,0.803,0.247,0.929,0.398,0.298,0.871,0.287,0.055,0.082,0.89,0.892,0.467,0.132,0.251,0.212,0.999,0.773,0.556,0.621,0.014,0.875,0.694,0.3,0.165,0.552,0.574,0.911,0.708,0.714,0.328,0.756,0.658,0.752,0.126,0.762,0.631,0.198,0.154,0.797,0.717,0.764,0.654,0.559,0.127,0.543,0.669];
	Storm.idRandom=0;
	
	Storm.stageWidth=_obj.width;
	Storm.stageHeight=_obj.height;
	
	if(_obj.retina==true){ Storm.retina=2; }else{ Storm.retina=1; }
	
	Storm.obj={};
	Storm.bitmaps = {};	
	Storm.completeLoadImages=_obj.complete;

	//- load images
	Storm.numLoadImages = 0;	
	Storm.numTotalImages = _obj.graphics.length;	
	
	if(Storm.numTotalImages==0){
		Storm.completeLoadImages();
	}else{
		for(Storm.i=0; Storm.i<Storm.numTotalImages; Storm.i++){
			if(_obj.names){
				Storm.str=_obj.names[Storm.i];
			}else{
				Storm.n1=_obj.graphics[Storm.i].lastIndexOf("/");
				Storm.n2=_obj.graphics[Storm.i].lastIndexOf(".");
				if(Storm.n1==-1){ Storm.n1=-1; }
				if(Storm.n2==-1){ Storm.n2=_obj.graphics[Storm.i].length; }		
				Storm.str=_obj.graphics[Storm.i].substring(Storm.n1+1, Storm.n2);
			}
			
			Storm.bitmaps[Storm.str] = new Image();
			Storm.bitmaps[Storm.str].onload = function(){
				if(++Storm.numLoadImages >= Storm.numTotalImages){
					Storm.completeLoadImages();
				}
			};
			Storm.bitmaps[Storm.str].src = _obj.graphics[Storm.i];
		}
	}
	
	//- events
	Storm.stage.addEventListener('click', function(event) {
		Storm.mouseX = (event.pageX - Storm.stage.offsetLeft)*Storm.retina;
		Storm.mouseY = (event.pageY - Storm.stage.offsetTop)*Storm.retina;

		for(Storm.tObj in Storm.obj){
			if(Storm.obj[Storm.tObj].visible==true || Storm.obj[Storm.tObj].visible==1){	
				if(Storm.obj[Storm.tObj].bitmap!="" && Storm.obj[Storm.tObj].onClick!=undefined && Storm.mouseX>(Storm.obj[Storm.tObj]._x-Storm.obj[Storm.tObj].bitmap.width/2*Storm.obj[Storm.tObj].scaleX) && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].bitmap.width/2*Storm.obj[Storm.tObj].scaleX) && Storm.mouseY>(Storm.obj[Storm.tObj]._y-Storm.obj[Storm.tObj].bitmap.height/2*Storm.obj[Storm.tObj].scaleY) && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].bitmap.height/2*Storm.obj[Storm.tObj].scaleY)){						
					Storm.obj[Storm.tObj].onClick();
					if(Storm.obj[Storm.tObj].breakEvent==true){
						break; 
					}
				}else if(Storm.obj[Storm.tObj].graphics!="" && Storm.obj[Storm.tObj].onClick!=undefined && Storm.mouseX>(Storm.obj[Storm.tObj]._x) && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].width) && Storm.mouseY>(Storm.obj[Storm.tObj]._y) && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].height)){						
					Storm.obj[Storm.tObj].onClick();
					if(Storm.obj[Storm.tObj].breakEvent==true){
						break; 
					}
				}
			}
		}					
	});
	Storm.stage.addEventListener('mousedown', function(event) {
		Storm.mouseX = (event.pageX - Storm.stage.offsetLeft)*Storm.retina;
		Storm.mouseY = (event.pageY - Storm.stage.offsetTop)*Storm.retina;

		for(Storm.tObj in Storm.obj){
			if(Storm.obj[Storm.tObj].visible==true || Storm.obj[Storm.tObj].visible==1){	
				if(Storm.obj[Storm.tObj].bitmap!="" && Storm.obj[Storm.tObj].onDown!=undefined && Storm.mouseX>(Storm.obj[Storm.tObj]._x-Storm.obj[Storm.tObj].bitmap.width/2*Storm.obj[Storm.tObj].scaleX) && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].bitmap.width/2*Storm.obj[Storm.tObj].scaleX) && Storm.mouseY>(Storm.obj[Storm.tObj]._y-Storm.obj[Storm.tObj].bitmap.height/2*Storm.obj[Storm.tObj].scaleY) && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].bitmap.height/2*Storm.obj[Storm.tObj].scaleY)){						
					Storm.obj[Storm.tObj].onDown();
					if(Storm.obj[Storm.tObj].breakEvent==true){
						break; 
					}
				}else if(Storm.obj[Storm.tObj].graphics!="" && Storm.obj[Storm.tObj].onDown!=undefined && Storm.mouseX>(Storm.obj[Storm.tObj]._x) && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].width) && Storm.mouseY>(Storm.obj[Storm.tObj]._y) && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].height)){						
					Storm.obj[Storm.tObj].onDown();
					if(Storm.obj[Storm.tObj].breakEvent==true){
						break; 
					}
				}
			}
		}					
	});
	Storm.stage.addEventListener('mouseup', function(event) {
		Storm.mouseX = (event.pageX - Storm.stage.offsetLeft)*Storm.retina;
		Storm.mouseY = (event.pageY - Storm.stage.offsetTop)*Storm.retina;

		for(Storm.tObj in Storm.obj){
			if(Storm.obj[Storm.tObj].visible==true || Storm.obj[Storm.tObj].visible==1){	
				if(Storm.obj[Storm.tObj].bitmap!="" && Storm.obj[Storm.tObj].onUp!=undefined && Storm.mouseX>(Storm.obj[Storm.tObj]._x-Storm.obj[Storm.tObj].bitmap.width/2*Storm.obj[Storm.tObj].scaleX) && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].bitmap.width/2*Storm.obj[Storm.tObj].scaleX) && Storm.mouseY>(Storm.obj[Storm.tObj]._y-Storm.obj[Storm.tObj].bitmap.height/2*Storm.obj[Storm.tObj].scaleY) && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].bitmap.height/2*Storm.obj[Storm.tObj].scaleY)){						
					Storm.obj[Storm.tObj].onUp();
					if(Storm.obj[Storm.tObj].breakEvent==true){
						break; 
					}
				}else if(Storm.obj[Storm.tObj].graphics!="" && Storm.obj[Storm.tObj].onUp!=undefined && Storm.mouseX>(Storm.obj[Storm.tObj]._x) && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].width) && Storm.mouseY>(Storm.obj[Storm.tObj]._y) && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].height)){						
					Storm.obj[Storm.tObj].onUp();
					if(Storm.obj[Storm.tObj].breakEvent==true){
						break; 
					}
				}
			}
		}					
	});
	Storm.stage.addEventListener('mouseout', function(event) {
		for(Storm.tObj in Storm.obj){
			if(Storm.obj[Storm.tObj].visible==true || Storm.obj[Storm.tObj].visible==1){
				if(Storm.obj[Storm.tObj].onOut!=undefined){	
					Storm.obj[Storm.tObj].onOut();
				}
			}
		}					
	});
	Storm.stage.addEventListener('mousemove', function(event) {
		Storm.mouseX = (event.pageX - Storm.stage.offsetLeft)*Storm.retina;
		Storm.mouseY = (event.pageY - Storm.stage.offsetTop)*Storm.retina;

		for(Storm.tObj in Storm.obj){
			if(Storm.obj[Storm.tObj].visible==true || Storm.obj[Storm.tObj].visible==1){
				if(Storm.obj[Storm.tObj].onOver!=undefined && Storm.obj[Storm.tObj].onOut!=undefined){	
					if(Storm.obj[Storm.tObj].bitmap!="" && Storm.mouseX>(Storm.obj[Storm.tObj]._x-Storm.obj[Storm.tObj].bitmap.width/2) && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].bitmap.width/2) && Storm.mouseY>(Storm.obj[Storm.tObj]._y-Storm.obj[Storm.tObj].bitmap.height/2) && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].bitmap.height/2)){
						Storm.obj[Storm.tObj].onOver();
					}else if(Storm.obj[Storm.tObj].graphics=="rect" && Storm.mouseX>Storm.obj[Storm.tObj]._x && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].width) && Storm.mouseY>Storm.obj[Storm.tObj]._y && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].height)){
						Storm.obj[Storm.tObj].onOver();	
					}else if(Storm.obj[Storm.tObj].graphics=="circle" && Storm.mouseX>Storm.obj[Storm.tObj]._x-Storm.obj[Storm.tObj].radius*Storm.obj[Storm.tObj].mouseZoneKoef && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].radius*Storm.obj[Storm.tObj].mouseZoneKoef) && Storm.mouseY>Storm.obj[Storm.tObj]._y-Storm.obj[Storm.tObj].radius*Storm.obj[Storm.tObj].mouseZoneKoef && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].radius*Storm.obj[Storm.tObj].mouseZoneKoef)){
						Storm.obj[Storm.tObj].onOver();		
					}else if(Storm.obj[Storm.tObj].stateMouse=="over"){
						Storm.obj[Storm.tObj].onOut();
					}
				}
			}
		}	

		/*if(Storm.debug==true && Storm.debugTarget!=null){
			Storm.debugTarget.x=Storm.mouseX+Storm.debugX;
			Storm.debugTarget.y=Storm.mouseY+Storm.debugY;
		}	*/
	});
	
	if(Storm.debug==true){
		Storm.debugTarget=null;
		Storm.stage.addEventListener('mousedown', function(event) {
			for(Storm.tObj in Storm.obj){
				if(Storm.obj[Storm.tObj].visible==true || Storm.obj[Storm.tObj].visible==1){
					if(Storm.obj[Storm.tObj].bitmap!="" && Storm.mouseX>(Storm.obj[Storm.tObj]._x-Storm.obj[Storm.tObj].bitmap.width/2) && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].bitmap.width/2) && Storm.mouseY>(Storm.obj[Storm.tObj]._y-Storm.obj[Storm.tObj].bitmap.height/2) && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].bitmap.height/2)){
						Storm.debugTarget=Storm.obj[Storm.tObj];
						Storm.debugX=Storm.obj[Storm.tObj].x-event.pageX - Storm.stage.offsetLeft;
						Storm.debugY=Storm.obj[Storm.tObj].y-event.pageY - Storm.stage.offsetTop;					
					}else if(Storm.obj[Storm.tObj].graphics!="" && Storm.mouseX>Storm.obj[Storm.tObj]._x && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].width) && Storm.mouseY>Storm.obj[Storm.tObj]._y && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].height)){
						Storm.debugTarget=Storm.obj[Storm.tObj];
						Storm.debugX=Storm.obj[Storm.tObj].x-event.pageX - Storm.stage.offsetLeft;
						Storm.debugY=Storm.obj[Storm.tObj].y-event.pageY - Storm.stage.offsetTop;
					}
				}
			}					
		});
		Storm.stage.addEventListener('mouseup', function(event) {
			if(Storm.debugTarget!=null){
				//trace("x: "+Storm.debugTarget.x+"; y: "+Storm.debugTarget.y);
				Storm.debugTarget=null;		
			}	
		});
		Storm.stage.addEventListener('dblclick', function(event) {
			for(Storm.tObj in Storm.obj){
				if(Storm.obj[Storm.tObj].visible==true || Storm.obj[Storm.tObj].visible==1){
					if(Storm.obj[Storm.tObj].bitmap!="" && Storm.mouseX>(Storm.obj[Storm.tObj]._x-Storm.obj[Storm.tObj].bitmap.width/2) && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].bitmap.width/2) && Storm.mouseY>(Storm.obj[Storm.tObj]._y-Storm.obj[Storm.tObj].bitmap.height/2) && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].bitmap.height/2)){
						Storm.obj[Storm.tObj].visible=false;
						break;	
					}else if(Storm.obj[Storm.tObj].graphics!="" && Storm.mouseX>Storm.obj[Storm.tObj]._x && Storm.mouseX<(Storm.obj[Storm.tObj]._x+Storm.obj[Storm.tObj].width) && Storm.mouseY>Storm.obj[Storm.tObj]._y && Storm.mouseY<(Storm.obj[Storm.tObj]._y+Storm.obj[Storm.tObj].height)){
						Storm.obj[Storm.tObj].visible=false;
						break;
					}
				}
			}	
		});
	}
	
	//- enter frame
	Storm.EF = window.requestAnimationFrame(Storm.Update);
}

/* enterframe */
Storm.Update=function(){
	//time = performance.now();
	if(Storm.enterFrame){
		Storm.enterFrame();
	}
	//console.log('enterFrame = ', performance.now() - time);

	Storm.isRenderNum++;
	if(Storm.isRenderNum==2){
		Storm.isRenderNum=0;		
		
		//time = performance.now();
		Storm.DriveDisplayList();	
		//console.log('DriveDisplayList = ', performance.now() - time);
	}
	
	Storm.EF = window.requestAnimationFrame(Storm.Update); 
}

/* utilits */
Storm.Random=function(_n){
	Storm._nRand=_n*Storm.aRand[Storm.idRandom];
	Storm.idRandom++;
	if(Storm.idRandom==Storm.aRand.length){ Storm.idRandom=0; }
	Storm._nRandCeil= Math.round(Storm._nRand);
	if(Storm._nRandCeil==_n){Storm._nRandCeil--;}
	return Storm._nRandCeil;				
}
function trace(_t){	
	//console.log(_t);
}

Storm.convertHex = function (hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);
    result = 'rgba('+r+','+g+','+b+','+opacity+')';
    return result;
}

/* create display objects */
Storm.addChild=function(_obj){
	var _this=this;
	if(_this!=Storm.stage && _this.displayObject!=true){ _this=Storm.stage; }
	_obj.parent=_this;
}
Storm.cache=function(){
	var _this=this;

	if(_this.text!="" || _this.bitmap==""){
		var measure_text = measureText(_this.text, _this.font);
	}

	_this.m_alpha=_this.alpha;
	_this.m_visible=_this.visible;
	_this.m_x=_this.x;
	_this.m_y=_this.y;
	
	if(_this.bitmap!=""){
		_this.m_width=_this.bitmap.width;
		_this.m_height=_this.bitmap.height;
	}else{
		_this.m_width=measure_text.width;
		_this.m_height=measure_text.height;
	}
	
	_this.m_rotation=_this.rotation;
	_this.m_parent=_this.parent;
	_this.m_scaleX=_this.scaleX;
	_this.m_scaleY=_this.scaleY;
	
	_this.x=_this.m_width/2;
	_this.y=_this.m_height/2;
	
	_this.scaleX=1;
	_this.scaleY=1;
	_this.rotation=0;
	_this.alpha=1;
	
	_this.parent=Storm.stage;

	//-
	Storm["stageTemp"+Storm.maskBakeId] = document.createElement("canvas");
	Storm["stageTemp"+Storm.maskBakeId].id = "stageTemp"+Storm.maskBakeId;
	if(_this.bitmap!=""){
		Storm["stageTemp"+Storm.maskBakeId].width=_this.bitmap.width;
		Storm["stageTemp"+Storm.maskBakeId].height=_this.bitmap.height;
	}else{
		Storm["stageTemp"+Storm.maskBakeId].width=measure_text.width;
		Storm["stageTemp"+Storm.maskBakeId].height=measure_text.height;
	}
	Storm["ctxTemp"+Storm.maskBakeId] = Storm["stageTemp"+Storm.maskBakeId].getContext &&Storm["stageTemp"+Storm.maskBakeId].getContext('2d');
	
	//-
	Storm["ctxTemp"+Storm.maskBakeId].save();	
	Storm["ctxTemp"+Storm.maskBakeId].clearRect(0, 0, Storm["stageTemp"+Storm.maskBakeId].width, Storm["stageTemp"+Storm.maskBakeId].height);

	Storm.DrawingObject(_this, Storm["ctxTemp"+Storm.maskBakeId]);	
	
	Storm["ctxTemp"+Storm.maskBakeId].restore();
	
	//-
	
	_this.bitmap = Storm["stageTemp"+Storm.maskBakeId]; 
	
	_this.alpha=_this.m_alpha;
	_this.visible=_this.m_visible;
	_this.x=_this.m_x+(_this.m_width-_this.bitmap.width)/2;
	_this.y=_this.m_y+(_this.m_height-_this.bitmap.height)/2;
	_this.rotation=_this.m_rotation;
	_this.parent=_this.m_parent;
	_this.scaleX=_this.m_scaleX;
	_this.scaleY=_this.m_scaleY;
	
	_this.caching = true;
	
	_this.text="";
	_this.graphics="";
	_this.pattern="";
	_this.gradient="";
	
	//-
	Storm.maskBakeId++;
}
Storm.maskBake=function(_mask){
	var _this=this;

	_this.alpha=1;
	_mask.alpha=1;
	_this.visible=1;
	_mask.visible=1;
	
	_this.m_alpha=_this.alpha;
	_this.m_visible=_this.visible;
	_this.m_x=_this.x;
	_this.m_y=_this.y;
	if(_this.bitmap!=""){
		_this.m_width=_this.bitmap.width;
		_this.m_height=_this.bitmap.height;
		_this.x=_this.m_width/2;
		_this.y=_this.m_height/2;
	}else{
		_this.m_width=_this.width;
		_this.m_height=_this.height;
		_this.x=0;
		_this.y=0;
	}
	_this.m_rotation=_this.rotation;
	_this.m_parent=_this.parent;
	_this.m_scaleX=_this.scaleX;
	_this.m_scaleY=_this.scaleY;
	_this.scaleX=1;
	_this.scaleY=1;
	_this.rotation=0;
	_this.alpha=1;
	
	if(_mask.bitmap!=""){
		_mask.x=_mask.bitmap.width/2;
		_mask.y=_mask.bitmap.height/2;
	}else{
		//_mask.x=0;
		//_mask.y=0;
	}
	_mask.scaleX=_mask.scaleX/Math.abs(_mask.scaleX);
	_mask.scaleY=_mask.scaleY/Math.abs(_mask.scaleY);
	_mask.rotation=0;
	_mask.alpha=1;
	
	_this.parent=Storm.stage;
	_mask.parent=Storm.stage;
		
	//-
	Storm["stageTemp"+Storm.maskBakeId] = document.createElement("canvas");
	Storm["stageTemp"+Storm.maskBakeId].id = "stageTemp"+Storm.maskBakeId;
	Storm["stageTemp"+Storm.maskBakeId].width=_this.width;
	Storm["stageTemp"+Storm.maskBakeId].height=_this.height;
	Storm["ctxTemp"+Storm.maskBakeId] = Storm["stageTemp"+Storm.maskBakeId].getContext &&Storm["stageTemp"+Storm.maskBakeId].getContext('2d');
	
	//-
	Storm["ctxTemp"+Storm.maskBakeId].save();	
	Storm["ctxTemp"+Storm.maskBakeId].clearRect(0, 0, Storm["stageTemp"+Storm.maskBakeId].width, Storm["stageTemp"+Storm.maskBakeId].height);

	Storm.DrawingObject(_this, Storm["ctxTemp"+Storm.maskBakeId]);	
	//Storm["ctxTemp"+Storm.maskBakeId].drawImage(_this.bitmap, -0*Math.round(_this.bitmap.width/2), -0*Math.round(_this.bitmap.height/2));

	Storm["ctxTemp"+Storm.maskBakeId].restore();
		
	Storm["ctxTemp"+Storm.maskBakeId].save(); 		
	Storm["ctxTemp"+Storm.maskBakeId].globalCompositeOperation = "destination-in";
	
	Storm.DrawingObject(_mask, Storm["ctxTemp"+Storm.maskBakeId]);	
	//Storm["ctxTemp"+Storm.maskBakeId].drawImage(_mask.bitmap, -0*Math.round(_mask.bitmap.width/2), -0*Math.round(_mask.bitmap.height/2));

	Storm["ctxTemp"+Storm.maskBakeId].restore();
	
	//-
	
	_this.alpha=_this.m_alpha;
	_this.visible=_this.m_visible;
	_this.x=_this.m_x//+(_this.m_width-_this.bitmap.width)/2;
	_this.y=_this.m_y//+(_this.m_height-_this.bitmap.height)/2;
	if(_this.bitmap==""){
		_this.x+=Storm["stageTemp"+Storm.maskBakeId].width*0.5;
		_this.y+=Storm["stageTemp"+Storm.maskBakeId].height*0.5;
	}	
	_this.rotation=_this.m_rotation;
	_this.parent=_this.m_parent;
	_this.scaleX=_this.m_scaleX;
	_this.scaleY=_this.m_scaleY;
	
	_this.pattern="";
	_this.text="";
	_this.gradient="";
	_this.bitmap = Storm["stageTemp"+Storm.maskBakeId]; 
	
	//-
	_mask.alpha=0;
	_mask.visible=false;
	
	//-
	Storm.maskBakeId++;
}
Storm.mask=function(_mask){
	var _this=this;
	_mask.is_mask=true;
	_this.to_mask=_mask;

	for(Storm.tObj in Storm.obj){
		if(Storm.obj[Storm.tObj].parent==_this){
			Storm.obj[Storm.tObj].to_mask=_mask;
		}
	}
}
 
Storm.SaveDisplayList=function(){
	for(Storm.tObj in Storm.obj){
		Storm.obj[Storm.tObj].x=Math.round(Storm.obj[Storm.tObj].x);
		Storm.obj[Storm.tObj].y=Math.round(Storm.obj[Storm.tObj].y);		
		if(Storm.obj[Storm.tObj].reboot!=false){
			Storm.obj[Storm.tObj].m_parent=Storm.obj[Storm.tObj].parent;
			Storm.obj[Storm.tObj].m_scaleX=Storm.obj[Storm.tObj].scaleX;
			Storm.obj[Storm.tObj].m_scaleY=Storm.obj[Storm.tObj].scaleY;
			Storm.obj[Storm.tObj].m_alpha=Storm.obj[Storm.tObj].alpha;
			Storm.obj[Storm.tObj].m_visible=Storm.obj[Storm.tObj].visible;
			Storm.obj[Storm.tObj].m_x=Storm.obj[Storm.tObj].x;
			Storm.obj[Storm.tObj].m_y=Storm.obj[Storm.tObj].y;
			Storm.obj[Storm.tObj].m_rotation=Storm.obj[Storm.tObj].rotation;
			Storm.obj[Storm.tObj].m_tint=Storm.obj[Storm.tObj].tint;
			Storm.obj[Storm.tObj].m_tintColor=Storm.obj[Storm.tObj].tintColor;
			
			if(Storm.obj[Storm.tObj].text!=""){				
				for(Storm.i=0; Storm.i< Storm.obj[Storm.tObj].textLines.length; Storm.i++){
					Storm.obj[Storm.tObj]["line_"+Storm.i].m_scaleX=Storm.obj[Storm.tObj]["line_"+Storm.i].scaleX;
					Storm.obj[Storm.tObj]["line_"+Storm.i].m_scaleY=Storm.obj[Storm.tObj]["line_"+Storm.i].scaleY;
					Storm.obj[Storm.tObj]["line_"+Storm.i].m_alpha=Storm.obj[Storm.tObj]["line_"+Storm.i].alpha
					Storm.obj[Storm.tObj]["line_"+Storm.i].m_visible=Storm.obj[Storm.tObj]["line_"+Storm.i].visible;
					Storm.obj[Storm.tObj]["line_"+Storm.i].m_x=Storm.obj[Storm.tObj]["line_"+Storm.i].x;
					Storm.obj[Storm.tObj]["line_"+Storm.i].m_y=Storm.obj[Storm.tObj]["line_"+Storm.i].y;
					Storm.obj[Storm.tObj]["line_"+Storm.i].m_rotation=Storm.obj[Storm.tObj]["line_"+Storm.i].rotation;
				}			
			}
			if(Storm.obj[Storm.tObj].particles!=""){				
				for(Storm.i=0; Storm.i<Storm.obj[Storm.tObj].quantity; Storm.i++){
					Storm.obj[Storm.tObj].particle[Storm.i].isEnable=true;
				
					Storm.obj[Storm.tObj].particle[Storm.i].m_scaleX=Storm.obj[Storm.tObj].particle[Storm.i].scaleX;
					Storm.obj[Storm.tObj].particle[Storm.i].m_scaleY=Storm.obj[Storm.tObj].particle[Storm.i].scaleY;
					Storm.obj[Storm.tObj].particle[Storm.i].m_alpha=Storm.obj[Storm.tObj].particle[Storm.i].alpha
					Storm.obj[Storm.tObj].particle[Storm.i].m_visible=Storm.obj[Storm.tObj].particle[Storm.i].visible;
					Storm.obj[Storm.tObj].particle[Storm.i].m_x=Storm.obj[Storm.tObj].particle[Storm.i].x;
					Storm.obj[Storm.tObj].particle[Storm.i].m_y=Storm.obj[Storm.tObj].particle[Storm.i].y;
					Storm.obj[Storm.tObj].particle[Storm.i].m_rotation=Storm.obj[Storm.tObj].particle[Storm.i].rotation;
				}				
			}
		}
	}		
}
Storm.RebootDisplayList=function(){
	for(Storm.tObj in Storm.obj){
		if(Storm.obj[Storm.tObj].reboot!=false){
			Storm.RebootDisplayObject(Storm.obj[Storm.tObj]);
		}
	}		
}
Storm.RebootDisplayObject=function(_obj){
	_obj.scaleX=_obj.m_scaleX;
	_obj.scaleY=_obj.m_scaleY;
	_obj.alpha=_obj.m_alpha
	_obj.visible=_obj.m_visible;
	_obj.x=_obj.m_x;
	_obj.y=_obj.m_y;
	_obj.rotation=_obj.m_rotation;
	_obj.tint=_obj.m_tint;
	_obj.tintColor=_obj.m_tintColor;
	
	if(_obj.particles!=""){				
		for(Storm.i=0; Storm.i<_obj.quantity; Storm.i++){
			_obj.particle[Storm.i].isEnable=true;
		
			_obj.particle[Storm.i].scaleX=_obj.particle[Storm.i].m_scaleX;
			_obj.particle[Storm.i].scaleY=_obj.particle[Storm.i].m_scaleY;
			_obj.particle[Storm.i].alpha=_obj.particle[Storm.i].m_alpha
			_obj.particle[Storm.i].visible=_obj.particle[Storm.i].m_visible;
			_obj.particle[Storm.i].x=_obj.particle[Storm.i].m_x;
			_obj.particle[Storm.i].y=_obj.particle[Storm.i].m_y;
			_obj.particle[Storm.i].rotation=_obj.particle[Storm.i].m_rotation;
		}				
	}
	if(_obj.text!=""){				
		for(Storm.i=0; Storm.i< _obj.textLines.length; Storm.i++){
			_obj["line_"+Storm.i].scaleX=_obj["line_"+Storm.i].m_scaleX;
			_obj["line_"+Storm.i].scaleY=_obj["line_"+Storm.i].m_scaleY;
			_obj["line_"+Storm.i].alpha=_obj["line_"+Storm.i].m_alpha
			_obj["line_"+Storm.i].visible=_obj["line_"+Storm.i].m_visible;
			_obj["line_"+Storm.i].x=_obj["line_"+Storm.i].m_x;
			_obj["line_"+Storm.i].y=_obj["line_"+Storm.i].m_y;
			_obj["line_"+Storm.i].rotation=_obj["line_"+Storm.i].m_rotation;
		}				
	}
	
	try{ TweenLite.killTweensOf(_obj); }catch(e){}
	try{ TweenMax.killTweensOf(_obj); }catch(e){}
}

Storm.CreateDisplayList=function(){
	Storm.stage.x=Storm.stage.y=Storm.stage.z=Storm.stage.rotation=0;
	Storm.stage.alpha=Storm.stage.visible=Storm.stage.scaleX=Storm.stage.scaleY=1;
	Storm.stage.parent=Storm.stage;
	Storm.stage.addChild=Storm.addChild;

	for(Storm.tObj in Storm.obj){
		if(Storm.obj[Storm.tObj].displayObject==undefined){ Storm.obj[Storm.tObj].displayObject=true; }
		
		if(Storm.obj[Storm.tObj].x==undefined){ Storm.obj[Storm.tObj].x=0; }
		if(Storm.obj[Storm.tObj].y==undefined){ Storm.obj[Storm.tObj].y=0; }
		if(Storm.obj[Storm.tObj].z==undefined){ Storm.obj[Storm.tObj].z=0; }			
		if(Storm.obj[Storm.tObj].scaleX==undefined){ Storm.obj[Storm.tObj].scaleX=1; }
		if(Storm.obj[Storm.tObj].scaleY==undefined){ Storm.obj[Storm.tObj].scaleY=1; }
		if(Storm.obj[Storm.tObj].rotation==undefined){ Storm.obj[Storm.tObj].rotation=0; }
		if(Storm.obj[Storm.tObj].alpha==undefined){ Storm.obj[Storm.tObj].alpha=1; }
		if(Storm.obj[Storm.tObj].visible==undefined){ Storm.obj[Storm.tObj].visible=true; }		
		if(Storm.obj[Storm.tObj].width==undefined){ Storm.obj[Storm.tObj].width=0; }		
		if(Storm.obj[Storm.tObj].height==undefined){ Storm.obj[Storm.tObj].height=0; }		
		
		if(Storm.obj[Storm.tObj].bitmap==undefined){ Storm.obj[Storm.tObj].bitmap=""; }else{
			if(Storm.obj[Storm.tObj].width==0){ Storm.obj[Storm.tObj].width=Storm.obj[Storm.tObj].bitmap.width; }		
			if(Storm.obj[Storm.tObj].height==0){ Storm.obj[Storm.tObj].height=Storm.obj[Storm.tObj].bitmap.height; }			
		}
		if(Storm.obj[Storm.tObj].text==undefined){ Storm.obj[Storm.tObj].text=""; }else{
			Storm.obj[Storm.tObj].textLines=Storm.obj[Storm.tObj].text.split('<n>');
			for(Storm.i=0; Storm.i< Storm.obj[Storm.tObj].textLines.length; Storm.i++){
				Storm.obj[Storm.tObj]["line_"+Storm.i]={text:Storm.obj[Storm.tObj].textLines[Storm.i],x:0,y:0,alpha:1,rotation:0,scaleX:1,scaleY:1}
			}
		}
		if(Storm.obj[Storm.tObj].graphics==undefined){ Storm.obj[Storm.tObj].graphics=""; }
		if(Storm.obj[Storm.tObj].pattern==undefined){ Storm.obj[Storm.tObj].pattern=""; }
		if(Storm.obj[Storm.tObj].gradient==undefined){ Storm.obj[Storm.tObj].gradient=""; }
		if(Storm.obj[Storm.tObj].gradientScale==undefined){ Storm.obj[Storm.tObj].gradientScale=1; }
		if(Storm.obj[Storm.tObj].particles==undefined){ Storm.obj[Storm.tObj].particles=""; }else{
			Storm.obj[Storm.tObj].particle=[];
			Storm.randId=0;
			for(Storm.i=0; Storm.i<Storm.obj[Storm.tObj].quantity; Storm.i++){
				Storm.obj[Storm.tObj].particle.push({x:0, y:0, scaleX:1, scaleY:1, alpha:1, visible:true, rotation:0, graphicId:Storm.randId, isEnable:true});
			
				Storm.randId++;
				if(Storm.randId==Storm.obj[Storm.tObj].particles.length){ Storm.randId=0; }		
			}
		}
		
		if(Storm.obj[Storm.tObj].video==undefined){ Storm.obj[Storm.tObj].video=""; }
		if(Storm.obj[Storm.tObj].tint==undefined){ Storm.obj[Storm.tObj].tint=""; }
		if(Storm.obj[Storm.tObj].tintColor==undefined){ Storm.obj[Storm.tObj].tintColor="#ffffff"; }
		if(Storm.obj[Storm.tObj].blendMode==undefined){ Storm.obj[Storm.tObj].blendMode=""; }
				
		if(Storm.obj[Storm.tObj].is_play==undefined){ Storm.obj[Storm.tObj].is_play=false; }
		
		if(Storm.obj[Storm.tObj].fill==undefined){ Storm.obj[Storm.tObj].fill=""; }		
		if(Storm.obj[Storm.tObj].stroke==undefined){ Storm.obj[Storm.tObj].stroke=""; }		
		if(Storm.obj[Storm.tObj].lineWidth==undefined){ Storm.obj[Storm.tObj].lineWidth=1; }		
		if(Storm.obj[Storm.tObj].lineHeight==undefined){ Storm.obj[Storm.tObj].lineHeight=26; }		
		
		if(Storm.obj[Storm.tObj].mouseZoneKoef==undefined){ Storm.obj[Storm.tObj].mouseZoneKoef=1; }
		
		if(Storm.obj[Storm.tObj].shadowColor==undefined){ Storm.obj[Storm.tObj].shadowColor=""; }		

		if(Storm.obj[Storm.tObj].parent==undefined){ Storm.obj[Storm.tObj].parent=Storm.stage; Storm.stage.addChild(Storm.obj[Storm.tObj]); }
		if(Storm.obj[Storm.tObj].addChild==undefined){ Storm.obj[Storm.tObj].addChild=Storm.addChild; }
		
		if(Storm.obj[Storm.tObj].repeatX==undefined){ Storm.obj[Storm.tObj].repeatX=1; }
		if(Storm.obj[Storm.tObj].repeatY==undefined){ Storm.obj[Storm.tObj].repeatY=1; }
		
		if(Storm.obj[Storm.tObj].reboot==undefined){ Storm.obj[Storm.tObj].reboot=true; }
		if(Storm.obj[Storm.tObj].is_stop==undefined){ Storm.obj[Storm.tObj].is_stop=true; }
		
		if(Storm.obj[Storm.tObj].mask==undefined){Storm.obj[Storm.tObj].mask=Storm.mask; }
		if(Storm.obj[Storm.tObj].maskBake==undefined){Storm.obj[Storm.tObj].maskBake=Storm.maskBake; }
		if(Storm.obj[Storm.tObj].cache==undefined){Storm.obj[Storm.tObj].cache=Storm.cache; }
		if(Storm.obj[Storm.tObj].to_mask==undefined){ Storm.obj[Storm.tObj].to_mask=""; }
		if(Storm.obj[Storm.tObj].is_mask==undefined){ Storm.obj[Storm.tObj].is_mask=""; }
		
		if(Storm.obj[Storm.tObj].align==undefined){ Storm.obj[Storm.tObj].align="center"; }
		if(Storm.obj[Storm.tObj].valign==undefined){ Storm.obj[Storm.tObj].valign="center"; }
		
		if(Storm.obj[Storm.tObj].effDistortionK==undefined){ 
			Storm.obj[Storm.tObj].effDistortionK=0; 
		}else{						
			Storm.obj[Storm.tObj].effDistortion=[];			
			for(Storm.i=0; Storm.i<Storm.obj[Storm.tObj].effDistortionH; Storm.i++){
				Storm.obj[Storm.tObj].effDistortion.push(0);
			}			
		}
	}	
}

Storm.DriveDisplayList=function(){
	if(Storm.isGlobalUpdate){
		Storm.ctx.clearRect(0, 0, Storm.stage.width, Storm.stage.height);
		Storm.ctxTemp.clearRect(0, 0, Storm.stage.width, Storm.stage.height);
		if(Storm.ctxRetina){ Storm.ctxRetina.clearRect(0, 0, Storm.stageRetina.width, Storm.stageRetina.height); }
		
		Storm.tObjTotal=0; 
		Storm.tObjDrawing=0; 
		
		if(!Storm.aAllObjKey || Storm.aAllObjKey.length==0){
			Storm.aAllObjKey=[];
			
			for(Storm.tObj in Storm.obj){
				Storm.aAllObjKey.push(Storm.tObj);
			}
		}
		
		for(Storm.idAllObjKey=0; Storm.idAllObjKey<Storm.aAllObjKey.length; Storm.idAllObjKey++){
			Storm.tObj = Storm.aAllObjKey[Storm.idAllObjKey];
			Storm.tObjTotal++;	
			
			if((Storm.obj[Storm.tObj].bitmap!="" || Storm.obj[Storm.tObj].text!="" || Storm.obj[Storm.tObj].graphics!="" || Storm.obj[Storm.tObj].video!="" || Storm.obj[Storm.tObj].pattern!="" || Storm.obj[Storm.tObj].particles!="" || Storm.obj[Storm.tObj].gradient!="") && (Storm.obj[Storm.tObj].visible==true || Storm.obj[Storm.tObj].visible==1) && (Storm.obj[Storm.tObj].parent.visible==true || Storm.obj[Storm.tObj].parent.visible==1) && Storm.obj[Storm.tObj].alpha>0 && Storm.obj[Storm.tObj].parent.alpha>0  && Storm.obj[Storm.tObj].is_mask==""){						
				if(Storm.obj[Storm.tObj].to_mask!=""){
					Storm.ctxTemp.save();	
					Storm.ctxTemp.clearRect(0, 0, Storm.stage.width, Storm.stage.height);
					
					if(Storm.obj[Storm.tObj].blendMode!=""){
						Storm.ctxTemp.drawImage(Storm.stage, 0, 0);	
						Storm.ctxTemp.globalCompositeOperation=Storm.obj[Storm.tObj].blendMode;
					}
					
					Storm.DrawingObject(Storm.obj[Storm.tObj], Storm.ctxTemp);	
					Storm.ctxTemp.restore();
					
					Storm.ctxTemp.save(); 		
					Storm.ctxTemp.globalCompositeOperation = "destination-in";
					Storm.DrawingObject(Storm.obj[Storm.tObj].to_mask, Storm.ctxTemp);	

					Storm.ctxTemp.restore();
					Storm.ctx.drawImage(Storm.stageTemp, 0, 0);
				
				}else if(Storm.obj[Storm.tObj].blendMode!=""){
					Storm.ctxTemp.save();	
					Storm.ctxTemp.clearRect(0, 0, Storm.stage.width, Storm.stage.height);
					
					Storm.ctxTemp.drawImage(Storm.stage, 0, 0);	
					
					Storm.ctxTemp.globalCompositeOperation=Storm.obj[Storm.tObj].blendMode;
					
					Storm.DrawingObject(Storm.obj[Storm.tObj], Storm.ctxTemp);			
					Storm.ctxTemp.restore();
					Storm.ctx.drawImage(Storm.stageTemp, 0, 0);
				
				}else{
					/*Storm.ctxTemp.save();
					Storm.ctxTemp.clearRect(0, 0, Storm.stage.width, Storm.stage.height);
					
					if(Storm.DrawingObject(Storm.obj[Storm.tObj], Storm.ctxTemp)){	
						Storm.ctxTemp.restore();
						Storm.ctx.drawImage(Storm.stageTemp, 0, 0);
					}
					*/
					
					if(Storm.obj[Storm.tObj].retina==true){
						Storm.ctxRetina.save();					
						Storm.DrawingObject(Storm.obj[Storm.tObj], Storm.ctxRetina);
						Storm.ctxRetina.restore();
						
					}else{
						Storm.ctx.save();					
						Storm.DrawingObject(Storm.obj[Storm.tObj], Storm.ctx);
						Storm.ctx.restore();				
					}
					
				}
				
				if(Storm.obj[Storm.tObj].tint!="" && Storm.obj[Storm.tObj].tint!=0 && Storm.obj[Storm.tObj].visible && Storm.obj[Storm.tObj].alpha>0 && Storm.obj[Storm.tObj]._alpha>0){
					Storm.ctxTemp.save();	
					Storm.ctxTemp.clearRect(0, 0, Storm.stage.width, Storm.stage.height);
					
					Storm.ctxTemp.drawImage(Storm.stage, 0, 0);	
					Storm.ctxTemp.fillStyle="rgba("+Storm.obj[Storm.tObj].tintColor+", "+Storm.obj[Storm.tObj].tint+")";
					Storm.ctxTemp.fillRect(0, 0, Storm.stage.width, Storm.stage.height);
					
					Storm.ctxTemp.restore();
					
					Storm.ctxTemp.save(); 		
					Storm.ctxTemp.globalCompositeOperation = "destination-in";
					Storm.DrawingObject(Storm.obj[Storm.tObj], Storm.ctxTemp);	

					Storm.ctxTemp.restore();
					Storm.ctx.drawImage(Storm.stageTemp, 0, 0);
				}
			}
		}

	}
}
Storm.DrawingObject=function(_obj, _ctx){
	//- 
	_obj._x=_obj.x;
	_obj._y=_obj.y;	
	
	_obj._scaleX=_obj.scaleX;
	_obj._scaleY=_obj.scaleY;
	_obj._alpha=_obj.alpha;
	_obj._rotation=_obj.rotation;
		
	if(_obj._alpha==0){
		return false;
	}
	
	//- 
	Storm.pObj=_obj.parent;
	do{
		if(Storm.pObj.visible==false || Storm.pObj.visible==0 || Storm.pObj.alpha==0){
			_obj._alpha=0;
			break;
		}
		
		_obj.x0=_obj._x
		_obj.y0=_obj._y
		if(Storm.pObj.rotation!=0){
			_obj._x = _obj.x0 * Math.cos(Storm.pObj.rotation*Storm.toRAD ) - _obj.y0 * Math.sin(Storm.pObj.rotation*Storm.toRAD );
			_obj._y = _obj.x0 * Math.sin(Storm.pObj.rotation*Storm.toRAD ) + _obj.y0 * Math.cos(Storm.pObj.rotation*Storm.toRAD );	
		}
		_obj._x=_obj._x*Storm.pObj.scaleX;
		_obj._y=_obj._y*Storm.pObj.scaleY;
		
		_obj._x+=Storm.pObj.x;
		_obj._y+=Storm.pObj.y;				
		
		_obj._scaleX*=Storm.pObj.scaleX;
		_obj._scaleY*=Storm.pObj.scaleY;
		_obj._alpha*=Storm.pObj.alpha;
		_obj._rotation+=Storm.pObj.rotation;

		Storm.pObj=Storm.pObj.parent;
	}while(Storm.pObj!=Storm.stage);
	
	if(_obj._alpha==0 || (_obj._scaleX==0 && _obj._scaleY==0)){
		return false;
	}
	Storm.tObjDrawing++;
	
	//- 	
	_ctx.translate(_obj._x, _obj._y);	
	_ctx.rotate(_obj._rotation * Storm.toRAD );
	_ctx.globalAlpha = _obj._alpha;
	_ctx.scale(_obj._scaleX, _obj._scaleY);
	
	//- 
	if(_obj.text!=""){		
		// Text			
		for(Storm.i=0; Storm.i< _obj.textLines.length; Storm.i++){
			Storm.j=Storm.i*_obj.lineHeight;
			if(_obj.valign!="top"){
				Storm.j=Storm.j-( _obj.textLines.length-1)*_obj.lineHeight*0.5;
			}
			
			_ctx.translate(0, Storm.j);
			_ctx.translate(_obj["line_"+Storm.i].x, _obj["line_"+Storm.i].y);
			_ctx.globalAlpha =_obj["line_"+Storm.i].alpha*_obj._alpha;
			_ctx.rotate(_obj["line_"+Storm.i].rotation * Storm.toRAD );
			_ctx.scale(_obj["line_"+Storm.i].scaleX, _obj["line_"+Storm.i].scaleY);

			_ctx.font = _obj.font;
			if(String(_obj.color).length>7){				
				_ctx.fillStyle = _obj.color;
			}else{		
				_ctx.fillStyle = Storm.convertHex(_obj.color, _obj["line_"+Storm.i].alpha*_obj.alpha);
			}
			_ctx.textAlign = _obj.align;	
			_ctx.textBaseline = "middle";

			if(_obj.shadowColor!=""){
				_ctx.shadowColor = _obj.shadowColor;
				_ctx.shadowBlur = _obj.shadowBlur;
				_ctx.shadowOffsetX = _obj.shadowOffsetX;
				_ctx.shadowOffsetY = _obj.shadowOffsetY;
			}
			if(_obj.stroke!=""){
				_ctx.lineWidth=_obj.lineWidth;
				_ctx.strokeStyle=_obj.stroke;
				_ctx.strokeText( _obj.textLines[Storm.i], 0, 0);
			}				
			_ctx.fillText(_obj.textLines[Storm.i], 0, 0);
			
			_ctx.scale(1/_obj["line_"+Storm.i].scaleX, 1/_obj["line_"+Storm.i].scaleY);
			_ctx.rotate(-_obj["line_"+Storm.i].rotation * Storm.toRAD );				
			_ctx.globalAlpha = _obj._alpha;
			_ctx.translate(-_obj["line_"+Storm.i].x, -_obj["line_"+Storm.i].y);
			_ctx.translate(0, -Storm.j);
		}
	}else if(_obj.video!="" && _obj.is_play==true){
		// Video
		_ctx.drawImage(_obj.video, 0, 0, _obj.width, _obj.height);
	}else if(_obj.graphics=="rect"){ 
		// Rectangle
		if(_obj.fill!=""){
			_ctx.fillStyle=_obj.fill;
			_ctx.fillRect(0, 0, _obj.width, _obj.height); 
		}
		if(_obj.stroke!=""){
			_ctx.beginPath();
			_ctx.lineWidth=_obj.lineWidth;
			_ctx.strokeStyle=_obj.stroke;
			_ctx.rect(0, 0, _obj.width, _obj.height); 
			_ctx.stroke();
		}
	}else if(_obj.graphics=="circle"){
		// Circle
		_ctx.beginPath();
		_ctx.arc(0, 0, _obj.radius, 0, 2 * Math.PI, false);
		 
		if(_obj.shadowColor!=""){
			_ctx.shadowColor = _obj.shadowColor;
			_ctx.shadowBlur = _obj.shadowBlur;
			_ctx.shadowOffsetX = _obj.shadowOffsetX;
			_ctx.shadowOffsetY = _obj.shadowOffsetY;
		}		
		if(_obj.fill!=""){
			_ctx.fillStyle=_obj.fill;
			_ctx.fill(); 
		}
		if(_obj.stroke!=""){
			_ctx.lineWidth=_obj.lineWidth;
			_ctx.strokeStyle=_obj.stroke;
			_ctx.stroke();
		}		
	}else if(_obj.pattern!=""){
		// Pattern
		_ctx.fillStyle=_ctx.createPattern(_obj.pattern, 'repeat');
		_ctx.fillRect(0, 0, _obj.width, _obj.height);	
	}else if(_obj.gradient!=""){
		// Gradient
		var tpgr = _ctx.createLinearGradient(0, 0, 0, _obj.height);
		tpgr.addColorStop(0,						"rgba("+_obj.gradient+", 1)");	
		tpgr.addColorStop((1-_obj.gradientScale),	"rgba("+_obj.gradient+", 1)");	
		tpgr.addColorStop(1,						"rgba("+_obj.gradient+", 0)");	
		_ctx.fillStyle=tpgr;
		_ctx.fillRect(0, 0, _obj.width, _obj.height);	
	}else if(_obj.bitmap!=""){
		// Bitmap
		
		if(_obj.shadowColor!=""){
			_ctx.shadowColor = _obj.shadowColor;
			_ctx.shadowBlur = _obj.shadowBlur;
			_ctx.shadowOffsetX = _obj.shadowOffsetX;
			_ctx.shadowOffsetY = _obj.shadowOffsetY;
		}
		
		for(Storm.i=0; Storm.i<_obj.repeatX; Storm.i++){
			for(Storm.j=0; Storm.j<_obj.repeatY; Storm.j++){
				if(_obj.effDistortionK==0){
					_ctx.drawImage(_obj.bitmap, -Math.round(_obj.bitmap.width/2)+_obj.bitmap.width*Storm.i, -Math.round(_obj.bitmap.height/2)+_obj.bitmap.height*Storm.j);
					
				}else{					
					for (Storm.i1 = 0; Storm.i1< _obj.effDistortionH; Storm.i1++)  {						
						_ctx.drawImage(
							_obj.bitmap, 
							
							0, 
							Math.round(Storm.i1 * _obj.height/_obj.effDistortionH), 
							
							Math.round(_obj.width), 
							Math.round(_obj.height/_obj.effDistortionH), 
							
							-Math.round(_obj.bitmap.width/2)+_obj.bitmap.width*Storm.i+_obj.effDistortion[Storm.i1]*_obj.effDistortionK, 
							-Math.round(_obj.bitmap.height/2)+_obj.bitmap.height*Storm.j+Storm.i1 * _obj.height/_obj.effDistortionH,
							
							Math.round(_obj.width), 
							Math.round(_obj.height/_obj.effDistortionH+0.5)
						);
						
					}
				}
			}
		}
		
		
	}else if(_obj.particles!=""){
		// Particles
		_ctx.scale(1/_obj._scaleX, 1/_obj._scaleY);
		
		for(Storm.i=0; Storm.i<_obj.quantity; Storm.i++){
			if(_obj.particle[Storm.i].isEnable==true){
				if(_obj.particle[Storm.i].visible){
					_ctx.save();
									
					//-				
					_ctx.translate(_obj.particle[Storm.i].x*_obj._scaleX, _obj.particle[Storm.i].y*_obj._scaleY);
					_ctx.rotate((_obj._rotation+_obj.particle[Storm.i].rotation) * Storm.toRAD );
					_ctx.globalAlpha = _obj._alpha*_obj.particle[Storm.i].alpha;				
					_ctx.scale(_obj._scaleX*_obj.particle[Storm.i].scaleX, _obj._scaleY*_obj.particle[Storm.i].scaleY);
					
					//-		
					if(Array.isArray(_obj.particles)==true){
						Storm.thisObj=_obj.particles[_obj.particle[Storm.i].graphicId];					
						_ctx.drawImage(Storm.thisObj, -Math.round(Storm.thisObj.width/2), -Math.round(Storm.thisObj.height/2));
					}else{
						_ctx.drawImage(_obj.particles, -Math.round(_obj.particles.width/2), -Math.round(_obj.particles.height/2));
					}
					
					_ctx.restore();
				}
			}
		}
	}
	
	return true;
}

// FOCUS

var visibilityChange = "visibilitychange";
if (typeof document.hidden !== "undefined"){
	hidden = "hidden";
	visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined"){
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined"){
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
}	
document.addEventListener(visibilityChange, canvasWidthChange, false);

function canvasWidthChange(){    
  	if (document[hidden]){	
		try{ TweenMax.pauseAll(true, true, false); }catch(e){}
	}else{
		try{ TweenMax.resumeAll(true, true, false); }catch(e){}	
	}	
}

// TEXT BLOCK (для измерения длинны текста)

function measureText(text, font) {
	text = text.replace(/<n>/g,"<br/>")	
	
	var w, h, div = measureText.div || document.createElement('div');
	div.style.font = font;
	div.style.padding = '0';
	div.style.margin = '0';
	div.style.position = 'absolute';
	div.style.visibility = 'hidden';
	div.innerHTML = text;
	if (!measureText.div){ document.body.appendChild(div); }
	w = div.clientWidth+10;
	h = div.clientHeight+10;
	measureText.div = div;
	
	if(w<Storm.stageWidth*1.5){w=Storm.stageWidth*1.5;}
	if(h<Storm.stageHeight*1.5){h=Storm.stageHeight*1.5;}
	
	return {width: w, height: h};
}