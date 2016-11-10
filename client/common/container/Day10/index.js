import React, { Component } from 'react'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import EarthObj from 'lib/EarthObj'

export default class Day extends BasicThreeWithCam {

  constructor() {
    super()
  }

  componentWillMount() {
    super.componentWillMount()
  }

  componentDidMount() {
    super.componentDidMount()

    // Create Earth
    this.earth = new EarthObj({
      isRotating: false,
      onLoadComplete: this.earthLoadComplete.bind(this)
    })
    this.earth.load()
  }

  earthLoadComplete(dat) {
    this.scene.add(dat.group)

    console.log(this.earth.earthUniform, this.gui)

    this.gui.add(this.earth.earthUniform.mixAmount, 'value', 0, 1)

    console.log(this.earth.getVectorByLatLng(51.509865, -0.118092))
  }


  tick() {
    super.tick()
    if(this.earth) this.earth.animate()
  }

  render() {
    return(
      <div ref = { c => { this.container = c }}
        className="day__container"
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onWheel={this.mouseWheel}
        onMouseOut={this.mouseUp}
        onMouseMove={this.mouseMove}>      </div>
    )
  }
}
