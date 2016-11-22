import * as THREE from 'three'
const PI = Math.PI

export default class FlatRibbonObj {


  constructor(start, end, opts = {}) {

    this.options = Object.assign({
      // Normalised
      name: undefined,
      color: 0x0000FF,
      numPoint: 50,
      width: 15,
      verticalDistance: 20,
      texture: undefined,
    }, opts)

    // Setup start, end and mid point
    this.start = start || new THREE.Vector3()
    this.end = end || new THREE.Vector3(400, 400, 400)
    this.midpoint = this._getMidPoint(this.start, this.end, 0.3)
    this.midpoint2 = this._getMidPoint(this.start, this.end, 0.5)
    this.midpoint3 = this._getMidPoint(this.start, this.end, 0.7)

    this.group = new THREE.Object3D()

    // higest point
    this.apex = this.midpoint2.clone()

    this.geometry = new THREE.Geometry()
    this.geometry.vertices.push(this.start)
    this.geometry.vertices.push
    this.geometry.vertices.push(this.end)

    this.curve = new THREE.CatmullRomCurve3([this.start, this.midpoint, this.midpoint2, this.midpoint3, this.end])

    this.curveGeometry = new THREE.Geometry()
    this.curveGeometry.vertices = this.curve.getPoints( this.options.numPoint )

    // this.drawLine()
    this.drawRibbon()


  }

  _getMidPoint(v0, v1, fraction) {
    let dir = v1.clone().sub(v0)
    let pos = v0.lerp(v1, fraction)
    pos.x += Math.abs( this.options.verticalDistance * (0.5 - fraction) )

    return pos
  }






}
