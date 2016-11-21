import React from 'react'
import ReactDOM from 'react-dom'
import CanvasCacher from 'lib/CanvasCacher'
import * as THREE from 'three'
import { generateRandomColor,
         generateRandomSetColor } from 'lib/GenericHelper'

export default class DataTextureCanvas extends React.Component {

  constructor() {
    super()

    this.blocks = []
    this.blocksPos = []

    this.blocks2 = []
    this.blocksPos2 = []

  }

  shouldComponentUpdate(nextProps, nextState) {

    return (nextProps.speed0 !== this.props.speed0) || (nextProps.speed0 !== this.props.speed0)
  }

  componentWillMount() {

    let { speed0, speed1, gui } = this.props

    this.speed0 = speed0
    this.speed1 = speed1

    if(!gui) return
    gui.add(this, 'speed0', 0.01, 10)
    gui.add(this, 'speed1', 0.01, 10)
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
    let { sqNum, width, height, inColors, outColors } = this.props

    for(let i = 0; i < (sqNum+1); i++) {
      this.blocks.push(generateRandomSetColor(inColors))
      this.blocksPos.push(width * (i - 1)/sqNum)

      this.blocks2.push(generateRandomSetColor(outColors))
      this.blocksPos2.push(width * (1 + i/sqNum))
    }
  }

  animate() {
    if(!this.ctx) return

    this.texture.needsUpdate = true
    let { sqNum, width, height } = this.props
    let xW = width / sqNum
    let yW = height / sqNum
    let area = xW * yW

    this.ctx.clearRect(0, 0, width, height);
    for(let i = 0; i < sqNum+1; i++) {
      if(this.blocksPos[i] > width) this.blocksPos[i] = -width / sqNum
      this.blocksPos[i] += this.speed0
      this.ctx.fillStyle = this.blocks[i]
      this.ctx.fillRect(this.blocksPos[i], height/2, width / sqNum ,height/2)

      if(this.blocksPos2[i] < -width / 9) this.blocksPos2[i] = width * (sqNum+1)/sqNum
      this.blocksPos2[i] -= this.speed1
      this.ctx.fillStyle = this.blocks2[i]
      this.ctx.fillRect(this.blocksPos2[i], 0, width / sqNum ,height/2)
    }
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

DataTextureCanvas.defaultProps = {
  width: 256,
  height: 256,
  sqNum: 32,
  gui: null,
  speed0: 1,
  speed1: 1,
  inColors: ['#008483', '#008483', 'rgba(0,0,0,0.1)', '#008483', 'rgba(0,0,0,0.1)', '#008483'],
  outColors: ['#81020d', '#81020d', 'rgba(0,0,0,0.1)', '#81020d']
}
