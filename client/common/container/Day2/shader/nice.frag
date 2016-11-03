// varying vec2 vUv;
//
// float random( vec3 scale, float seed ){
//     return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
// }
//
// void main() {
//
//   float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
//   vec2 tPos = vec2( 0, 1.0 - 1.3 * noise + r );
//
//   // colour is RGBA: u, v, 0, 1
//   gl_FragColor = vec4( vec3( vUv, 0. ), 1. );
//
// }

varying float noise;

void main() {

    // compose the colour using the UV coordinate
    // and modulate it with the noise like ambient occlusion
    vec3 color = vec3( 1.0 * noise, 0.2196 * noise, 0.1725 * noise );
    gl_FragColor = vec4( color.rgb, 1.0 );

}


// void main() {
//
//     // get a random offset
//     float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
//     // lookup vertically in the texture, using noise and offset
//     // to get the right RGB colour
//     vec2 tPos = vec2( 0, 1.0 - 1.3 * noise + r );
//     vec4 color = texture2D( tExplosion, tPos );
//
//     gl_FragColor = vec4( color.rgb, 1.0 );
//
// }
