import React, { Component } from 'react'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import Fbo from './Fbo'
import EarthObj from 'lib/EarthObj'
import ParticleObj from 'lib/ParticleObj'
import RenderFs from './shader/render_fs.glsl'
import RenderVs from './shader/render_vs.glsl'
import SimulationFs from './shader/simulation_fs.glsl'
import SimulationVs from './shader/simulation_vs.glsl'

export default class Day extends BasicThreeWithCam {

  constructor() {
    super({
      hasLight: true,
      lightIntensity: 1.5,
      zoomMin: 350
     })

     this.stopFrame = false

     this.fboSettings = {
       width: 256,
       height: 256
     }

  }

  componentWillMount() {
    super.componentWillMount()

    this.earth = new EarthObj({
      earthSize: 300,
      citySize: 1,
      isRotating: true,
      visible: false,
      onLoadComplete: this._earthLoaded.bind(this)
    })

  }


  init(){
    this.earth.load()
    super.init()

    // this.randomData = (( width, height, size ) => {
    //     let len = width * height * 3
    //     let data = new Float32Array( len )
    //     while( len-- ) data[len] = ( Math.random() -.5 ) * size
    //     return data
    //   })(this.fboSettings.width, this.fboSettings.height, 256)

    let { width, height } = this.fboSettings
    this.randomData = this.getSphere(width * height, 16 )

    this.initFbo()
  }

  getPoint(v,size) {
    //the 'discard' method, not the most efficient
    v.x = Math.random() * 2 - 1 ;
    v.y = Math.random() * 2 - 1 ;
    v.z = Math.random() * 2 - 1 ;
    if(v.length()>1) return this.getPoint(v,size);
    return v.normalize().multiplyScalar(size);
  }

  getSphere( count, size ){

      var len = count * 3;
      var data = new Float32Array( len );
      var p = new THREE.Vector3();
      for( var i = 0; i < len; i+=3 )
      {
          this.getPoint( p, size );
          data[ i     ] = p.x;
          data[ i + 1 ] = p.y;
          data[ i + 2 ] = p.z;
      }
      return data;
  }

  initFbo() {
    let { width, height } = this.fboSettings
    let positions = new THREE.DataTexture( this.randomData, width, height, THREE.RGBFormat, THREE.FloatType )
    positions.needsUpdate = true

    this.simulationShader = new THREE.ShaderMaterial({
      uniforms: {
          positions: { type: "t", value: positions },
          timer: { type: "f", value: 0},
          frequency: { type: "f", value: 0.01 },
          amplitude: { type: "f", value: 192 },
          maxDistance: { type: "f", value: 96 },
          timer: { type: "f", value: 0.0},
          attractorPos: { type: "v3", value: new THREE.Vector3(0,0,0) },
          attractorPos2: { type: "v3", value: new THREE.Vector3(0,0,0) },
          attractorPos3: { type: "v3", value: new THREE.Vector3(0,0,0) }
      },
      vertexShader: SimulationVs,
      fragmentShader:  SimulationFs
    })

    this.renderShader = new THREE.ShaderMaterial({
        uniforms: {
            positions: { type: "t", value: null },
            pointSize: { type: "f", value: 2 }
        },
        vertexShader: RenderVs,
        fragmentShader: RenderFs,
        transparent: true,
        blending:THREE.AdditiveBlending
    })

    this.fbo = new Fbo(width, height, this.renderer, this.simulationShader, this.renderShader)
    this.scene.add( this.fbo.particles )


  }

  tick() {
    super.tick()

    if(this.par) this.par.animate()
    if(this.par2) this.par2.animate()
    if(this.par3) this.par3.animate()
    this.earth.animate()

    this.simulationShader.uniforms.timer.value += 0.0001
    this.simulationShader.uniforms.amplitude.value = 192 - 96 * Math.sin(this.simulationShader.uniforms.timer.value)
    this.simulationShader.uniforms.frequency.value = 17 - 8.0 * (0.5 + 0.5 * Math.cos(this.simulationShader.uniforms.timer.value))
    if(this.par) this.simulationShader.uniforms.attractorPos.value = this.par.attractorMesh.position
    if(this.par2) this.simulationShader.uniforms.attractorPos2.value = this.par2.attractorMesh.position
    if(this.par3) this.simulationShader.uniforms.attractorPos3.value = this.par3.attractorMesh.position
    this.fbo.update()
  }

  _earthLoaded(evt) {
    this.scene.add(this.earth.group)

    this.earth.addCity()
    this.earth.addCity({ name: 'hong kong', lat:	22.286394, lng: 114.149139})
    this.earth.addCity({ name: 'hong kong', lat:	22.286394, lng: 114.149139})
    this.earth.addCity({ name: 'somewhere', lat: 	33.865143, lng:	151.209900})
    this.earth.addCity({ name: 'elsewhere', lat: 40.792240, lng:	-73.138260})

    let london = this.earth.getCity('london')
    let hk = this.earth.getCity('hong kong')
    let somewhere = this.earth.getCity('somewhere')
    let elsewhere = this.earth.getCity('elsewhere')



    this.par = new ParticleObj(london.position, hk.position, { duration: 4.0 })
    this.par2 = new ParticleObj(somewhere.position, elsewhere.position, { duration: 16 })
    this.par3 = new ParticleObj(somewhere.position, london.position, { duration: 32 })

    // this.earth.group.add(this.par.group)
    // this.earth.group.add(this.par2.group)
    // this.earth.group.add(this.par3.group)

  }


  render() {

    return(
      <div ref = { c => { this.container = c }}
        className="day__container"
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onWheel={this.mouseWheel}
        onMouseOut={this.mouseUp}
        onMouseMove={this.mouseMove}>
      </div>
    )
  }
}
