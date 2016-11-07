import React, { Component } from 'react'
import {
  MeshBasicMaterial, TextureLoader,
  CylinderGeometry, Mesh, CatmullRomCurve3,
  Geometry, LineBasicMaterial, Line,
  PointsMaterial, Points
} from 'three'

import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'

export default class Day extends BasicThreeWithCam {

  constructor() {
    super()
  }

  componentWillMount() {
    super.componentWillMount()
  }

  componentDidMount() {
    super.componentDidMount()
  }

  init() {
    super.init()

    let cylinderGeo = this.initCylinder()
    this.initSpline({ pointArr: cylinderGeo.vertices })
    this.initPoint({ pointArr: cylinderGeo.vertices })

  }


  /**
   * init renderer
   * @return {[type]} [description]
   */
  initRenderer() {
    super.initRenderer({ bgColor: 0xffffff })
  }

  initCylinder() {

    this.cylinderMaterial = new MeshBasicMaterial({
      wireframe: false,
      color: 0xff00ff
    })

    let geo = new CylinderGeometry( 40, 40, 80, 8, 10 )

    this.cylinderMesh = new Mesh(geo, this.cylinderMaterial)
    this.cylinderMesh.scale.set(2, 2, 2)

    this.cylinderMesh.updateMatrix()
    this.cylinderMesh.geometry.applyMatrix( this.cylinderMesh.matrix )
    this.cylinderMesh.position.set( 0, 0, 0 )
    this.cylinderMesh.rotation.set( 0, 0, 0 )
    this.cylinderMesh.scale.set( 1, 1, 1 )
    this.cylinderMesh.updateMatrix()

    // Add GUI
    this.guiCyMaterial = this.guiAddFolder('Cylinder Material', true)
    this.guiAdd(this.guiCyMaterial, this.cylinderMaterial, 'wireframe')
    this.guiAdd(this.guiCyMaterial, this.cylinderMaterial, 'visible')

    this.scene.add(this.cylinderMesh)

    return geo
  }

  initSpline({ pointArr = [] } = {}) {
    let curve = new CatmullRomCurve3(pointArr)
    curve.type =  'catmullrom'
    curve.tension = 0.5
    let geo = new Geometry()
    geo.vertices = curve.getPoints( pointArr.length * 6 )

    let material = new LineBasicMaterial( { color : 0x00ffcc } )

    //Create the final Object3d to add to the scene
    let splineObject = new Line( geo, material )

    this.scene.add(splineObject)
  }

  initPoint({ pointArr = [] } = {}) {
    let geo = new Geometry()
    geo.vertices = pointArr
    this.dotMaterial = new PointsMaterial({
      color: 0xff00ff,
      size: 5,
      sizeAttenuation: false
    })
    let dot = new Points( geo, this.dotMaterial )

    // Add GUI
    this.guiDotMaterial = this.guiAddFolder('Dot Material')
    this.guiAdd(this.guiDotMaterial, this.dotMaterial, 'visible')

    this.scene.add(dot)
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
      </div>
    )
  }
}
