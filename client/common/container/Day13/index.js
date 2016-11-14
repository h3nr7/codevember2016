import React, { Component } from 'react'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import Fbo from './Fbo'
import RenderFs from './shader/render_fs.glsl'
import RenderVs from './shader/render_vs.glsl'
import SimulationFs from './shader/simulation_fs.glsl'
import SimulationVs from './shader/simulation_vs.glsl'


export default class Day extends BasicThreeWithCam {

  constructor() {
    super()
  }

  componentWillMount() {
    super.componentWillMount()

    this.fboSettings = {
      width: 256,
      height: 256
    }

    this.randomData = (( width, height, size ) => {
      let len = width * height * 3
      let data = new Float32Array( len )
      while( len-- )data[len] = ( Math.random() -.5 ) * size
      return data
    })(this.fboSettings.width, this.fboSettings.height, 256)

  }

  componentDidMount() {
    super.componentDidMount()
  }

  init() {
    super.init()

    let { width, height } = this.fboSettings
    let positions = new THREE.DataTexture( this.randomData, width, height, THREE.RGBFormat, THREE.FloatType );
    positions.needsUpdate = true;

    let simulationShader = new THREE.ShaderMaterial({
      uniforms: {
          positions: { type: "t", value: positions }
      },
      vertexShader: SimulationVs,
      fragmentShader:  SimulationFs
    })

    let renderShader = new THREE.ShaderMaterial( {
        uniforms: {
            positions: { type: "t", value: null },
            pointSize: { type: "f", value: 2 }
        },
        vertexShader: RenderVs,
        fragmentShader: RenderFs,
        transparent: true,
        blending:THREE.AdditiveBlending
    } );

    this.fbo = new Fbo(width, height, this.renderer, simulationShader, renderShader)
    this.scene.add( this.fbo.particles )

  }

  tick() {
    super.tick()

    this.fbo.update()
    this.fbo.particles.rotation.x += Math.PI / 180 * .5
    this.fbo.particles.rotation.y -= Math.PI / 180 * .5
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
