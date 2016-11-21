varying vec2 vUv;
uniform float targetWidth;
uniform float targetHeight;
uniform float mixAmount;

void main() {
  vUv = uv;
  float gWidth = targetWidth * mixAmount;
  float gHeight = targetHeight * mixAmount;
  vec3 goalPos = vec3( 0.0, gHeight * uv.y, -uv.x * gWidth ) + vec3( 0.0, -gHeight / 2.0, gWidth / 2.0);
  vec3 newPos = mix( position, goalPos, mixAmount );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
  
}
