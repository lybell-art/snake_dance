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

class lybellP5Camera{
	constructor(eyeX=0, eyeY=0, eyeZ=(1920 / 2.0) / tan (PI * 30.0 / 180.0), targetX=0, targetY=0, targetZ=0)
	{
		this.pos=new p5.Vector(eyeX, eyeY, eyeZ);
		this.target=new p5.Vector(targetX, targetY, targetZ);
		this.dist=p5.Vector.sub(this.pos, this.target).mag();
		this.camera=createCamera(eyeX, eyeY, eyeZ, targetX, targetY, targetZ);
	}
	apply()
	{
		this.camera.camera(this.pos.x, this.pos.y, this.pos.z, this.target.x, this.target.y, this.target.z);
//		push();
//		translate(this.pos.x, this.pos.y, this.pos.z);
//		sphere(4);
//		pop();
	}
	initialize()
	{
		this.apply();
		setCamera(this.camera);
	}
	rotate(_x, _y)
	{
		let rad=PI*1.0/180.0;
		let x=this.pos.x-this.target.x;
		let y=this.pos.y-this.target.y;
		let z=this.pos.z-this.target.z;
		
		let a=sin(_x*rad); let b=cos(_x*rad);
		let x1=b*x + a*z;
		let z1=b*z - a*x;
		
		let c=sin(_y*rad); let d=cos(_y*rad);
		let y2=d*y - c*z1;
		let z2=c*y + d*z1;
		
		this.pos.x=this.target.x + x1;
		this.pos.y=this.target.y + y2;
		this.pos.z=this.target.z + z2;
		this.apply();
	}
}

function setup()
{
	createCanvas(windowWidth,windowHeight,WEBGL);
	debugMode();
	myCam=new lybellP5Camera(0, -100, 500, 0,0,0);
	myCam.initialize();
	
	slider = createSlider(-500, 500, 0);
	slider.position(10, 10);
}
function draw()
{
//	camera(0, -400, 0, 0,0,0);
	background(255);
	let seg=new snakeSegment();
	seg.render();
	myCam.rotate(1,0);
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
