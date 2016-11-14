uniform float iGlobalTime;
uniform sampler2D iChannel0;
uniform vec3 iResolution;
varying vec2 vUv;
varying vec2 fragCoord;


void main() {
  float pixelSize = abs(sin(iGlobalTime * 0.2)) * 10. + 1.;

  vec2 repositioned =  1.0 + fragCoord.xy / 2.0;
  vec2 q = gl_FragCoord.xy / iResolution.xy;

  vec2 offset = vec2(pixelSize / q.x, pixelSize / q.y);
  vec2 coord = vec2(offset.x * floor(vUv.x / offset.x), offset.y * floor(vUv.y / offset.y));

  gl_FragColor = texture2D(iChannel0, coord);

}
