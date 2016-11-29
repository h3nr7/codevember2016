varying vec2 vUv;
uniform float timer;
varying float noise;

#pragma glslify: pnoise = require('./classic3dnoise.glsl')

float turbulence( vec3 p ) {
    float w = 1000.0;
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }
    return t;
}

void main() {
    noise = 10.0 *  -.10 * turbulence( position + timer );
    vUv = vec2(uv.x, uv.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
