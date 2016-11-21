import React from 'react'
import ReactDOM from 'react-dom'
import CanvasCacher from 'lib/CanvasCacher'
import * as THREE from 'three'


export default class BaseCanvas extends React.Component {

  constructor() {
    super()


  }



  componentWillMount() {

  }

  componentDidMount() {

    this.canvasDOM = ReactDOM.findDOMNode(this.canvas)
    this.ctx = this.canvasDOM.getContext('2d')
    this.texture = new THREE.Texture(this.canvasDOM)
    this.init()
  }

  /**
   * GET Canvas DOM
   * @return {[type]} [description]
   */
  getCanvasDom() {
    return this.canvasDOM
  }

  /**
   * GET Canvas Context
   * @return {[type]} [description]
   */
  getCtx() {
    return this.ctx
  }

  /**
   * GET Canvas as THREE texture
   * @return {[type]} [description]
   */
  getTexture() {
    return this.texture
  }

  init() {
    let { width, height } = this.props

  }

  animate() {
    if(!this.ctx) return

    this.texture.needsUpdate = true
    let { width, height } = this.props

    this.ctx.clearRect(0, 0, width, height)

  }


  render() {
    let { width, height } = this.props

    let canProps = {
      width: width,
      height: height,
      style: {
        position: 'absolute',
        display: 'block',
        borderStyle: 'solid',
        borderWeight: '1px',
        borderColor: 'black',
        left: 0,
        bottom: 0,
        // zIndex: -99
      }
    }

    return (
      <CanvasCacher
        {...canProps}
        ref={ c => this.canvas = c } />
    )
  }

}

BaseCanvas.defaultProps = {
  width: 256,
  height: 256,
}
