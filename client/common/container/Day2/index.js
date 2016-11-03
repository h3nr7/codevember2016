import React, { Component } from 'react'
import * as THREE from 'three'

export default class Day extends Component {

  constructor() {
    super()
      this.camera = null
      this.scene = null
      this.renderer = null
      this.material = null
      this.group = null
      this.particle = null
      this.windowHalfX = 0
      this.windowHalfY = 0
  }

  componentDidMount() {
    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2

    this.init()
    this.animate()
  }

  init() {
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 )
		this.camera.position.z = 1000

		this.scene = new THREE.Scene()
		this.group = new THREE.Group();

		this.scene.add( this.group )

		for ( let i = 0; i < 1000; i++ ) {

			this.material = new THREE.SpriteCanvasMaterial( {
				color: Math.random() * 0x808008 + 0x808080,
				program: (context) => {
          context.beginPath()
          context.arc( 0, 0, 0.5, 0, Math.PI * 2, true )
          context.fill()
        }
			})


			this.particle = new THREE.Sprite( this.material )
			this.particle.position.x = Math.random() * 2000 - 1000
			this.particle.position.y = Math.random() * 2000 - 1000
			this.particle.position.z = Math.random() * 2000 - 1000
			this.particle.scale.x = this.particle.scale.y = Math.random() * 20 + 10
			this.group.add( this.particle )
		}

		this.renderer = new THREE.CanvasRenderer()
		this.renderer.setPixelRatio( window.devicePixelRatio )
		this.renderer.setSize( window.innerWidth, window.innerHeight )
		this.container.appendChild( this.renderer.domElement )

  }

  mouseMove(event) {
    this.mouseX = event.clientX - this.windowHalfX
    this.mouseY = event.clientY - this.windowHalfY
  }

  touchStart(event) {
    if ( event.touches.length === 1 ) {
			event.preventDefault()
			this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX
			this.mouseY = event.touches[ 0 ].pageY - this.windowHalfY
		}
  }

  touchMove(event) {
    if ( event.touches.length === 1 ) {
			event.preventDefault()
			this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX
			this.mouseY = event.touches[ 0 ].pageY - this.windowHalfY
		}
  }

  animate() {

			window.requestAnimationFrame( this.animate.bind(this) )
			this.renderCanvas( )
	}

  renderCanvas() {
    this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 0.05;
		this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 0.05;
		this.camera.lookAt( this.scene.position );
		this.group.rotation.x += 0.01;
		this.group.rotation.y += 0.02;
		this.renderer.render( this.scene, this.camera )
  }



  render() {
    return(
      <div
        ref = { c => { this.container = c }}
        className="day__container"
        onMouseMove={this.mouseMove.bind(this)}
        onTouchStart={this.touchStart.bind(this)}
        onTouchMove={this.touchMove.bind(this)}>
      </div>
    )
  }
}
