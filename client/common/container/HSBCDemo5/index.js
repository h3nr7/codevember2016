import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import EarthObj from 'lib/EarthObj'
import { RibbonObj, FlatRibbonObj } from 'lib/RibbonObj'
import SignPostObj from 'lib/SignPostObj'
import DataTextureCanvas from 'lib/DataTextureCanvas'
import SignTextureCanvas from 'lib/SignTextureCanvas'


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
     this.canvasGroup = []
     this.signGroup = []
     this.signCanvasGroup = []


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


    this.texture = this.canvasGroup[0].getTexture()

    this.signTexture = this.signCanvasGroup[0].getTexture()

    this.gui.add(this, 'stopFrame')
    this.gui.add(this, 'hideCanvas')
    this.gui.add(this, 'rotate')

    this.gridHelper = new THREE.GridHelper( 300, 10 )
    this.gridHelper.visible = false
    this.scene.add( this.gridHelper )

    this.axisHelper = new THREE.AxisHelper( 300 )
    this.axisHelper.visible = false
    this.scene.add( this.axisHelper )

    this.gui.add(this.gridHelper, 'visible')
    this.gui.add(this.axisHelper, 'visible')

  }

  tick() {
    super.tick()

    this.canvasGroup.forEach(c => {
      if(!c) return //Guard to stop error from referencing when component updates
      let cDom = c.getCanvasDom()
      cDom.style.display = this.hideCanvas ? 'none' : 'block'

      if(!this.stopFrame) c.animate()
    })

    this.signCanvasGroup.forEach(c => {
      if(!c) return //Guard to stop error from referencing when component updates
      let cDom = c.getCanvasDom()
      cDom.style.display = this.hideCanvas ? 'none' : 'block'
      if(!this.stopFrame) c.animate()
    })

    this.earth.animate()

    this.raycaster.setFromCamera( this.mouseVector, this.camera )
    // let intersects = this.raycaster.intersectObjects( this.earth.group.children )
    let intersects = this.raycaster.intersectObjects( this.ribbonGroup )



    this.ribbonGroup.forEach(v => {
      v.material.color = new THREE.Color()
      this.earth.options.isRotating = this.rotate
    })

    this.signGroup.forEach( s => {

      s.mesh.lookAt( this.camera.position )
      // s.mesh.rotation.setFromRotationMatrix( this.camera.matrix );
    })

    this.currentIntersect = null

    intersects.forEach(v => {
      // if(v.object.name === 'globe' || v.object.name === 'atmosphere') return
      this.earth.options.isRotating = false
      v.object.material.color = new THREE.Color(0x000000)
      this.currentIntersect = v.object.name
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

    let euroAsia = this.addRibbon(europe.position, asia.position, 40, this.texture)
    let euroLatin = this.addRibbon(europe.position, latin.position, 40, this.texture)
    let euroMiddleeast = this.addRibbon(europe.position, middleeast.position, 40, this.texture)
    let euroAmerica = this.addRibbon(europe.position, america.position, 40, this.texture)

    let euroAsiaFlat = this.addRibbon(europe.flatPosition, asia.flatPosition, 40, this.texture, true)
    let euroLatinFlat = this.addRibbon(europe.flatPosition, latin.flatPosition, 50, this.texture, true)
    let euroMiddleeastFlat = this.addRibbon(europe.flatPosition, middleeast.flatPosition, 30, this.texture, true)
    let euroAmericaFlat = this.addRibbon(europe.flatPosition, america.flatPosition, 50, this.texture, true)

    this.euroAsiaSign = this.addSign(euroAsia.apex)
    this.euroLatinSign = this.addSign(euroLatin.apex)
    this.euroMiddleeastSign = this.addSign(euroMiddleeast.apex)
    this.euroAmericaSign = this.addSign(euroAmerica.apex)


    this.gui.add(this.earth.earthMesh.material, 'wireframe')
    this.gui.add(this.axisHelper, 'visible')
    this.gui.add(this.earth.earthUniform.mixAmount, 'value', 0, 1)
  }

  addSign(pos, texture = undefined) {
    let euroAsiaSign = new SignPostObj(undefined, undefined, {
      texture: this.signTexture
    })
    let euroAsiaApex = pos
    euroAsiaSign.mesh.position.x = euroAsiaApex.x
    euroAsiaSign.mesh.position.y = euroAsiaApex.y
    euroAsiaSign.mesh.position.z = euroAsiaApex.z

    this.earth.group.add(euroAsiaSign.mesh)
    this.signGroup.push(euroAsiaSign)

    return euroAsiaSign
  }

  addRibbon(pos1, pos2, width = 20, texture, isPerpendicular) {
    let tmp = new RibbonObj(pos1, pos2, { width, texture, isPerpendicular })
    this.earth.group.add(tmp.group)
    this.ribbonGroup.push(tmp.mesh)
    return tmp
  }


  renderTextureCanvas() {
    this.canvasGroup = []
    return(
      <div>
        <DataTextureCanvas
          canWidth
          canHeight
          gui = { this.gui }
          speed0 = {this.speed0 }
          speed1 = {this.speed1 }
          ref={ c => this.canvasGroup.push(c) } />
      </div>
    )
  }

  renderSignCanvas() {
    this.signCanvasGroup = []

    return (
      <div>
        <SignTextureCanvas
          canWidth = { 384 }
          canHeight = { 196 }
          ref={ c => this.signCanvasGroup.push(c) }/>
      </div>
    )
  }


  render() {
    let { canWidth, canHeight, width, height } = this.state

    return(
      <div ref = { c => { this.container = c }}
        className="day__container"
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onWheel={this.mouseWheel}
        onMouseOut={this.mouseUp}
        onMouseMove={this.mouseMove}>
        { this.renderTextureCanvas() }
        { this.renderSignCanvas() }
      </div>
    )
  }
}
