  import * as THREE from 'three'
  import RenderFs from './shader/render_fs.glsl'
  import RenderVs from './shader/render_vs.glsl'
  import SimulationFs from './shader/simulation_fs.glsl'
  import SimulationVs from './shader/simulation_vs.glsl'

  export default class Fbo {

    constructor( renderer, positions, opts = {} ) {

      this.renderer = renderer
      this.positions = positions
      this.gl = renderer.getContext()

      if (!this.gl.getExtension("OES_texture_float")){
          throw new Error( "float textures not supported" );
      }

      if( this.gl.getParameter(this.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0 ) {
          throw new Error( "vertex shader cannot read textures" );
      }

      this.opts = Object.assign({
        width: 256,
        height: 256,
        density: 1
      }, opts)

      this.startTime = this.timer = new Date()

      this.initRenderTarget()

      this.initVertice()

      this.initParticle()
      this.initSimulation()

      this.initScene()

    }

    /**
     * INIT
     * @return {[type]} [description]
     */
    initRenderTarget() {

      let { width, height, density } = this.opts

      let options = {
          minFilter: THREE.NearestFilter,//important as we want to sample square pixels
          magFilter: THREE.NearestFilter,//
          format: THREE.RGBFormat,//could be RGBAFormat
          type:THREE.FloatType//important as we need precise coordinates (not ints)
      }

      // WebGLRenderTarget:-
      // A render target is a buffer where the video card draws pixels
      // for a scene that is being rendered in the background. It is used in different effects.
      this.rtt = new THREE.WebGLRenderTarget( width, height, options )
    }


    /**
     * init vertices
     * @return {[type]} [description]
     */
    initVertice() {
      let { width, height, density } = this.opts

      this.positionTexture = new THREE.DataTexture( this.positions, width, height, THREE.RGBFormat, THREE.FloatType )
      this.positionTexture.needsUpdate = true
    }

    /**
     * INIT Particles Material and Geometry
     * @return {[type]} [description]
     */
    initParticle() {
      // Particle Material
      let partMaterial = new THREE.ShaderMaterial( {
          uniforms: {
              positions: { type: "t", value: null },
              pointSize: { type: "f", value: 2 }
          },
          vertexShader: RenderVs,
          fragmentShader: RenderFs,
          transparent: true,
          blending:THREE.AdditiveBlending
      })

      let { width, height, density } = this.opts
      let l = Math.ceil( width * height * density )
      // Simulation Vertices
      let vertices = new Float32Array( l * 3 )
      for ( var i = 0; i < l; i++ ) {
          var i3 = i * 3;
          vertices[ i3 ] = ( i % width ) / width
          vertices[ i3 + 1 ] = ( i / width ) / height
      }

      // Particle Geometry
      let partGeom = new THREE.BufferGeometry();
      partGeom.addAttribute( 'position',  new THREE.BufferAttribute( vertices, 3 ) )

      this.particles = new THREE.Points( partGeom, partMaterial )
    }

    /**
     * INIT Simulation Material and Geometry
     * @param  {[type]} vertices [description]
     * @return {[type]}          [description]
     */
    initSimulation() {
      // Material
      let simMaterial = new THREE.ShaderMaterial({
          uniforms: {
              positions: { type: "t", value: this.positionTexture },
              timer: { type: "f", value: 0.0 }
          },
          vertexShader: SimulationVs,
          fragmentShader:  SimulationFs
        })
      // Geometry
      let simGeom = new THREE.BufferGeometry()
      simGeom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([
        -1, -1, 0,
         1, -1, 0,
         1,  1, 0,
        -1, -1, 0,
         1,  1, 0,
        -1,  1, 0  ]), 3 ) )

      simGeom.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([
         0, 1, 1,
         1, 1, 0,
         0, 1, 1,
         0, 0, 0  ]), 2 ) )

      this.simulation = new THREE.Mesh( simGeom, simMaterial )
    }

    /**
     * INIT Scene
     * @return {[type]} [description]
     */
    initScene() {
      this.scene = new THREE.Scene()
      this.orthCam = new THREE.OrthographicCamera( -1 ,1, 1, -1, 1/Math.pow( 2, 53 ), 1 )
      this.scene.add( this.simulation )
    }


    tick() {
      this.timer = new Date() - this.startTime
      // this.particles.material.uniforms.position.value = thi
      this.simulation.material.uniforms.timer.value = this.timer
      this.particles.material.uniforms.positions.value = this.rtt.texture
    }

    update() {
      // -----------------------------------------------------------------
      // WebGLRenderer.render ( scene, camera, renderTarget, forceClear )
      // -----------------------------------------------------------------
      this.renderer.render( this.scene, this.orthCam, this.rtt, true )
      this.tick()
    }

  }
