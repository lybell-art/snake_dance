let myCam;
let slider;

class snakeSegment{
	static length=50;
	static radius=8;
	constructor()
	{
		this.pos=new p5.Vector(0,0,0);
		this.dir=new p5.Vector(0,-200,0);
	}
	trace(p)
	{
		this.dir=p;
	}
	render()
	{
		push();
		translate(this.pos);
		if(this.dir.x != 0 || this.dir.z != 0) rotateY( Math.atan2 ( -this.dir.x , -this.dir.z ));
		rotateX( Math.acos(-this.dir.y / this.dir.mag()) );
		translate(0,-snakeSegment.length / 2.0,0);
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
		push();
		translate(this.pos);
		sphere(10);
		pop();
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
		
		let r=Math.sqrt(x*x + z*z);
		
		let sinY=sin(_y*rad); let cosY=cos(_y*rad);
		let sinX1=x/r; let cosX1=z/r;
		let sinX2=sin(_x*rad); let cosX2=cos(_x*rad);
		
		let y1=y*cosY - r*sinY;
		let z1=r;
		if(Math.abs((y-y1) / this.dist) >= 0.002) z1=y*sinY + r*cosY;
		
		let sinX=sinX1 * cosX2 + cosX1 * sinX2;
		let cosX=cosX1 * cosX2 - sinX1 * sinX2;
		
		this.pos.x=this.target.x + sinX*z1;
		if(Math.abs((y-y1) / this.dist) >= 0.002) this.pos.y=this.target.y + y1;
		this.pos.z=this.target.z + cosX*z1;
		this.apply();
	}
	zoom(_z)
	{
		let sub=p5.Vector.sub(this.pos, this.target);
		this.dist *= pow(1.0002,_z);
		sub.setMag(this.dist);
		this.pos = p5.Vector.add(sub, this.target);
		this.apply();
	}
	screenTo3D(x, y, depth=1)
	{
		const AxisZ=p5.Vector.sub(this.pos, this.target).normalize();
		const AxisX=p5.Vector.cross(createVector(0,1,0), AxisZ).normalize();
		const AxisY=p5.Vector.cross(AxisZ, AxisX).normalize();
		const baseLen=this.camera.defaultEyeZ;
		let baseO=p5.Vector.add(this.pos, p5.Vector.mult(AxisZ, -baseLen*depth));
		baseO.add(p5.Vector.mult(AxisX, x*depth));
		baseO.add(p5.Vector.mult(AxisY, y*depth));
		return baseO;
	}
}

function setup()
{
	createCanvas(windowWidth,windowHeight,WEBGL);
	debugMode();
//	myCam=new lybellP5Camera(0, -125, 250, 0,0,0);
	myCam=new lybellP5Camera(0, 0, -(height / 2.0) / tan (PI * 30.0 / 180.0), 0,0,0);
	myCam.initialize();
	
	slider = createSlider(-500, 500, 0);
	slider.position(10, 10);
}
function draw()
{
//	camera(0, -400, 0, 0,0,0);
	background(255);
	if (keyIsDown(UP_ARROW) || keyIsDown(87) ) myCam.rotate(0,1); //W
	if (keyIsDown(DOWN_ARROW) || keyIsDown(83) ) myCam.rotate(0,-1); //S
	if (keyIsDown(LEFT_ARROW) || keyIsDown(65) ) myCam.rotate(-1,0); //A
	if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) ) myCam.rotate(1,0); //D
	let seg=new snakeSegment();
	let mousePos=myCam.screenTo3D(mouseX - windowWidth/2,mouseY - windowHeight/2,0.2);
	seg.trace(mousePos);
	seg.render(slider.value());
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
