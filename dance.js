let myCam;
let cobra;
let snakeHeadObj;

class snakeSegment{
	static length=50;
	static radius=8;
	constructor()
	{
		this.pos=new p5.Vector(0,0,0);
		this.dir=new p5.Vector(0,-1,0);
	}
	setPosition(x,y,z)
	{
		if(arguments.length === 1 && x instanceof p5.Vector) this.pos = x.copy();
		this.pos=new p5.Vector(x,y,z);
	}
	adjustPosition(pre)
	{
		this.pos=pre.pos.copy();
		this.pos.add(p5.Vector.mult(pre.dir.copy(), snakeSegment.length));
	}
	trace(p)
	{
		let target=p.copy();
		this.dir=p5.Vector.add(p5.Vector.mult(this.dir, -0.2), p5.Vector.sub(target,this.pos).normalize().mult(1.2));
		this.dir.normalize();
		return target.sub(p5.Vector.mult(this.dir, snakeSegment.length)).copy();
	}
	render(head=false)
	{
		push();
//		fill(100,147,30);
		translate(this.pos);
		if(this.dir.x != 0 || this.dir.z != 0) rotateY( Math.atan2 ( -this.dir.x , -this.dir.z ));
		rotateX( Math.acos(-this.dir.y / this.dir.mag()) );
		translate(0,-snakeSegment.length / 2.0,0);
		if(head) model(snakeHeadObj);
		else cylinder(snakeSegment.radius, snakeSegment.length);
		pop();
	}
}

class snakeSystem{
	constructor(len)
	{
		this.length=len;
		this.segments=[];
		for(var i=0; i<len; i++) this.segments[i]=new snakeSegment();
		this.segments[len-1].setPosition(0,0,0);
	}
	followSegment(pos)
	{
		let target = this.segments[0].trace(pos);
		for(var i=1; i<this.length; i++)
		{
			target = this.segments[i].trace(target);
//			console.log(target);
		}
		for(var i=this.length-1; i>=1; i--)
		{
			this.segments[i-1].adjustPosition(this.segments[i]);
		}
	}
	render()
	{
		for(var i=0;i<this.length;i++)
		{
			this.segments[i].render(i == 0);
		}
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

function preload() {
	snakeHeadObj=loadModel('assets/snakehead.obj');
}

function setup()
{
	createCanvas(windowWidth,windowHeight,WEBGL);
	myCam=new lybellP5Camera(0, -250, 500, 0,0,0);
//	myCam=new lybellP5Camera(0, 0, -(height / 2.0) / tan (PI * 30.0 / 180.0), 0,0,0);
	myCam.initialize();
	cobra=new snakeSystem(10);
	noStroke();
}
function draw()
{
	background(248,168,17);
	if (keyIsDown(UP_ARROW) || keyIsDown(87) ) myCam.rotate(0,1); //W
	if (keyIsDown(DOWN_ARROW) || keyIsDown(83) ) myCam.rotate(0,-1); //S
	if (keyIsDown(LEFT_ARROW) || keyIsDown(65) ) myCam.rotate(-1,0); //A
	if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) ) myCam.rotate(1,0); //D
	fill(88,33,14);
	circle(0,0, 800);
	lights();
/*	shininess(15);
	ambientLight(85,85,0);
	directionalLight(240, 0, 0, 6, 1, 0);
//	pointLight(240, 240, 0, 300, -800, -300);
	directionalLight(0, 240, 0, -6, 1, 0);
	specularMaterial(192);*/
	ambientLight(50);
	specularColor(255, 0, 0);
	pointLight(255, 0, 0, 0, -800, cos(0)*100);
//	specularColor(0, 255, 0);
//	pointLight(0, 255, 0, sin(PI/3)*100, -300, cos(PI/3)*100);
//	specularColor(255, 255, 0);
//	pointLight(255, 255, 0, sin(PI*2/3)*100, -300, cos(PI*2/3)*100);
	specularMaterial(255);
	let mousePos=myCam.screenTo3D(mouseX - windowWidth/2,mouseY - windowHeight/2,0.2);
	cobra.followSegment(mousePos);
	cobra.render();
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
