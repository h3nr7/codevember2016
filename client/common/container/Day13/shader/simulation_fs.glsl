//basic simulation: displays the particles in place.
uniform sampler2D positions;
varying vec2 vUv;
uniform float timer;
varying float noise;


void main() {
  vec3 color = vec3( 1.0 * noise, 2.5 * noise, 3.5 * noise );
  vec3 pos = texture2D( positions, vUv ).rgb + color.rgb;
  gl_FragColor = vec4( pos, 1.0 );
}
