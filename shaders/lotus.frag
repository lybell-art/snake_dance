#define PI 3.1415926538
#define BLACK vec4(0.1,0.0,0.0,1.0)

precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform float ampLevel;

//out vec4 outColor;

float myRound(float a)
{
	return floor(a+0.5);
}
float map(float value, float min1, float max1, float min2, float max2) {
	return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec4 mandala1(float dist, float angle, float t, vec4 color)
{
	float graph = 0.2* (1.0 - abs(sin(t+PI/2.0))*pow(cos(angle*6.0), 8.0));
	bool isOut = (graph - dist) > 0.0;
	return isOut ? mix(color, BLACK, (graph - dist)*6.0) : BLACK;
}

vec4 mandala2(float dist, float angle, vec4 color)
{
	float graph = 0.25;
	bool isOut = (graph - dist) > 0.0;
	return isOut ? mix(color, BLACK, clamp((graph - dist)*16.0,0.0,1.0)) : BLACK;
}

vec4 mandala3(float dist, float angle, float t, vec4 color)
{
	float graph = 0.01* cos(angle*36.0) * sin(t) + 0.3;
	bool isOut = (graph - dist) > 0.0;
	return isOut ? mix(color, BLACK, (graph - dist)*16.0) : BLACK;
}

vec4 mandala4(float dist, float angle, float t, vec4 color)
{
	float graph = 2.0 + (abs(cos(angle*3.0)))+(sin(t)-(abs(cos(angle*3.0+PI/2.0)))*2.0)/(2.0+abs(cos(angle*6.0+PI/2.0))*8.0)*sin(t);
	graph *= 0.2;
	bool isOut = (graph - dist) > 0.0;
	return isOut ? mix(color, BLACK, (graph - dist)*4.0) : BLACK;
}

vec4 mandala5(float dist, float angle, float t, vec4 color)
{
	float graph = 2.0 + (abs(cos(angle*6.0)))*sin(t)+(1.5-(abs(cos(angle*3.0+PI/2.0)))*2.0)/(2.0+abs(cos(angle*6.0+PI/2.0))*8.0);
	graph *= 0.05;
	graph +=0.3;
	bool isOut = (graph - dist) > 0.0;
	return isOut ? mix(color, BLACK, (graph - dist)*4.0) : BLACK;
}

vec4 circles(vec2 uv, float rotation, float d, float r, int cnt, vec4 color)
{
	float cnt_ = float(cnt);
	float angle = atan(uv.x, uv.y);
//	float angle = PI*(-70.0)/180.0;
	float baseAngle= PI*2.0/cnt_;
//	float baseAngle = PI*2.0/4.0;
	float targetAngle=baseAngle*myRound((angle-rotation)/baseAngle) + rotation;
	vec2 targetPt = vec2(d*sin(targetAngle), d*cos(targetAngle));
	float dist = length(targetPt-uv);

//	return mix(color, BLACK, dist);	
	bool isOut = (r - dist) > 0.0;
	return isOut ? color : BLACK;
}

void main()
{
	vec2 uv = ((gl_FragCoord.xy + 1.0)* 0.5)/uResolution;
//	vec2 uv = gl_FragCoord.xy/uResolution;
	uv = (uv - 0.5)*2.0;
	float fractTime = fract(uTime/2.0);
	float dist = length(uv);
	float ampApply = map(ampLevel,0.0,0.5,0.7,1.3);
	float angle= atan(uv.y, uv.x) * 1.0 + uTime;
	vec4 black = vec4(0.0,0.0,0.0,1.0);
	vec4 col1 = mandala1(dist, angle, ampLevel, vec4(0.0,0.54,0.57,1.0));
	vec4 col2 = mandala2(dist, angle, vec4(0.25,0.1,0.45,1.0));
	vec4 col3 = mandala3(dist, angle, uTime, vec4(0.8,0.2,0.5,1.0));
	vec4 col4 = mandala4(dist*ampApply, angle, uTime, vec4(1.0,0.4,0.8,1.0));
	vec4 col5 = mandala5(dist*ampApply, angle, uTime, vec4(1.0,0.7,0.2,1.0));
	vec4 col6 = circles(uv, uTime, 0.5, 0.02, 12, vec4(1.0,0.8,0.0,1.0));
	vec4 col7 = circles(uv, uTime, 0.1, 0.01, 12, vec4(1.0,0.8,0.0,1.0));
	vec4 col8 = circles(uv, uTime, 0.5, 0.01, 24, vec4(0.0,0.8,0.4,0.5));
	vec4 outCol = 1.0-(1.0-col1)*(1.0-col2)*(1.0-col3)*(1.0-col4)*(1.0-col5)*(1.0-col6)*(1.0-col7)*(1.0-col8);
	gl_FragColor = vec4(outCol.xyz, dist<1.0 ? 1.0 : 0.0);
}
