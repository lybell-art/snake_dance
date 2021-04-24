let myCam;
let slider;

class snakeSegment{
	static length=40;
	static radius=10;
	constructor()
	{
		this.pos=new p5.Vector(0,0,0);
		this.theta=0;
		this.phi=0;
	}
	render()
	{
		push();
		translate(this.pos);
		cylinder(snakeSegment.radius, snakeSegment.length);
		pop();
	}
}

function setup()
{
	createCanvas(windowWidth,windowHeight,WEBGL);
	debugMode();
	myCam=createCamera();
	setCamera(myCam);
	slider = createSlider(-500, 500, 0);
	slider.position(10, 10);
}
function draw()
{
	background(255);
	let seg=new snakeSegment();
	seg.render();
	myCam.setPosition(0,slider.value(),(height / 2.0) / tan (PI * 30.0 / 180.0));
}

/*
function windowResized()
{
	resizeCanvas(windowWidth, windowHeight, false);
	myCam.setPosition(cameraPos.eyeX,cameraPos.eyeY,cameraPos.eyeZ);
	myCam.lookAt(cameraPos.centerX,cameraPos.centerY,cameraPos.centerZ);
}
function mouseWheel(event) { //zoom
	let e = event.delta;
	myCam.move(0,0, e * 0.1);
	cameraPos=extractCameraPos(myCam); //for screen size consistency
}
function keyPressed() {
	switch(keyCode)
	{
		case LEFT_ARROW:
			showPottery.set(-1);
			break;
		case RIGHT_ARROW:
			showPottery.set(1);
			break;
		case 90://Z
			darkMode=!darkMode;
			break;
	}
}
function extractCameraPos(cam) //for screen size consistency
{
	if(cam)
	{
		return {eyeX:cam.eyeX, eyeY:cam.eyeY, eyeZ:cam.eyeZ, centerX:cam.centerX, centerY:cam.centerY, centerZ:cam.centerZ};
	}
	else return {eyeX:0, eyeY:0, eyeZ:(height/2.0) / tan(PI*30.0 / 180.0), centerX:0, centerY:0, centerZ:0};
}
*/
