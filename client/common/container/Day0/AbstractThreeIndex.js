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
        className="day__container">
      </div>
    )
  }
}
