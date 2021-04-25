precision mediump float;
varying vec2 vTexCoord;

// Get the normal from the vertex shader
varying vec3 vNormal;

void main() {
  // Normalize the normal
  vec3 c = vNormal*0.5 + 0.5;
  vec4 color = vec4(c.x, c.z, 0 ,1.0);
  vec4 screenCol = vec4(0.3, 0.3, 0, 1.0);
  // Lets just draw the texcoords to the screen
  gl_FragColor = 1.0 - (1.0-color) * (1.0-screenCol);
}
