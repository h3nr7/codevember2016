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
      y: 0,
      isDown: false
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

    this.mouseUp = this.mouseUp.bind(this)
    this.mouseOut = this.mouseOut.bind(this)
    this.mouseDown = this.mouseDown.bind(this)
    this.mouseMove = this.mouseMove.bind(this)
    this.mouseWheel = this.mouseWheel.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
  }

  /**
   * INIT
   * @return {[type]} [description]
   */
  init() {

    this.scene = new THREE.Scene()

    this.initRenderer()
    this.initCamera()

    // attach the render-supplied DOM element
    this.container.appendChild(this.renderer.domElement)

  }

  /**
   * init renderer
   * @param  {[type]} width  =             0 [description]
   * @param  {[type]} height =             0 [description]
   * @return {[type]}        [description]
   */
  initRenderer({ bgColor = 0x000000, antialias = true } = {}) {
    let { width, height } = this.state
    this.renderer = new THREE.WebGLRenderer({antialias: antialias})
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize(width, height)
    this.renderer.setClearColor(bgColor, 1 )
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
  initCamera(z = 300, viewAngle = 45, near = 0.1, far = 10000) {

    let { width, height } = this.state

    this.camera = new THREE.PerspectiveCamera (viewAngle, width/height, near, far)

    this.scene.add(this.camera)
    // the camera starts at 0,0,0
    // so pull it back
    this.camera.position.z = z
  }

  /**
   * ticker
   * @return {[type]} [description]
   */
  tick() {
    // TODO: tick function
  }

  /**
   * mouse down handler
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  mouseDown(event) {
    Object.assign(this.mouse, {
      isDown: true
    })
  }

  /**
   * mouse up handler
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  mouseUp(event) {
    Object.assign(this.mouse, {
      isDown: false
    })
  }

  /**
   * mouse out handler
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  mouseOut(event) {
    Object.assign(this.mouse, {
      isDown: false
    })
  }

  /**
   * mouse move handler
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  mouseMove(event) {
    Object.assign(this.mouse, {
      normX: event.clientX - this.state.width / 2,
      normY: event.clientY - this.state.height / 2,
      x: event.clientX,
      y: event.clientY
    })
  }

  /**
   * mouse wheel handler
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  mouseWheel(event) {

  }

  /**
   * touch start handler
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  touchStart(event) {
    if ( event.touches.length === 1 ) {
			event.preventDefault()
      Object.assign(this.mouse, {
        normX: event.touches[ 0 ].pageX - this.state.width / 2,
        normY: event.touches[ 0 ].pageY - this.state.height / 2,
        x: event.touches[ 0 ].pageX,
        y: event.touches[ 0 ].pageY,
        isDown: true
      })
		}
  }

  /**
   * touch move handler
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  touchMove(event) {
    if ( event.touches.length === 1 ) {
			event.preventDefault()
      Object.assign(this.mouse, {
        normX: event.touches[ 0 ].pageX - this.state.width / 2,
        normY: event.touches[ 0 ].pageY - this.state.height / 2,
        x: event.touches[ 0 ].pageX,
        y: event.touches[ 0 ].pageY
      })
		}
  }

  /**
   * touch end
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  touchEnd(event) {
    if ( event.touches.length === 1 ) {
      event.preventDefault()
      Object.assign(this.mouse, {
        normX: event.touches[ 0 ].pageX - this.state.width / 2,
        normY: event.touches[ 0 ].pageY - this.state.height / 2,
        x: event.touches[ 0 ].pageX,
        y: event.touches[ 0 ].pageY,
        isDown: false
      })
    }
  }

  /**
   * animate
   * @return {[type]} [description]
   */
  animate() {
    if(!this.isAnimating) return
    window.requestAnimationFrame( this.animate )
    this.tick()
    this.renderer.render(this.scene, this.camera)
  }


  /**
   * on resize handler
   * @return {[type]} [description]
   */
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
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onMouseMove={this.mouseMove}
        onMouseWheel={this.mouseWheel}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTOuchEnd={this.touchEnd}>
      </div>
    )
  }
}
