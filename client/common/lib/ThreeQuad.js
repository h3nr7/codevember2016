import { Geometry, Vertex, Vector3, Face3 } from 'three'

export default class Quad {

  constructor({ v0, v1, v2, v3 }) {
    this.geo = new Geometry()

    this.geo.vertices.push( v0 )
    this.geo.vertices.push( v1 )
    this.geo.vertices.push( v2 )
    this.geo.vertices.push( v3 )

    this.f3( 0, 1, 2 )
    this.f3( 0, 2, 3 )

    this.geo.computeFaceNormals()
    this.geo.computeVertexNormals()

    return this.geo
  }

  f3(a, b, c) {
    this.geo.faces.push( new Face3(a, b, c) )
  }

  setDoubleSided(b = true) {
    this.geo.doubleSided = b
  }

  setAutoUpdateMatrix(b = true) {
    this.geo.autoUpdateMatrix = b
  }

  scale({ x = 0, y = 0, z = 0 } = {}) {
    this.geo.scale.set(x, y, z)
  }




}
