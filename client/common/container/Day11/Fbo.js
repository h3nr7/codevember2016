import * as THREE from 'three'

export default class Fbo {

  constructor( width, height, renderer, simulationMaterial, renderMaterial) {

    this.renderer = renderer
    this.renderMaterial = renderMaterial
    this.particles = null
    this.gl = renderer.getContext()
    this.simulationMaterial = simulationMaterial
    this.renderMaterial = renderMaterial
    this.width = width
    this.height = height

    //1 we need FLOAT Textures to store positions
    //https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/extensions/oes-texture-float.html
    if (!this.gl.getExtension("OES_texture_float")){
        throw new Error( "float textures not supported" );
    }

    //2 we need to access textures from within the vertex shader
    //https://github.com/KhronosGroup/WebGL/blob/90ceaac0c4546b1aad634a6a5c4d2dfae9f4d124/conformance-suites/1.0.0/extra/webgl-info.html
    if( this.gl.getParameter(this.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0 ) {
        throw new Error( "vertex shader cannot read textures" );
    }

    this.scene = new THREE.Scene()
    this.orthCam = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1 )

    //4 create a target texture
    let options = {
        minFilter: THREE.NearestFilter,//important as we want to sample square pixels
        magFilter: THREE.NearestFilter,//
        format: THREE.RGBFormat,//could be RGBAFormat
        type:THREE.FloatType//important as we need precise coordinates (not ints)
    };

    this.rtt = new THREE.WebGLRenderTarget( width, height, options );

    this.initSimulation()
    this.initGeom()

  }

  initSimulation() {
    //5 the simulation:
    //create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
    let geom = new THREE.BufferGeometry();
    geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([   -1,-1,0, 1,-1,0, 1,1,0, -1,-1, 0, 1, 1, 0, -1,1,0 ]), 3 ) );
    geom.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([   0,1, 1,1, 1,0,     0,1, 1,0, 0,0 ]), 2 ) );
    this.scene.add( new THREE.Mesh( geom, this.simulationMaterial ) );

  }

  initGeom() {

    let { width, height } = this


    //6 the particles:
    //create a vertex buffer of size width * height with normalized coordinates
    let l = ( width * height );
    let vertices = new Float32Array( l * 3 );
    for ( var i = 0; i < l; i++ ) {

        var i3 = i * 3;
        vertices[ i3 ] = ( i % width ) / width ;
        vertices[ i3 + 1 ] = ( i / width ) / height;
    }

    //create the particles geometry
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position',  new THREE.BufferAttribute( vertices, 3 ) );

    this.particles = new THREE.Points( geometry, this.renderMaterial )
  }


  update() {
    this.renderer.render( this.scene, this.orthCam, this.rtt, true)
    this.particles.material.uniforms.positions.value = this.rtt.texture
  }

}
