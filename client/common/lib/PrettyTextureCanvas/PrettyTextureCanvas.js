import React from 'react'
import ReactDOM from 'react-dom'
import CanvasCacher from 'lib/CanvasCacher'
import * as THREE from 'three'
import { generateRandomColor,
         generateRandomSetColor } from 'lib/GenericHelper'

export default class PrettyTextureCanvas extends React.Component {

  constructor() {
    super()

    this.blocks = []
    this.blocksPos = []

    this.blocks2 = []
    this.blocksPos2 = []

    this.blocks3 = []
    this.blocksPos3 = []

    this.blocks4 = []
    this.blocksPos4 = []

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

    let { repeatS, repeatT } = this.props
    this.canvasDOM = ReactDOM.findDOMNode(this.canvas)
    this.ctx = this.canvasDOM.getContext('2d')
    this.texture = new THREE.Texture(this.canvasDOM)

    this.texture.wrapT = repeatT > 1 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
    this.texture.wrapS = repeatS > 1 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
    this.texture.repeat.set( repeatT, repeatT );
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
    let { sqNum, width, height } = this.props

    for(let i = 0; i < (sqNum+1); i++) {
      this.blocks.push(generateRandomColor())
      this.blocksPos.push(width * (i - 1)/sqNum)

      this.blocks2.push(generateRandomColor())
      this.blocksPos2.push(width * (1 + i/sqNum))

      this.blocks3.push(generateRandomColor())
      this.blocksPos3.push(width * (i - 1)/sqNum)

      this.blocks4.push(generateRandomColor())
      this.blocksPos4.push(width * (1 + i/sqNum))
    }
  }

  animate() {
    if(!this.ctx) return

    this.texture.needsUpdate = true
    let { sqNum, width, height } = this.props
    let xW = width / sqNum
    let yW = height / sqNum
    let area = xW * yW



    for(let i = 0; i < sqNum+1; i++) {
      if(this.blocksPos[i] > width) this.blocksPos[i] = -width / sqNum
      this.blocksPos[i]+= this.speed0
      this.ctx.fillStyle = this.blocks[i]
      this.ctx.fillRect(this.blocksPos[i], 0, width / sqNum ,height/4)

      // if(this.blocksPos2[i]  > width) this.blocksPos2[i] = width * (sqNum+1)/sqNum
      // this.blocksPos2[i]+=1
      // this.ctx.fillStyle = this.blocks2[i]
      // this.ctx.fillRect(this.blocksPos2[i], height/4, width / sqNum ,height/4)

      if(this.blocksPos3[i] > width) this.blocksPos3[i] = -width / sqNum
      this.blocksPos3[i]+= this.speed1
      this.ctx.fillStyle = this.blocks3[i]
      this.ctx.fillRect(this.blocksPos3[i], height/2, width / sqNum ,height/4)

      // if(this.blocksPos4[i] > width) this.blocksPos4[i] = width * (sqNum+1)/sqNum
      // this.blocksPos4[i] += this.speed1
      // this.ctx.fillStyle = this.blocks4[i]
      // this.ctx.fillRect(this.blocksPos4[i], height*3/4, width / sqNum ,height/4)
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

PrettyTextureCanvas.defaultProps = {
  width: 256,
  height: 256,
  sqNum: 32,
  gui: null,
  speed0: 1,
  speed1: 1,
  repeatS: 1,
  repeatT: 1
}
