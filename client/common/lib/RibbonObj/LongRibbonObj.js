import * as THREE from 'three'
import RibbonGeometry from './RibbonGeometry'

const PI = Math.PI

export default class LongRibbonObj {

  constructor(points, opts = {}) {

    this.options = Object.assign({
      // Normalised
      referencePoints: undefined,
      name: undefined,
      color: 0x0000FF,
      width: 5,
      numPoint: points.length * 10,
      texture: undefined,

      isPerpendicular: false
    }, opts)


    this.points = points
    this.group = new THREE.Object3D()

    this.curve = new THREE.CatmullRomCurve3(this.points)
    if(this.options.referencePoints) this.refCurve = new THREE.CatmullRomCurve3(this.options.referencePoints)

    this.curveGeometry = new THREE.Geometry()
    this.curveGeometry.vertices = this.curve.getPoints( this.options.numPoint )

    this.refCurveGeometry = new THREE.Geometry()
    this.refCurveGeometry.vertices = this.refCurve.getPoints( this.options.numPoint )

    // this.drawLine()
    this.drawRibbon()

  }

  /**
   * draw line
   * @return {[type]} [description]
   */
  drawLine() {
    let curveMaterial = new THREE.LineBasicMaterial({color: this.options.color, linewidth: 1})
    let curveLine = new THREE.Line(this.curveGeometry, curveMaterial)
    this.group.add(curveLine)

    let refCurveMaterial = new THREE.LineBasicMaterial({color: 0xff00ff, linewidth: 3})
    let refCurveLine = new THREE.Line(this.refCurveGeometry, refCurveMaterial)
    this.group.add(refCurveLine)
  }

  drawRibbon() {

    let maxSeg = 36736 * 2
    let totSeg = this.points.length * 1024
    let ribbonGeo = new RibbonGeometry({
      curve: this.curve,
      referenceCurve: this.refCurve,
      isVariableWidth: false,
      numSegments: totSeg < maxSeg ? totSeg : maxSeg,
      width: this.options.width
    })


    let material = new THREE.MeshPhongMaterial({
      map: this.options.texture,
      shininess: 0,
      transparent: true,
      shading: THREE.FlatShading
    })

    material.side = THREE.DoubleSide
    this.mesh = new THREE.Mesh(ribbonGeo, material)
    if(this.options.name) this.mesh.name = this.options.name
    this.group.add(this.mesh)

  }



}
