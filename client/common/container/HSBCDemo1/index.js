import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import EarthObj from 'lib/EarthObj'
import RibbonObj from 'lib/RibbonObj'
import CanvasCacher from 'lib/CanvasCacher'
import { generateRandomColor,
         generateRandomSetColor } from 'lib/GenericHelper'

import './HSBCDemo1.scss'


export default class Day extends BasicThreeWithCam {

  constructor() {
    super({
      hasLight: true,
      lightIntensity: 1.5,
      zoomMin: 350
     })

     this.stopFrame = false
     this.hideCanvas = true
     this.speed0 = 3
     this.speed1 = 0.6
     this.rotate = false

     this.ribbonGroup = []

  }

  componentWillMount() {
    super.componentWillMount()
    this.earth = new EarthObj({
      isRotating: this.rotate,
      citySize: 4,
      cityFloatDistance: 6,
      initialRotation: new THREE.Vector3(0, 3, 0),
      onLoadComplete: this._earthLoaded.bind(this)
    })

    this.setState({
      canWidth: 256,
      canHeight: 256,
      sqNum: 32
    })

    this.raycaster = new THREE.Raycaster()
    this.raycaster.ray.direction.set(0, -1, 0)

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
    this.gui.add(this, 'rotate')

    this.gui.add(this, 'speed0', 0.01, 10)
    this.gui.add(this, 'speed1', 0.01, 10)


    this.popupDOM = ReactDOM.findDOMNode(this.popup)
  }

  tick() {
    super.tick()

    if(this.texture) this.texture.needsUpdate = true
    if(!this.stopFrame) this._animBlocks()
    this.canvasDOM.style.display = this.hideCanvas ? 'none' : 'block'
    this.earth.animate()

    this.raycaster.setFromCamera( this.mouseVector, this.camera )
    // let intersects = this.raycaster.intersectObjects( this.earth.group.children )
    let intersects = this.raycaster.intersectObjects( this.ribbonGroup )



    this.ribbonGroup.forEach(v => {
      v.material.color = new THREE.Color()
      this.earth.options.isRotating = this.rotate
    })

    this.popupDOM.style.display = 'none'

    this.currentIntersect = null

    intersects.forEach(v => {
      // if(v.object.name === 'globe' || v.object.name === 'atmosphere') return
      console.log('lalalalala', v.object)
      this.earth.options.isRotating = false
      v.object.material.color = new THREE.Color(0x000000)
      this.currentIntersect = v.object.name
      this.popupDOM.style.display = 'block'
      this.popupDOM.style.left = String(this.mouseRaw.x - 5) + 'px'
      this.popupDOM.style.top = String(this.mouseRaw.y - 5) + 'px'
      this.popupDOM.style.cursor = 'pointer'
      this.popupDOM.style.opacity = 1
    })
  }

  mouseDown(evt) {
    super.mouseDown(evt)
    if(!!this.currentIntersect) {
      alert('Show details of ' + this.currentIntersect)
    }
  }

  _earthLoaded(evt) {
    this.scene.add(this.earth.group)

    let europe = this.earth.addCity({ name: 'europe', lat:	48.562640, lng: 7.995174})
    let asia = this.earth.addCity({ name: 'asia', lat:	29.8405555556, lng: 89.2966666667})
    let latin = this.earth.addCity({ name: 'latin', lat: -16.490014, lng: -62.540111})
    let middleeast = this.earth.addCity({ name:'middleeast', lat:24.063783, lng: 43.854548 })
    let america = this.earth.addCity({ name:'america', lat: 41.510495, lng: -115.040280 })

    this.addRibbon(europe.position, asia.position, 40, this.texture)
    this.addRibbon(europe.position, latin.position, 40, this.texture)
    this.addRibbon(europe.position, middleeast.position, 40, this.texture)
    this.addRibbon(europe.position, america.position, 40, this.texture)

  }

  addRibbon(pos1, pos2, width = 20, texture) {
    let tmp = new RibbonObj(pos1, pos2, { width: width, texture:texture })
    this.earth.group.add(tmp.group)
    this.ribbonGroup.push(tmp.mesh)
  }

  _initBlock() {
    this.blocks = []
    this.blocksPos = []

    this.blocks2 = []
    this.blocksPos2 = []

    let greenSet = ['#008483', '#008483', 'rgba(0,0,0,0.1)', '#008483', 'rgba(0,0,0,0.1)', '#008483']
    let redSet = ['#81020d', '#81020d', 'rgba(0,0,0,0.1)', '#81020d']

    let { sqNum, canWidth, canHeight } = this.state

    for(let i = 0; i < (sqNum+1); i++) {
      this.blocks.push(generateRandomSetColor(greenSet))
      this.blocksPos.push(canWidth * (i - 1)/sqNum)

      this.blocks2.push(generateRandomSetColor(redSet))
      this.blocksPos2.push(canWidth * (1 + i/sqNum))
    }

  }

  _animBlocks() {
    if(!this.ctx) return
    let { sqNum, canWidth, canHeight } = this.state
    let xW = canWidth / sqNum
    let yW = canHeight / sqNum
    let area = xW * yW

    this.ctx.clearRect(0, 0, this.canvasDOM.width, this.canvasDOM.height);
    for(let i = 0; i < sqNum+1; i++) {
      if(this.blocksPos[i] > canWidth) this.blocksPos[i] = -canWidth / sqNum
      this.blocksPos[i] += this.speed0
      this.ctx.fillStyle = this.blocks[i]
      this.ctx.fillRect(this.blocksPos[i], canHeight/2, canWidth / sqNum ,canHeight/2)

      if(this.blocksPos2[i] < -canWidth / 9) this.blocksPos2[i] = canWidth * (sqNum+1)/sqNum
      this.blocksPos2[i] -= this.speed1
      this.ctx.fillStyle = this.blocks2[i]
      this.ctx.fillRect(this.blocksPos2[i], 0, canWidth / sqNum ,canHeight/2)
    }
  }



  render() {

    let { canWidth, canHeight, width, height } = this.state

    let canProps = {
      width: canWidth,
      height: canHeight,
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

    let tempStyle = {
      display: 'block',
      background: 'rgba(255,255,255, 0.9)',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '200px',
      height: '180px',
      cursor: 'default',
      borderRadius: '3px',
      opacity: 0
    }

    return(
      <div ref = { c => { this.container = c }}
        className="day__container"
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onWheel={this.mouseWheel}
        onMouseOut={this.mouseUp}
        onMouseMove={this.mouseMove}>
        <CanvasCacher
          {...canProps}
          ref={ c => this.canvas = c } />
        <div
          ref={c => this.popup = c}
          className="hsbcdemo1__popup" style={tempStyle} />
      </div>
    )
  }
}
