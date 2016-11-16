import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import EarthObj from 'lib/EarthObj'
import RibbonObj from 'lib/RibbonObj'
import CanvasCacher from 'lib/CanvasCacher'
import { generateRandomColor } from 'lib/GenericHelper'

export default class Day extends BasicThreeWithCam {

  constructor() {
    super({
      hasLight: true,
      lightIntensity: 1.5,
      zoomMin: 350
     })

     this.stopFrame = false
     this.hideCanvas = false

  }

  componentWillMount() {
    super.componentWillMount()
    this.earth = new EarthObj({
      isRotating: true,
      visible: false,
      onLoadComplete: this._earthLoaded.bind(this)
    })

    this.setState({
      canWidth: 256,
      canHeight: 256,
      sqNum: 32
    })
  }


  init(){
    this.earth.load()
    super.init()

    this.canvasDOM = ReactDOM.findDOMNode(this.canvas)
    this.ctx = this.canvasDOM.getContext('2d')
    this._initBlock()
    this.texture = new THREE.Texture(this.canvasDOM)

    this.gui.add(this, 'stopFrame')
    this.gui.add(this, 'hideCanvas')
  }

  tick() {
    super.tick()

    if(this.texture) this.texture.needsUpdate = true
    if(!this.stopFrame) this._animBlocks()
    this.canvasDOM.style.display = this.hideCanvas ? 'none' : 'block'
    this.earth.animate()
  }

  _earthLoaded(evt) {
    this.scene.add(this.earth.group)


  }

  _initBlock() {
    this.blocks = []
    this.blocksPos = []

    this.blocks2 = []
    this.blocksPos2 = []

    this.blocks3 = []
    this.blocksPos3 = []

    this.blocks4 = []
    this.blocksPos4 = []

    let { sqNum, canWidth, canHeight } = this.state

    for(let i = 0; i < (sqNum+1); i++) {
      this.blocks.push(generateRandomColor())
      this.blocksPos.push(canWidth * (i - 1)/sqNum)

      this.blocks2.push(generateRandomColor())
      this.blocksPos2.push(canWidth * (1 + i/sqNum))

      this.blocks3.push(generateRandomColor())
      this.blocksPos3.push(canWidth * (i - 1)/sqNum)

      this.blocks4.push(generateRandomColor())
      this.blocksPos4.push(canWidth * (1 + i/sqNum))
    }

  }

  _animBlocks() {
    if(!this.ctx) return
    let { sqNum, canWidth, canHeight } = this.state
    let xW = canWidth / sqNum
    let yW = canHeight / sqNum
    let area = xW * yW


    for(let i = 0; i < sqNum+1; i++) {
      if(this.blocksPos[i] > canWidth) this.blocksPos[i] = -canWidth / sqNum
      this.blocksPos[i]+=1
      this.ctx.fillStyle = this.blocks[i]
      this.ctx.fillRect(this.blocksPos[i], 0, canWidth / sqNum ,canHeight/4)

      if(this.blocksPos2[i] < -canWidth / 9) this.blocksPos2[i] = canWidth * (sqNum+1)/sqNum
      this.blocksPos2[i]-=1
      this.ctx.fillStyle = this.blocks2[i]
      this.ctx.fillRect(this.blocksPos2[i], canHeight/4, canWidth / sqNum ,canHeight/4)

      if(this.blocksPos3[i] > canWidth) this.blocksPos3[i] = -canWidth / sqNum
      this.blocksPos3[i]+=1
      this.ctx.fillStyle = this.blocks3[i]
      this.ctx.fillRect(this.blocksPos3[i], canHeight/2, canWidth / sqNum ,canHeight/4)

      if(this.blocksPos4[i] < -canWidth / 9) this.blocksPos4[i] = canWidth * (sqNum+1)/sqNum
      this.blocksPos4[i]-=1
      this.ctx.fillStyle = this.blocks4[i]
      this.ctx.fillRect(this.blocksPos4[i], canHeight*3/4, canWidth / sqNum ,canHeight/4)
    }
  }



  render() {

    let { canWidth, canHeight, width, height } = this.state

    let canProps = {
      width: canWidth,
      height: canHeight,
      left: (width - canWidth) / 2,
      top: (height - canHeight) / 2,
      style: {
        position: 'absolute',
        display: 'block',
        borderStyle: 'solid',
        borderWeight: '1px',
        borderColor: 'black',
        // zIndex: -99
      }
    }

    return(
      <div ref = { c => { this.container = c }}
        className="day__container"
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onWheel={this.mouseWheel}
        onMouseOut={this.mouseUp}
        onMouseMove={this.mouseMove}>
        onMouseMove={this.mouseMove}>
        <CanvasCacher
          {...canProps}
          ref={ c => this.canvas = c } />
      </div>
    )
  }
}
