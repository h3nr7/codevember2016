varying vec2 vUv;
varying vec2 fragCoord;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  fragCoord = vec2(gl_Position.x, gl_Position.y);
}
