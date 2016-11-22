import * as THREE from 'three'

export default class TestFbo {

  constructor( width, height, renderer, simulationMaterial, points, scene) {

    this.renderer = renderer
    this.particles = null
    this.gl = renderer.getContext()
    this.simulationMaterial = simulationMaterial
    this.width = width
    this.height = height
    this.points = points
    this.scene = scene


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
    let geom = new THREE.BufferGeometry()
    geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([
        -1, -1, 0,
         1, -1, 0,
         1,  1, 0,
        -1, -1, 0,
         1,  1, 0,
        -1,  1, 0  ]), 3 ) )
    geom.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([
         0, 1, 1,
         1, 1, 0,
         0, 1, 1,
         0, 0, 0  ]), 2 ) )

    this.scene.add( new THREE.Mesh( geom, this.simulationMaterial ) )
  }

  initGeom() {

    let { width, height, points } = this
    this.spheres = []
    //6 the particles:
    //create a vertex buffer of size width * height with normalized coordinates
    let l = points.length * 3
    let vertices = new Float32Array( l )

    for(let i = 0; i < l; i+=3) {
      let j = i / 3
      let v = points[j]
      let sphereGeom = new THREE.SphereGeometry(100, 8, 8)
      let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: false})
      this.spheres[j] = new THREE.Mesh(sphereGeom, sphereMaterial)
      this.spheres[j].position.x = v.x
      this.spheres[j].position.y = v.y
      this.spheres[j].position.z = v.z

      for(let j = 0; j < 3; j++) {
        vertices[i] = v.x
        vertices[i + 1] = v.y
        vertices[i + 2] = v.z
      }

      this.scene.add(this.spheres[j])
    }

  }


  update() {
    this.renderer.render( this.scene, this.orthCam, this.rtt, true)

    console.log(this.rtt.texture)
  }

}
