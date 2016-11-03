import React, { Component } from 'react'
import * as THREE from 'three'
import AbstractThreeIndex from 'container/Day0/AbstractThreeIndex'

import basicFrag from './shader/basic.frag'
import basicVert from './shader/basic.vert'
import niceFrag from './shader/nice.frag'
import niceVert from './shader/nice.vert'


export default class Day extends AbstractThreeIndex {

  constructor() {
    super()
  }

  componentWillMount() {
    super.componentWillMount()
    this.positionScaling = 1
    this.start = Date.now()
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

    // set background colour
    this.renderer.setClearColor (0x000000, 1)

    // create group
    this.group1 = new THREE.Group()
    this.scene.add( this.group1 )

    this.group2 = new THREE.Group()
    this.scene.add (this.group2 )

    let material = new THREE.MeshLambertMaterial({ color: 0xCC0000 })

    let material2 = new THREE.SpriteMaterial( { color: 0xffffff })

    let material4 = new THREE.MeshPhongMaterial({
      color: 0xFF5644,
      shading: THREE.FlatShading,
      specular: 0x55D5FF,
      shininess: 1
    })

    let material5 = new THREE.MeshNormalMaterial({
      morphTargets: true
    })

    let material6 = new THREE.ShaderMaterial( {
      fragmentShader: basicFrag,
      vertexShader: basicVert
    })

    this.material7 = new THREE.ShaderMaterial({
      uniforms: {
        time: { // float initialized to 0
            type: "f",
            value: 0.0
        }
      },
      fragmentShader: niceFrag,
      vertexShader: niceVert

    })

    let radius = 1, segments = 16, rings = 16


    for ( let i = 0; i < 1000; i++ ) {
      let sphere = new THREE.Mesh (new THREE.SphereGeometry (radius, segments, rings), this.material7)
      sphere.position.x = Math.random() * 2000 - 1000
  		sphere.position.y = Math.random() * 2000 - 1000
  		sphere.position.z = Math.random() * 2000 - 1000
  		sphere.scale.x = sphere.scale.y = sphere.scale.z = 8 + Math.random() * 2
  		this.group1.add( sphere )
    }

    for( let i = 0; i < 5000; i++) {
      let particle = new THREE.Sprite( material2 )
      particle.position.x = Math.random() * 2000 - 1000
      particle.position.y = Math.random() * 2000 - 1000
      particle.position.z = Math.random() * 2000 - 1000
      particle.scale.x = particle.scale.y = 1
      this.group2.add( particle )
    }

    let pointLight = new THREE.PointLight(0xFFFFFF)
    // set its position
    pointLight.position.x = 0
    pointLight.position.y = 0
    pointLight.position.z = 0
    this.scene.add( pointLight )

  }

  tick() {
    super.tick()
    // TODO: tick function
    this.material7.uniforms[ 'time' ].value = .00025 * ( Date.now() - this.start )

    this.camera.position.x += ( this.mouse.normX - this.camera.position.x ) * 0.05
    this.camera.position.y += ( - this.mouse.normY - this.camera.position.y ) * 0.05
    this.camera.lookAt( this.scene.position )
    this.group1.rotation.x += 0.0005
    this.group1.rotation.y += 0.001

    this.group2.rotation.x -= 0.005
    this.group2.rotation.y -= 0.01

  }


  render() {
    return(
      <div
        ref = { c => { this.container = c }}
        className="day__container"
        onMouseMove={this.mouseMove}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}>
      </div>
    )
  }
}
