import * as THREE from 'three'

export default class SignPostObj {

  constructor(width = 64, height = 32, opts) {
    this.width = width
    this.height = height

    this.options = Object.assign({
      widthSegments: 1,
      heightSegments: 1,
      texture: undefined,
      color: undefined
    }, opts)

    this.init()
  }

  init() {

    let { width, height } = this
    let { depth, widthSegments, heightSegments, color, texture } = this.options

    this.geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
    this.geometry.translate(0, height, 0)
    this.geometry.rotateY(Math.PI)
    // this.geometry.rotateX(Math.PI/2)

    this.material = new THREE.MeshPhongMaterial({
      color,
      map: texture,
      shininess: 0,
      transparent: true,
    })
    this.material.side = THREE.DoubleSide

    this.mesh = new THREE.Mesh(this.geometry, this.material)

  }

  animate() {

  }
}
