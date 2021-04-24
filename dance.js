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
	zoom(_z)
	{
		let sub=p5.Vector.sub(this.pos, this.target);
		this.dist *= pow(1.002,_z);
		this.sub.setMag(this.dist);
		this.pos = po.Vector.add(this.sub, this.target);
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
	if (keyIsDown(UP_ARROW) || keyIsDown(87) ) myCam.rotate(0,1); //W
	if (keyIsDown(DOWN_ARROW) || keyIsDown(83) ) player.move(0,-1); //S
	if (keyIsDown(LEFT_ARROW) || keyIsDown(65) ) player.move(-1,0); //A
	if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) ) player.move(1,0); //D
	let seg=new snakeSegment();
	seg.render();
}


function windowResized()
{
	resizeCanvas(windowWidth, windowHeight, false);
	myCam.apply();
}
function mouseWheel(event) { //zoom
	let e = event.delta;
	myCam.zoom(e);
}
