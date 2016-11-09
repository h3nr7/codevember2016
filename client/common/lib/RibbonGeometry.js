import * as THREE from 'three'


export default class RibbonGeometry {

  constructor({curve, referenceCurve, numSegments = 8, width = 10, closed = false } = {}) {

    this.numSegments = numSegments
    this.curve = curve
    this.refCurve = referenceCurve
    this.width = width
    this.closed = closed

    this.geometry = new THREE.Geometry()

    if(Math.abs(numSegments % 4) > 0) {
      console.warn('numSegments must be divisible by 4')
      return
    }

    // calculate all
    this._calFrames(curve, referenceCurve, numSegments)
    this.buildRibbon()
    this.buildUv()

    return this.geometry
  }

  buildRibbon() {

    let { numSegments, width } = this

    // create vertices
    for( let i = 0; i < numSegments; i+=2) {
      for( let j = 0; j < 2; j++) {

        this.geometry.vertices.push( this.binormals[i+j].clone().multiplyScalar(width / 2).add(this.curveGeo.vertices[i+j]) )
        this.geometry.vertices.push( this.binormals[i+j].clone().multiplyScalar(-width / 2).add(this.curveGeo.vertices[i+j]) )
      }
    }

    // create faces
    for( let k = 0, kl = numSegments * 2 - 2; k < kl; k+=2) {
      this.geometry.faces.push(new THREE.Face3(k, k+1, k+2))
      this.geometry.faces.push(new THREE.Face3(k+1, k+3, k+2))
    }

  }

  buildUv() {
    this.geometry.computeBoundingBox()

    let max = this.geometry.boundingBox.max,
        min = this.geometry.boundingBox.min
    let offset = new THREE.Vector2(0 - min.x, 0 - min.y)
    let range = new THREE.Vector2(max.x - min.x, max.y - min.y)
    let faces = this.geometry.faces

    this.geometry.faceVertexUvs[0] = []

    for (let i = 0; i < faces.length ; i++) {

        let v1 = this.geometry.vertices[faces[i].a],
            v2 = this.geometry.vertices[faces[i].b],
            v3 = this.geometry.vertices[faces[i].c]

        this.geometry.faceVertexUvs[0].push([
            new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
            new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
            new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
        ])
    }
    this.geometry.uvsNeedUpdate = true
  }


  /**
   * calculate normals
   * @param  {[type]} geo1 [description]
   * @param  {[type]} geo2 [description]
   * @return {[type]}      [description]
   */
  _calFrames(curve, refCurve, numSegments) {
    let norms = [], tangs = [], binorms = [],
      curveGeoPoints = [], curveRefGeoPoints = []

    this.curveGeo = new THREE.Geometry()
    this.curveRefGeo = new THREE.Geometry()



    for( let i = 0, len = numSegments; i < len; i++) {

      let curvePoint = curve.getPoint(i / numSegments)
      let curveRefPoint = refCurve.getPoint(i / numSegments)

      let tNorm = curveRefPoint.clone().sub(curvePoint).normalize()
      let tTang = refCurve.getTangentAt(i / numSegments)
      let tBiNorm = new THREE.Vector3()
      tBiNorm = tBiNorm.crossVectors(tNorm, tTang)

      norms[i] = tNorm
      tangs[i] = tTang
      binorms[i] = tBiNorm
      curveGeoPoints[i] = curvePoint
      curveRefGeoPoints[i] = curveRefPoint

    }

    this.normals = norms
    this.tangents = tangs
    this.binormals = binorms

    this.curveGeo.vertices = curveGeoPoints
    this.curveRefGeo.vertices = curveRefGeoPoints

  }






}
