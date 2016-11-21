import React from 'react'
import ReactDOM from 'react-dom'
import BaseCanvas from 'lib/BaseCanvas'
import CanvasCacher from 'lib/CanvasCacher'
import * as THREE from 'three'


export default class SignTextureCanvas extends React.Component {

  constructor() {
    super()

  }


  componentDidMount() {

    this.canvasDOM = ReactDOM.findDOMNode(this.canvas)
    this.ctx = this.canvasDOM.getContext('2d')
    this.texture = new THREE.Texture(this.canvasDOM)
    this.init()
  }

  init() {

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

  animate() {
    if(!this.ctx) return

    let { width, height, bgColor, inColor, outColor,
          titleText, titleColor,
          fontSize, font, inText, outText } = this.props

    this.texture.needsUpdate = true
    this.ctx.clearRect(0, 0, width, height)

    if(bgColor) {
      this.ctx.fillStyle = bgColor
      this.ctx.fillRect(0,0,width, height)
    }

    this.addText(titleText, titleColor, width / 2, height * 1 / 3)
    this.addText(outText, outColor, width / 4, height * 2/ 3)
    this.addText(inText, inColor, width * 3 / 4, height * 2 / 3)


  }

  addText(txt, color, x, y, align='center') {

    let { fontSize, font } = this.props

    this.ctx.font= fontSize + 'px ' + font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align
    this.ctx.fillText(txt, x, y)
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

SignTextureCanvas.defaultProps = {
  width: 256,
  height: 128,
  font: 'Arial',
  fontSize: 30,
  titleText: 'Revenue',
  titleColor: 'white',
  inText: '$9.12k',
  outText: '$3.13k',
  inColor: '#008483',
  outColor: '#81020d',
  bgColor: null
}
