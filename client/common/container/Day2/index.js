import React, { Component } from 'react'
import * as THREE from 'three'
import AbstractThreeIndex from 'container/Day0/AbstractThreeIndex'

export default class Day extends AbstractThreeIndex {

  constructor() {
    super()
  }

  componentWillMount() {
    super.componentWillMount()
  }

  componentDidMount() {
    super.componentDidMount()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  init() {
    super.init()

    this.group = new THREE.Group()
    this.scene.add( this.group )


    for ( let i = 0; i < 1000; i++ ) {

      let material = new THREE.MeshLambertMaterial({ color: 0xCC0000 })

      let material2 = new THREE.SpriteMaterial( { color: 0x808008 })

      let material3 = new THREE.SpriteCanvasMaterial( {
				color: Math.random() * 0x808008 + 0x808080,
				program: context => {
          context.beginPath()
          context.arc( 0, 0, 0.5, 0, Math.PI * 2, true )
          context.fill()
        }
			})


      // let radius = 50, segments = 16, rings = 16
      //
      // let sphere = new THREE.Mesh (new THREE.SphereGeometry (radius, segments, rings), material)
      // sphere.position.x = Math.random() * 2000 - 1000
  		// sphere.position.y = Math.random() * 2000 - 1000
  		// sphere.position.z = Math.random() * 10
  		// sphere.scale.x = sphere.scale.y = Math.random()
  		// this.group.add( sphere )


  		let particle = new THREE.Sprite( material2 )
  		particle.position.x = Math.random() * 2000 - 1000
  		particle.position.y = Math.random() * 2000 - 1000
  		particle.position.z = Math.random() * 10
  		particle.scale.x = particle.scale.y = Math.random() * 100
  		this.scene.add( particle )

    }

    let pointLight = new THREE.PointLight(0xFFFFFF)
    // set its position
    pointLight.position.x = 10
    pointLight.position.y = 50
    pointLight.position.z = 130
    this.scene.add( pointLight )

  }

  tick() {
    super.tick()
    // TODO: tick function
  }


  render() {
    return(
      <div
        ref = { c => { this.container = c }}
        className="day__container">
      </div>
    )
  }
}
