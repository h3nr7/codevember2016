import React, { Component } from 'react'
import * as THREE from 'three'
import ColladaLoader from 'three-collada-loader'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import { LongRibbonObj } from 'lib/RibbonObj'
import PrettyTextureCanvas from 'lib/PrettyTextureCanvas'
import ThreeNormalHelper from 'lib/ThreeNormalHelper'
export default class Day extends BasicThreeWithCam {

  constructor() {
    super({
      hasLight: true,
      lightIntensity: 1.5,
      zoomMin: 350
    })

    this.speed0 = 5.1
    this.speed1 = 1.8
    this.hideCanvas = true
    this.loaderComplete = this.loaderComplete.bind(this)
  }

  init() {
    super.init()

    this.points = []
    this.referencePoints = []
    this.ribbonGroup = []

    this.initTexture()

    this.loader = new ColladaLoader()
    this.loader.load('/public/obj/lee-perry-smith-head-scan.dae', this.loaderComplete)
  }

  initTexture() {
    this.texture = this.canvasGroup[0].getTexture()
  }

  loaderComplete(dae) {

    console.log(dae)

    dae.scene.traverse(child => {

        if (child instanceof THREE.Mesh) {
            var material = new THREE.MeshPhongMaterial({
              color: 0xff00ff,
              wireframe: true,
              visible: false
            })
            material.side = THREE.FrontSide
            child.material = material

        }


        if(child.name === 'jar' || child.name === 'Infinite') {
          child.children[0].geometry.center()
          child.children[0].geometry.scale(1200, 1200, 1200)
          child.children[0].geometry.rotateX( - Math.PI / 2 )
          child.children[0].geometry.rotateY( - Math.PI / 2 )
          child.children[0].geometry.rotateZ( - Math.PI / 2 )

          child.children[0].geometry.computeFaceNormals()
          child.children[0].geometry.computeVertexNormals()
          child.children[0].geometry.mergeVertices()
          child.children[0].geometry.verticesNeedUpdate = true

          let v = child.children[0].geometry.clone().vertices

          let nHelper = new ThreeNormalHelper(child.children[0].geometry)
          let n = nHelper.getVertexNormals()
          // let n = child.children[0].geometry.clone().normals

          // v.forEach( p => this.points.push(p))

          child.children[0].geometry.rotateX( Math.PI / 2 )

          let len = 128 * 64
          let size = v.length
          let adLen

          if (v.length > len) adLen = Math.floor( v.length / len )
          for (let i = 1; i < len; i++) {
            let num =  Math.ceil( (i - 1) * adLen + adLen * Math.random() )
            this.points.push(v[num])
            this.referencePoints.push(n[num].multiplyScalar(5).add(v[num]))
          }
        }
    })

    this.addRibbon(this.points, this.referencePoints, 2, this.texture, false)

    this.scene.add(dae.scene)
  }

  addRibbon(points, refPoints, width, texture, isPerpendicular) {
    let tmp = new LongRibbonObj(points, { width, texture, isPerpendicular, referencePoints: refPoints })
    this.ribbonGroup.push(tmp.group)
    this.scene.add(tmp.group)
  }

  tick() {
    super.tick()

    this.canvasGroup.forEach(c => {
      if(!c) return //Guard to stop error from referencing when component updates
      let cDom = c.getCanvasDom()
      cDom.style.display = this.hideCanvas ? 'none' : 'block'

      if(!this.stopFrame) c.animate()
    })
  }


  renderTextureCanvas() {
    this.canvasGroup = []
    return(
      <div>
        <PrettyTextureCanvas
          canWidth
          canHeight
          repeatS = { 2000 }
          repeatT = { 1 }
          gui = { this.gui }
          speed0 = { this.speed0 }
          speed1 = { this.speed1 }
          ref={ c => this.canvasGroup.push(c) } />
      </div>
    )

    this.gui.add(this, 'hideCanvas')
  }


  render() {
    return(
      <div ref = { c => { this.container = c }}
        className="day__container"
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onWheel={this.mouseWheel}
        onMouseOut={this.mouseUp}
        onMouseMove={this.mouseMove}>
        { this.renderTextureCanvas() }
      </div>
    )
  }
}
