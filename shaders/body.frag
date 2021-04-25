precision mediump float;
varying vec2 vTexCoord;

// Get the normal from the vertex shader
varying vec3 vNormal;

void main() {
  // Normalize the normal
  vec3 color = vNormal*0.5 + 0.5;
  // Lets just draw the texcoords to the screen
  gl_FragColor = vec4(max(color.x, 0.3), max(color.z, 0.3), 0 ,1.0);
}
