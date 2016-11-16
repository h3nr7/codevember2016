import React, { Component } from 'react'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import EarthObj from 'lib/EarthObj'
import ParticleObj from 'lib/ParticleObj'

export default class Day extends BasicThreeWithCam {

  constructor() {
    super({
      hasLight: true,
      lightIntensity: 1.5,
      zoomMin: 350
     })

     this.stopFrame = false


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


  }

  tick() {
    super.tick()

    if(this.texture) this.texture.needsUpdate = true

    if(this.par) this.par.animate()
    this.earth.animate()
  }

  _earthLoaded(evt) {
    this.scene.add(this.earth.group)

    this.earth.addCity()
    // this.earth.addCity({ name: 'paris', lat:	48.864716, lng: 2.349014})
    this.earth.addCity({ name: 'hong kong', lat:	22.286394, lng: 114.149139})
    // this.earth.addCity({ name: 'new york', lat: 40.792240, lng:	-73.138260})
    // this.earth.addCity({ name: 'beijing', lat: 39.913818, lng:	116.363625})
    // this.earth.addCity({ name: 'mumbai', lat: 19.075984, lng:	72.877656})
    // this.earth.addCity({ name: 'milan', lat: 45.464211, lng: 	9.191383 })
    // this.earth.addCity({ name: 'brazillia', lat: -14.235004, lng: -51.925280 })

    let london = this.earth.getCity('london')
    // let paris = this.earth.getCity('paris')
    let hk = this.earth.getCity('hong kong')
    // let newyork = this.earth.getCity('new york')
    // let beijing = this.earth.getCity('beijing')
    // let sydney = this.earth.getCity('mumbai')
    // let milan = this.earth.getCity('milan')
    // let brazillia = this.earth.getCity('brazillia')



    this.par = new ParticleObj(london.position, hk.position)
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
        onMouseMove={this.mouseMove}>

      </div>
    )
  }
}
