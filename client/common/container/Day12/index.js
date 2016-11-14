import React, { Component } from 'react'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import PixelFrag from './shader/pixelate.frag'
import PixelVert from './shader/pixelate.vert'

export default class Day extends BasicThreeWithCam {

  constructor() {
    super()
    this.initTime = Date.now()
    this.clock = new THREE.Clock();
  }


  componentWillMount() {
    super.componentWillMount()

    this.uniforms = {
      iGlobalTime: { type:'f', value: 1.0 },
      iResolution: { type:'v2', value: new THREE.Vector3(1/4, 1/2) },
      iChannel0: { type:'t', value:null }
    }
  }

  componentDidMount() {
    super.componentDidMount()

  }

  init() {
    super.init()

    this.loadingManager = new THREE.LoadingManager()
    this.textureLoader = new THREE.TextureLoader(this.loadingManager)
    this.loadingManager.onLoad = this._loadHandler.bind(this)

    this.textureLoader.load('/public/texture/test_img2.jpg', tex => {
      this.uniforms.iChannel0.value = tex
    })
  }

  _loadHandler(tex) {

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: PixelVert,
      fragmentShader: PixelFrag,
      wireframe: false
    })

    this.geometry = new THREE.PlaneBufferGeometry(512, 256, 16, 8)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.material.side = THREE.DoubleSide
    console.log('loaded', tex)
    this.scene.add(this.mesh)
  }

  onResize(evt) {
    super.onResize(evt)
  }

  tick() {
    super.tick()
    this.uniforms.iGlobalTime.value = this.clock.getElapsedTime()
  }


  render() {

    return(
      <div ref = { c => { this.container = c }}
        className="day__container"
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onWheel={this.mouseWheel}
        onMouseOut={this.mouseUp}
        onMouseMove={this.mouseMove} />
    )
  }
}
