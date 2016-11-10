uniform float percent;
uniform sampler2D texture;
varying vec2 vUv;

void main() {

  vec4 tex = texture2D( texture, vUv );
  float blackness = (tex.r + tex.g + tex.b) / 3.0;

  gl_FragColor = vec4(tex.r, tex.g, tex.b, 0.75 * blackness);

  // if(tex.a - percent < 0.0) {
  //     gl_FragColor.a = 0.0;
  //     //or without transparent = true use
  //     discard;
  // }

}
