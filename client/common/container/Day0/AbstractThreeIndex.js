import React, { Component } from 'react'
import * as THREE from 'three'

export default class AbstractThreeDay extends Component {

  constructor() {
    super()
    this.reset()
  }

  componentWillMount() {
    this.animate = this.animate.bind(this)
    this.onResize = this.onResize.bind(this)
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })

    this.mouse = {
      normX: 0,
      normY: 0,
      x: 0,
      y: 0
    }

  }

  componentDidMount() {
    this.isAnimating = true
    this.init()
    this.animate()
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    this.reset()
    window.removeEventListener('resize', this.onResize)
  }

  /**
   * reset everything
   */
  reset() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.isAnimating = false

    this.mouseMove = this.mouseMove.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
  }

  init() {
    let { width, height } = this.state

    this.scene = new THREE.Scene()

    this.initRenderer(width, height)
    this.initCamera(width/height)

    // attach the render-supplied DOM element
    this.container.appendChild(this.renderer.domElement)

  }

  /**
   * init renderer
   * @param  {[type]} width  =             0 [description]
   * @param  {[type]} height =             0 [description]
   * @return {[type]}        [description]
   */
  initRenderer(width = 0, height = 0) {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize(width, height)
  }

  /**
   * init Camera
   * @param  {[type]} aspect    [description]
   * @param  {[type]} z         =             300   [description]
   * @param  {[type]} viewAngle =             45    [description]
   * @param  {[type]} near      =             0.1   [description]
   * @param  {[type]} far       =             10000 [description]
   * @return {[type]}           [description]
   */
  initCamera(aspect, z = 300, viewAngle = 45, near = 0.1, far = 10000) {

    this.camera = new THREE.PerspectiveCamera (viewAngle, aspect, near, far)

    this.scene.add(this.camera)
    // the camera starts at 0,0,0
    // so pull it back
    this.camera.position.z = z
  }

  tick() {
    // TODO: tick function
  }

  mouseMove(event) {
    this.mouse = {
      normX: event.clientX - this.state.width / 2,
      normY: event.clientY - this.state.height / 2,
      x: event.clientX,
      y: event.clientY
    }
  }

  touchStart(event) {
    if ( event.touches.length === 1 ) {
			event.preventDefault()
      this.mouse = {
        normX: event.touches[ 0 ].pageX - this.state.width / 2,
        normY: event.touches[ 0 ].pageY - this.state.height / 2,
        x: event.touches[ 0 ].pageX,
        y: event.touches[ 0 ].pageY
      }
		}
  }

  touchMove(event) {
    if ( event.touches.length === 1 ) {
			event.preventDefault()
      this.mouse = {
        normX: event.touches[ 0 ].pageX - this.state.width / 2,
        normY: event.touches[ 0 ].pageY - this.state.height / 2,
        x: event.touches[ 0 ].pageX,
        y: event.touches[ 0 ].pageY
      }
		}
  }

  animate() {
    if(!this.isAnimating) return
    window.requestAnimationFrame( this.animate )
    this.tick()
    this.renderer.render(this.scene, this.camera)
  }

  onResize() {

    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
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
