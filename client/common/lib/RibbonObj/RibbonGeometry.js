import * as THREE from 'three'


export default class RibbonGeometry {

  constructor({
    curve,
    referenceCurve,
    numSegments = 8,
    width = 10,
    isVariableWidth = true,
    closed = false } = {}) {

    this.numSegments = numSegments
    this.isVariableWidth = isVariableWidth
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

    let { numSegments, width, isVariableWidth } = this

    let halfNumSegments = numSegments / 2

    // create vertices
    for( let i = 0; i < numSegments; i+=2) {
      for( let j = 0; j < 2; j++) {

        let outWidth = width
        if( isVariableWidth ) {
          let deci = 1 - Math.abs( numSegments - (i+j) ) / numSegments
          outWidth = this._quadratic(deci, width)
        }


        this.geometry.vertices.push( this.binormals[i+j].clone().multiplyScalar(outWidth).add(this.curveGeo.vertices[i+j]) )
        this.geometry.vertices.push( this.binormals[i+j].clone().multiplyScalar(-outWidth).add(this.curveGeo.vertices[i+j]) )
      }
    }

    // create faces
    for( let k = 0, kl = numSegments * 2 - 2; k < kl; k+=2) {
      this.geometry.faces.push(new THREE.Face3(k, k+1, k+2))
      this.geometry.faces.push(new THREE.Face3(k+2, k+3, k+1))
    }

    this.geometry.computeFaceNormals()
    this.geometry.computeBoundingBox()
  }

  buildUv() {

    let max = this.geometry.boundingBox.max,
        min = this.geometry.boundingBox.min

    let offset = new THREE.Vector2(0, 0)
    let range = new THREE.Vector2((max.x - min.x), max.y - min.y)
    let faces = this.geometry.faces

    this.geometry.faceVertexUvs[0] = []

    for (let i = 0; i < faces.length ; i+=2) {


      let v1 = this.geometry.vertices[faces[i].a],
          v2 = this.geometry.vertices[faces[i].b],
          v3 = this.geometry.vertices[faces[i].c],
          v4 = this.geometry.vertices[faces[i+1].a],
          v5 = this.geometry.vertices[faces[i+1].b],
          v6 = this.geometry.vertices[faces[i+1].c]


      this.geometry.faceVertexUvs[0].push([
        new THREE.Vector2(i / ( faces.length ) , 0 ),
        new THREE.Vector2(i / ( faces.length ) , 1 ),
        new THREE.Vector2(i / ( faces.length ) , 0 )
      ], [
        new THREE.Vector2(i / ( faces.length ) , 0 ),
        new THREE.Vector2(i / ( faces.length ) , 1 ),
        new THREE.Vector2(i / ( faces.length ) , 1 )
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
      let curveRefPoint = refCurve ? refCurve.getPoint(i / numSegments) : curvePoint.clone().multiplyScalar(2)

      let tNorm = curveRefPoint.clone().sub(curvePoint).normalize()
      let tTang = refCurve ? refCurve.getTangentAt(i / numSegments) : curve.getTangentAt(i / numSegments)
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

  _quadratic(t, w) {
    return t * (1 - t) * w
  }






}
