import React, { Component } from 'react'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import earthVert from './shader/earth.vert'
import earthFrag from './shader/earth.frag'
import cloudVert from './shader/cloud.vert'
import cloudFrag from './shader/cloud.frag'
import atmosVert from './shader/atmosphere.vert'
import atmosFrag from './shader/atmosphere.frag'


export default class Day extends BasicThreeWithCam {

  constructor() {
    super()
  }

  componentWillMount() {
    super.componentWillMount()

    this.loaderManager = new THREE.LoadingManager()
    this.textureLoader = new THREE.TextureLoader(this.loaderManager)

    this.loaderManager.onLoad = this.onLoadComplete.bind(this)

  }

  componentDidMount() {
    super.componentDidMount()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }


  reset() {
    super.reset()
  }

  init() {
    super.init()

    // Load and render Earth
    this.textureLoader.load('/public/texture/world2.jpg', this.worldTexLoaded.bind(this))
    this.textureLoader.load('/public/texture/cloud.jpg', this.cloudLoaded.bind(this))

    this.scene.fog = new THREE.Fog(0xfffff, 0, 1000);
  }


  /**
   * world Texture load handler and add to scene
   * @param  {[type]} tex [description]
   * @return {[type]}     [description]
   */
  worldTexLoaded(tex) {

    let earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texture: { type: 't', value: tex },
        fogColor:    { type: "c", value: this.scene.fog.color },
        fogNear:     { type: "f", value: this.scene.fog.near },
        fogFar:      { type: "f", value: this.scene.fog.far }
      },
      vertexShader: earthVert,
      fragmentShader: earthFrag
    })

    let earthGeo = new THREE.SphereGeometry(200, 40, 30)

    this.earthMesh = new THREE.Mesh(earthGeo, earthMaterial)

  }

  cloudLoaded(tex) {
    let geo = new THREE.SphereGeometry(200, 40, 30)

    this.atmosMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: atmosVert,
      fragmentShader: atmosFrag,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    })

    this.atmosMesh = new THREE.Mesh(geo, this.atmosMaterial)
    this.atmosMesh.scale.set(1.04, 1.04, 1.04)

    this.cloudMaterial = new THREE.ShaderMaterial({
      uniforms: {
        percent: { type: 'f', value: 1.0 },
        texture: { type: 't', value: tex }
      },
      vertexShader: cloudVert,
      fragmentShader: cloudFrag,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    })

    this.atmosCloudMesh = new THREE.Mesh(geo, this.cloudMaterial)
    this.atmosCloudMesh.scale.set(1.04, 1.04, 1.04)
  }

  onLoadComplete() {
    this.scene.add(this.earthMesh)
    this.scene.add(this.atmosMesh)
    this.scene.add(this.atmosCloudMesh)
  }

  tick() {
    super.tick()

    if(this.atmosCloudMesh) {
      this.atmosCloudMesh.rotation.y += 0.00008
      this.atmosCloudMesh.rotation.x += 0.0001
    }
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
