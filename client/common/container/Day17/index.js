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
      isRotating: false,
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
    this.randomData = this.getSphere(width * height, 32 )

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
          attractorPos: { type: "v3", value: new THREE.Vector3(0,0,0) }
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
    this.earth.animate()

    this.simulationShader.uniforms.timer.value += 0.01
    this.simulationShader.uniforms.amplitude.value = 96 + 96 * Math.sin(this.simulationShader.uniforms.timer.value)
    this.simulationShader.uniforms.frequency.value = 0.1 * (1 - Math.cos(this.simulationShader.uniforms.timer.value))
    if(this.par) this.simulationShader.uniforms.attractorPos.value = this.par.attractorMesh.position
    this.fbo.update()
  }

  _earthLoaded(evt) {
    this.scene.add(this.earth.group)

    this.earth.addCity()
    this.earth.addCity({ name: 'hong kong', lat:	22.286394, lng: 114.149139})

    let london = this.earth.getCity('london')
    let hk = this.earth.getCity('hong kong')




    this.par = new ParticleObj(london.position, hk.position, { closed: true })
    this.earth.group.add(this.par.group)
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
