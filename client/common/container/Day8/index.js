import React, { Component } from 'react'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import * as THREE from 'three'

export default class Day extends BasicThreeWithCam {

  constructor() {
    super()

    this.settings = {
      divisions: 100,
      lineLen: 20
    }
  }

  componentWillMount() {
    super.componentWillMount()
    // COMMON debug style
    this.lineMaterial = new THREE.LineBasicMaterial({color: 0xFF00FF})
    this.meshMaterial = new THREE.MeshBasicMaterial({color: 0x00FFFF, wireframe: true})
  }

  init() {
    super.init()

    this.initCurve()
    this.initRibbon()
  }

  initRenderer() {
    super.initRenderer({bgColor: 0xFFFFFF})
  }

  initCurve() {

    let lineVert2 = [
      new THREE.Vector3(10, 10, 10),
      new THREE.Vector3(60, 60, 60),
      new THREE.Vector3(50, -50, -20),
      new THREE.Vector3(100, 150, 0),
      new THREE.Vector3(-15, 50, -5)
    ]

    let lineVert1 = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(30, 30, 30),
      new THREE.Vector3(100, -100, -20),
      new THREE.Vector3(200, 300, 0),
      new THREE.Vector3(-30, 100, -10)
    ]

    let curve1 = new THREE.CatmullRomCurve3(lineVert1)
    curve1.closed = true
    let geo1 = new THREE.Geometry()
    geo1.vertices = curve1.getPoints( this.settings.divisions )

    let curve2 = new THREE.CatmullRomCurve3(lineVert2)
    curve2.closed = true
    let geo2 = new THREE.Geometry()
    geo2.vertices = curve2.getPoints( this.settings.divisions )

    let line1 = new THREE.Line(geo1, this.lineMaterial)
    let line2 = new THREE.Line(geo2, this.lineMaterial)


    this.guiDebug = this.guiAddFolder('Debug')
    this.guiAdd(this.guiDebug, this.lineMaterial, 'visible')

    let norms = this._normals(geo1, geo2)
    let tangs = this._tangents(curve1, this.settings.divisions)
    let binormals = []
    norms.forEach((e, i) => {
      this.ar = new THREE.ArrowHelper( e, geo1.vertices[i], this.settings.lineLen, 0x00CC00 )
      this.scene.add(this.ar)
    })

    tangs.forEach((e, i) => {

      this.ar2 = new THREE.ArrowHelper( e, geo1.vertices[i], this.settings.lineLen, 0x003366 )
      this.scene.add(this.ar2)

      let bi = new THREE.Vector3()
      bi.crossVectors(norms[i], e)

      binormals.push(bi.clone())

      this.ar3 = new THREE.ArrowHelper( bi, geo1.vertices[i], this.settings.lineLen, 0x663300 )
      this.scene.add(this.ar3)

      // let biReflect = bi.clone().multiplyScalar(-1)
      // this.ar4 = new THREE.ArrowHelper( biReflect, geo1.vertices[i], this.settings.lineLen, 0x663300 )
      // this.scene.add(this.ar4)


    })

    this.normals = norms
    this.tangents = tangs
    this.binormals = binormals
    this.mainGeo = curve1.getPoints( this.settings.divisions )

    this.curve1 = curve1
    this.curve2 = curve2

    this.scene.add(line1)
    this.scene.add(line2)

  }

  initRibbon() {
    // this.ribbonGeo = new RibbonBufferGeometry(this.curve1, this.curve2, this.settings.divisions, 20, true)

    let { divisions } = this.settings

    this.ribbonGeo = new THREE.Geometry()
    for( let i = 0; i < divisions; i+=2) {
      for( let j = 0; j < 2; j++) {

        let bi = this.binormals[i+j].clone().multiplyScalar(5).add(this.mainGeo[i+j])
        let biReflect = this.binormals[i+j].clone().multiplyScalar(-5).add(this.mainGeo[i+j])

        this.ribbonGeo.vertices.push(bi)
        this.ribbonGeo.vertices.push(biReflect)
      }
    }

    for( let k = 0, kl = divisions * 2 - 2; k < kl; k+=2) {
      this.ribbonGeo.faces.push(new THREE.Face3(k, k+1, k+2))
      this.ribbonGeo.faces.push(new THREE.Face3(k+1, k+3, k+2))
    }

    console.log(this.ribbonGeo)

    let material = new THREE.MeshBasicMaterial({color:0x3300CC, wireframe: false})
    material.side = THREE.DoubleSide
    let mesh = new THREE.Mesh(this.ribbonGeo, material)

    this.scene.add(mesh)
  }

  _normals(geo1, geo2) {
    return geo1.vertices.map((e, i) => {
      return geo2.vertices[i].clone().sub(e).normalize()
    })
  }

  _tangents(curve, devisions) {
    let output = []
    for(let i=0; i < devisions; i++) {
      output[i] = curve.getTangentAt(i / devisions)

    }

    return output
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
