import * as THREE from 'three'
const FV_NAMES = [ 'a', 'b', 'c', 'd' ]


export default class ThreeNormalHelper {

  constructor( geo ) {

    this.verticesLength = 0
    this.vertexNormalLength = 0
    this.normalScale = 1.1
    if(!!geo) this.setGeometry( geo )

    return this
  }

  /**
   * populate vertex normals
   * @return {[type]} [description]
   */
  populateVertexNormals() {

    let geo = this.geometry

    for( let f = 0, fl = geo.faces.length; f < fl; f ++ ) {
      let face = geo.faces[ f ];
      if( face.vertexNormals === undefined ) {
        continue;
      }
      for( let v = 0, vl = face.vertexNormals.length; v < vl; v ++ ) {
        this.vertexNormals[ face[ FV_NAMES[ v ] ] ] = face.vertexNormals[ v ]
      }
    }
  }

  /**
   *
   * populate vertices
   * @return {[type]} [description]
   */
  populateVertices() {
    let out = []
    this.geometry.vertices.forEach((e, i) => { out[i] = e })
    this.vertices = out
  }

  /**
   * set geometry
   * @param {[type]} geo [description]
   */
  setGeometry(geo) {

    geo.mergeVertices()
    geo.computeFaceNormals()
    geo.computeVertexNormals( true )

    this.geometry = geo
    this.vertexNormals = []
    this.vertices = []
    this.populateVertexNormals()
    this.populateVertices()

    return this
  }

  /**
   * GET VERTEX NORMALS
   * @return {[type]} [description]
   */
  getVertexNormals() {
    return this.vertexNormals
  }

  /**
   * GET VERTICES
   * @return {[type]} [description]
   */
  getVertices() {
    return this.vertices
  }

  getCombinedNormals() {
    return this.vertices.map((e, i) => {
      return e.clone().multiplyScalar(this.normalScale).add(this.vertexNormals[i])
    })
  }


}
