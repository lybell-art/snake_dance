let myCam;
let slider;

class snakeSegment{
	static length=50;
	static radius=8;
	constructor()
	{
		this.pos=new p5.Vector(0,0,0);
		this.dir=new p5.Vector(-90,-30,-40);
	}
	render()
	{
		push();
		translate(this.pos);
		rotateY(PI/5);
		rotateX(PI/12);
		translate(0,-snakeSegment.length / 2.0,0);
		cylinder(snakeSegment.radius, snakeSegment.length);
		pop();
		push();
		translate(this.dir);
		sphere(1);
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
		let z1=y*sinY + r*cosY;
//		if(z * z1 < 0) return;
		console.log(y, y1);
		
		let sinX=sinX1 * cosX2 + cosX1 * sinX2;
		let cosX=cosX1 * cosX2 - sinX1 * sinX2;
		
		this.pos.x=this.target.x + sinX*z1;
		this.pos.y=this.target.y + y1;
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
	screenTo3D(x, y)
	{
		let AxisZ=p5.Vector.sub(this.pos, this.target).normalize();
		let AxisX=p5.Vector.cross(AxisZ, createVector(0,1,0));
		let AxisY=p5.Vector.cross(AxisZ, AxisX);
		push();
		stroke("#ff0000");
		translate(AxisX.mult(10));
		sphere(3);
		pop();
		push();
		stroke("#0000ff");
		translate(AxisY.mult(10));
		sphere(3);
		pop();
	}
}

function matrixProj(x, y, z)
{
	const camera=myCam.camera;
	const camMat=camera.cameraMatrix.mat4;
	const projMat=camera.projMatrix.mat4;
	let x1=camMat[0]*x + camMat[1]*y + camMat[2]*z + camMat[3];
	let y1=camMat[4]*x + camMat[5]*y + camMat[6]*z + camMat[7];
	let z1=camMat[8]*x + camMat[9]*y + camMat[10]*z + camMat[11];
	let w1=camMat[12]*x + camMat[13]*y + camMat[14]*z + camMat[15];
	console.log("camMat : ", x1, y1, z1, w1);
	
	let x2=projMat[0]*x1 + projMat[1]*y1 + projMat[2]*z1 + projMat[3]*w1;
	let y2=projMat[4]*x1 + projMat[5]*y1 + projMat[6]*z1 + projMat[7]*w1;
	let z2=projMat[8]*x1 + projMat[9]*y1 + projMat[10]*z1 + projMat[11]*w1;
	let w2=projMat[12]*x1 + projMat[13]*y1 + projMat[14]*z1 + projMat[15]*w1;
	console.log("projMat : ", x2, y2, z2, w2);
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
//	seg.render();
	myCam.screenTo3D(0,0);
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
