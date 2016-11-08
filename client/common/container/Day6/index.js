import React, { Component } from 'react'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import * as THREE from 'three'


import ThreeNormalHelper from 'lib/ThreeNormalHelper'
import Quad from 'lib/ThreeQuad'

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

  init(){
    super.init()

    let cylinderGeo = this.initCylinder()
    console.log(cylinderGeo)
    let dat= this.initSpline({ pointArr: cylinderGeo.vertices })
    this.initSpline({ pointArr: cylinderGeo.combinedNormals })
    let ribbonGeo = this.initRibbon(Object.assign({ normals: cylinderGeo.normals }, dat))
  }

  initRenderer({ bgColor = 0xffffff } = {}) {
    super.initRenderer({ bgColor })
  }

  initCylinder() {

    this.cylinderMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF00FF,
      visible: false,
      wireframe: true
    })

    let geo = new THREE.CylinderGeometry(40, 40, 80, 8, 10)

    this.cylinderMesh = new THREE.Mesh( geo, this.cylinderMaterial )
    this.cylinderMesh.scale.set(2, 2, 2)

    this.cylinderMesh.updateMatrix()
    this.cylinderMesh.geometry.applyMatrix( this.cylinderMesh.matrix )
    this.cylinderMesh.position.set( 0, 0, 0 )
    this.cylinderMesh.rotation.set( 0, 0, 0 )
    this.cylinderMesh.scale.set( 1, 1, 1 )
    this.cylinderMesh.updateMatrix()

    geo.mergeVertices()
    geo.computeFaceNormals()
    geo.computeVertexNormals( true )


    let nHelper = new ThreeNormalHelper(geo)

    let normals = nHelper.getVertexNormals()
    let combinedNormals = nHelper.getCombinedNormals()
    let vertices = nHelper.getVertices()

    this.scene.add(this.cylinderMesh)

    console.log(geo)

    return { normals, combinedNormals, vertices }
  }

  initSpline({ pointArr = [] } = {}) {

    let material = new THREE.LineBasicMaterial({
      color: 0x00FFCC,
      visible: true
    })

    let curve = new THREE.CatmullRomCurve3( pointArr )
    curve.type = 'catmullrom'
    curve.tension = 0.5
    curve.closed = true

    let geo = new THREE.Geometry()
    geo.vertices = curve.getPoints( pointArr.length )

    console.log('tangent', curve.getTangent( 10 ).normalize())

    let splineObj = new THREE.Line( geo, material )

    this.scene.add(splineObj)

    return { curve: curve, tubularSegments: pointArr.length }
  }

  initRibbon({ curve, tubularSegments, normals }) {

    let material = new THREE.MeshLambertMaterial({
      color: 0xFFFF00,
      visible: true,
      wireframe: true
    })

    // let circle = new THREE.CylinderGeometry(40, 40, 80, 8, 10)
    //
    let geo = new THREE.TubeBufferGeometry( curve, tubularSegments, 10, 2, true )

    let mesh = new THREE.Mesh(geo, material)
    console.log('mma 1', mesh.geometry.normals[1])
    mesh.geometry.tangents = normals
    console.log('mma 2', mesh.geometry.normals[1])
    mesh.geometry.verticesNeedUpdate = true
    mesh.geometry.normalsNeedUpdate = true
    mesh.geometry.computeBoundingSphere()
    mesh.geometry.computeFaceNormals()
    mesh.geometry.computeVertexNormals()

    let material2 = new THREE.MeshBasicMaterial( { wireframe: true, color: 0xff00ff, color: 0xa30101, specular: 0x555555, shininess: 80, shading: THREE.FlatShading } )
    let mesh2 = new THREE.Mesh(geo, material2)

    // console.log(mesh)
    this.scene.add(mesh)

    this.scene.add(mesh2)

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
