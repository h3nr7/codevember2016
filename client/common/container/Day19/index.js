import React, { Component } from 'react'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import * as THREE from 'three'
import TestFs from './shader/test_fs.glsl'
import TestVs from './shader/test_vs.glsl'

const PI = Math.PI
const DEFAULT_TEXTURES = {
  groundTexture: '/public/texture/world2.jpg'
}

export default class Day extends BasicThreeWithCam {

  constructor(opts = {}) {
    super()

    this.options = Object.assign({
      earthSize: 200,
      citySize: 2,
      cityFloatDistance: 3,
      isRotating: false,
      visible: true,
      groundTexture: DEFAULT_TEXTURES.groundTexture,
      targetWidth: 600.0,
      targetHeight: 400.0
    }, opts)


  }

  init() {
    super.init()

    this.isLoaded = false
    this.earthUniform = {
      texture: { type: 't', value: null },
      targetWidth: { type: 'f', value: this.options.targetWidth },
      targetHeight: { type: 'f', value: this.options.targetHeight },
      mixAmount: 	 { type: 'f', value: 0.0 }
    }

    this._worldTexLoaded = this._worldTexLoaded.bind(this)
    this._loadComplete = this._loadComplete.bind(this)

    this.loaderManager = new THREE.LoadingManager()
    this.textureLoader = new THREE.TextureLoader(this.loaderManager)

    this.loaderManager.onLoad = this._loadComplete

    this.load()
  }

  load() {
    let { groundTexture, atmosphereTexture } = this.options
    this.textureLoader.load(groundTexture, this._worldTexLoaded)
  }

  _worldTexLoaded(tex) {
    this.earthUniform.texture.value = tex

    this.earthMaterial = new THREE.ShaderMaterial({
      uniforms: this.earthUniform,
      vertexShader: TestVs,
      fragmentShader: TestFs,
      visible: this.options.visible
    })

    this.earthGeometry = new THREE.SphereGeometry(this.options.earthSize, 40, 30)
    this.earthMesh = new THREE.Mesh(this.earthGeometry, this.earthMaterial)
    this.earthMesh.name = 'globe'


    this.gui.add(this.earthUniform.mixAmount, 'value', 0, 1)
    
  }

  _loadComplete() {
    this.isLoaded = true
    this.scene.add(this.earthMesh)
  }



  tick() {
    super.tick()
    if(!this.isLoaded) return


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
