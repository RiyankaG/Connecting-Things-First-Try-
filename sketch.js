var face = [];
var position = {x:0, y:0};
var scale = 0;
var orientation = {x:0, y:0, z:0};
var mouthWidth = 0;
var mouthHeight = 0;
var eyebrowLeft = 0;
var eyebrowRight = 0;
var eyeLeft = 0;
var eyeRight = 0;
var jaw = 0;
var nostrils = 0;
var bg;
var img;
var capture;

function preload(){
	bg= loadImage("images/bg.jpg");
	img = loadImage("images/2.jpg");

}

function setup() {
	
	createCanvas(windowWidth, windowHeight);
	setupOsc(8338, 3334);
	
	// capture = createCapture(VIDEO);
	// capture.size(320,240);
	// capture.hide();
	//capture creates two different images and i am hiding one here//


	
}

function draw() {
	  background(bg);
	 // imageAlign(CORNERS);
	//   image(Capture, 0,0, 500, 400);

	// FACE_OUTLINE : 0 - 16
	// LEFT_EYEBROW : 17 - 21
	// RIGHT_EYEBROW : 22 - 26
	// NOSE_BRIDGE : 27 - 30
	// NOSE_BOTTOM : 31 - 35
	// LEFT_EYE : 36 - 41
	// RIGHT_EYE : 42 - 47
	// INNER_MOUTH : 48 - 59
	// OUTER_MOUTH : 60 - 65
	rectMode(CENTER);
	var mouth= map(mouthHeight, 1, 3, img);
	// fill ("white");
	// rect(position.x, position.y, mouth,mouth);

	//imageMode(CENTER);
	image(img, position.x-60, position.y-60, img.width/5, img.height/5);
}

function receiveOsc(address, value) {
	if (address == '/raw') {
		face = [];
		for (var i=0; i<value.length; i+=2) {
			face.push({x:value[i], y:value[i+1]});
		}
	}
	else if (address == '/pose/position') {
		position = {x:value[0], y:value[1]};
		// print(position);
	}
	else if (address == '/pose/scale') {
		scale = value[0];
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
		print(mouthHeight);
	}
	else if (address == '/gesture/eyebrow/left') {
		eyebrowLeft = value[0];
	}
	else if (address == '/gesture/eyebrow/right') {
		eyebrowRight = value[0];
	}
	else if (address == '/gesture/eye/left') {
		eyeLeft = value[0];
	}
	else if (address == '/gesture/eye/right') {
		eyeRight = value[0];
	}
	else if (address == '/gesture/jaw') {
		jaw = value[0];
	}
	else if (address == '/gesture/nostrils') {
		nostrils = value[0];
	}
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}