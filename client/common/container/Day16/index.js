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
     this.speed0 = 1
     this.speed1 = 1
     this.speed2 = 1
     this.speed3 = 1
     this.rotate = true

  }

  componentWillMount() {
    super.componentWillMount()
    this.earth = new EarthObj({
      isRotating: this.rotate,
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
    this.gui.add(this, 'speed2', 0.01, 10)
    this.gui.add(this, 'speed3', 0.01, 10)

  }

  tick() {
    super.tick()

    if(this.texture) this.texture.needsUpdate = true
    if(!this.stopFrame) this._animBlocks()
    this.canvasDOM.style.display = this.hideCanvas ? 'none' : 'block'
    this.earth.animate()

    this.raycaster.setFromCamera( this.mouseVector, this.camera )
    let intersects = this.raycaster.intersectObjects( this.earth.group.children )


    this.earth.group.children.forEach(v => {
      if(v.object) v.object.material.wireframe = false
      else if(v.material) v.material.wireframe = false
      this.earth.options.isRotating = this.rotate
    })

    this.currentIntersect = null

    intersects.forEach(v => {
      if(v.object.name === 'globe' || v.object.name === 'atmosphere') return
      this.earth.options.isRotating = false
      v.object.material.wireframe = true
      this.currentIntersect = v.object.name
    })
  }

  mouseDown(evt) {
    super.mouseDown(evt)
    console.log(this.currentIntersect)
    if(!!this.currentIntersect) {
      alert('Show details of ' + this.currentIntersect)
    }
  }

  _earthLoaded(evt) {
    this.scene.add(this.earth.group)

    this.earth.addCity()
    this.earth.addCity({ name: 'paris', lat:	48.864716, lng: 2.349014})
    this.earth.addCity({ name: 'hong kong', lat:	22.286394, lng: 114.149139})
    this.earth.addCity({ name: 'new york', lat: 40.792240, lng:	-73.138260})
    this.earth.addCity({ name: 'beijing', lat: 39.913818, lng:	116.363625})
    this.earth.addCity({ name: 'mumbai', lat: 19.075984, lng:	72.877656})
    this.earth.addCity({ name: 'milan', lat: 45.464211, lng: 	9.191383 })
    this.earth.addCity({ name: 'brazillia', lat: -14.235004, lng: -51.925280 })

    let london = this.earth.getCity('london')
    let paris = this.earth.getCity('paris')
    let hk = this.earth.getCity('hong kong')
    let newyork = this.earth.getCity('new york')
    let beijing = this.earth.getCity('beijing')
    let sydney = this.earth.getCity('mumbai')
    let milan = this.earth.getCity('milan')
    let brazillia = this.earth.getCity('brazillia')

    this.ribbon = new RibbonObj(london.position, hk.position, { texture: this.texture })
    this.ribbon2 = new RibbonObj(london.position, newyork.position, { texture: this.texture })
    this.ribbon3 = new RibbonObj(london.position, beijing.position, { texture: this.texture })
    this.ribbon4 = new RibbonObj(london.position, sydney.position, { texture: this.texture })
    this.ribbon7 = new RibbonObj(london.position, brazillia.position, { texture: this.texture })

    this.ribbon5 = new RibbonObj(london.position, paris.position, { width: 5, texture: this.texture })
    this.ribbon6 = new RibbonObj(london.position, milan.position, { width: 5, texture: this.texture })

    this.earth.group.add(this.ribbon.group)
    this.earth.group.add(this.ribbon2.group)
    this.earth.group.add(this.ribbon3.group)
    this.earth.group.add(this.ribbon4.group)
    this.earth.group.add(this.ribbon7.group)

    this.earth.group.add(this.ribbon5.group)
    this.earth.group.add(this.ribbon6.group)


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
      this.blocksPos[i]+= this.speed0
      this.ctx.fillStyle = this.blocks[i]
      this.ctx.fillRect(this.blocksPos[i], 0, canWidth / sqNum ,canHeight/4)

      if(this.blocksPos2[i] < -canWidth / 9) this.blocksPos2[i] = canWidth * (sqNum+1)/sqNum
      this.blocksPos2[i]-= this.speed1
      this.ctx.fillStyle = this.blocks2[i]
      this.ctx.fillRect(this.blocksPos2[i], canHeight/4, canWidth / sqNum ,canHeight/4)

      if(this.blocksPos3[i] > canWidth) this.blocksPos3[i] = -canWidth / sqNum
      this.blocksPos3[i]+= this.speed2
      this.ctx.fillStyle = this.blocks3[i]
      this.ctx.fillRect(this.blocksPos3[i], canHeight/2, canWidth / sqNum ,canHeight/4)

      if(this.blocksPos4[i] < -canWidth / 9) this.blocksPos4[i] = canWidth * (sqNum+1)/sqNum
      this.blocksPos4[i]-= this.speed3
      this.ctx.fillStyle = this.blocks4[i]
      this.ctx.fillRect(this.blocksPos4[i], canHeight*3/4, canWidth / sqNum ,canHeight/4)
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
      </div>
    )
  }
}
