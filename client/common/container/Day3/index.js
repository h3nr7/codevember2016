import React, { Component } from 'react'
import * as THREE from 'three'
import AbstractThreeIndex from 'container/Day0/AbstractThreeIndex'
import earthVert from './shader/earth.vert'
import earthFrag from './shader/earth.frag'
import cloudVert from './shader/cloud.vert'
import cloudFrag from './shader/cloud.frag'
import atmosVert from './shader/atmosphere.vert'
import atmosFrag from './shader/atmosphere.frag'

const PI_HALF = Math.PI / 2

export default class Day extends AbstractThreeIndex {

  constructor() {
    super()
  }

  componentWillMount() {
    super.componentWillMount()

    this.isMouseDown = false
    this.mouse = { x:0, y:0 }
    this.mouseOnDown = { x:0, y:0 }
    this.rotation = { x:0 , y:0 , z:0 }
    this.target = { x: Math.PI*3/2, y: Math.PI / 6.0 }
    this.targetOnDown = { x: 0, y: 0 }

    this.distance = 1000
    this.distanceTarget = 1000
    this.padding = 40

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
    this.textureLoader.load('/public/texture/atmosphere.jpg', this.cloudLoaded.bind(this))

    this.scene.fog = new THREE.Fog(0xfffff, 0, 1000);
  }

  initCamera(aspect, z = 300, viewAngle = 30, near = 1, far = 1000000) {
    super.initCamera(aspect, this.distance, viewAngle, near, far)
  }



  tick() {

    this.rotation.x += (this.target.x - this.rotation.x) * 0.1
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1
    this.distance += (this.distanceTarget - this.distance) * 0.3

    this.camera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y)
    this.camera.position.y = this.distance * Math.sin(this.rotation.y)
    this.camera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y)

    if(this.atmosCloudMesh) {
      this.atmosCloudMesh.rotation.y += 0.00008
      this.atmosCloudMesh.rotation.x += 0.0001
    }

    this.camera.lookAt(this.scene.position)
  }

  zoom(z) {
    this.distanceTarget -= z
    this.distanceTarget = this.distanceTarget > 1500 ? 1500 : this.distanceTarget
    this.distanceTarget = this.distanceTarget < 500 ? 500 : this.distanceTarget
  }

  mouseDown(event) {
    event.preventDefault()
    this.isMouseDown = true

    this.mouseOnDown.x = - event.clientX
    this.mouseOnDown.y = event.clientY

    this.targetOnDown.x = this.target.x
    this.targetOnDown.y = this.target.y
  }

  mouseUp(event) {
    this.isMouseDown = false
  }

  mouseOut(event) {
    this.isMouseDown = false
  }

  mouseWheel(event) {
    event.preventDefault()
    this.zoom(event.deltaY * 0.3)
  }

  mouseMove(event) {
    if(this.isMouseDown) {
      this.mouse.x = - event.clientX;
      this.mouse.y = event.clientY;
      let zoomDamp = this.distance/1000;

      this.target.x = this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005 * zoomDamp;
      this.target.y = this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005 * zoomDamp;

      this.target.y = this.target.y > PI_HALF ? PI_HALF : this.target.y;
      this.target.y = this.target.y < - PI_HALF ? - PI_HALF : this.target.y;
    }
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

    let material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: atmosVert,
      fragmentShader: atmosFrag,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    })

    this.atmosMesh = new THREE.Mesh(geo, material)
    this.atmosMesh.scale.set(1.04, 1.04, 1.04)

    material = new THREE.ShaderMaterial({
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

    this.atmosCloudMesh = new THREE.Mesh(geo, material)
    this.atmosCloudMesh.scale.set(1.04, 1.04, 1.04)
  }

  onLoadComplete() {
    this.scene.add(this.earthMesh)
    this.scene.add(this.atmosMesh)
    this.scene.add(this.atmosCloudMesh)
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
