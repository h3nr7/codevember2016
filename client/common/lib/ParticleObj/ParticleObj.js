import * as THREE from 'three'

export default class ParticleObj {

  constructor(start, end, opts) {
    this.options = Object.assign({
      numPoint: 24,
      color: 0x00FF00,
      duration: 8,
      closed: false
    }, opts)

    this.start = start || new THREE.Vector3()
    this.end = end || new THREE.Vector3()

    this.midpoint = this._getMidPoint(this.start, this.end, 0.5, 0.3)

    this.geometry = new THREE.Geometry()
    this.geometry.vertices.push(this.start)
    this.geometry.vertices.push
    this.geometry.vertices.push(this.end)

    this.curve = new THREE.CatmullRomCurve3([this.start, this.midpoint, this.end])
    this.curve.closed = true
    this.curveGeometry = new THREE.Geometry()
    this.curveGeometry.vertices = this.curve.getPoints( this.options.numPoint )


    this.group = new THREE.Object3D()

    this.drawLine()
    this.drawAttractor()

    this.startTime = Date.now()
    this.time = 0
  }

  /**
   * draw line
   * @return {[type]} [description]
   */
  drawLine() {
    let curveMaterial = new THREE.LineBasicMaterial({color: this.options.color, linewidth: 3})
    let curveLine = new THREE.Line(this.curveGeometry, curveMaterial)
    this.group.add(curveLine)

  }

  drawAttractor() {
    let attractorMaterial = new THREE.MeshBasicMaterial({color: 0x0000FF , wireframe: true})
    let attractorGeo = new THREE.ConeGeometry(2, 4, 8)
    attractorGeo.rotateX( Math.PI / 2 );
    this.attractorMesh = new THREE.Mesh(attractorGeo, attractorMaterial)
    this.group.add(this.attractorMesh)
  }


  animate() {
    this.time = (Date.now() - this.startTime) / 1000

    if(this.time > this.options.duration) {
      this.startTime = Date.now()
      this.time = 0
    }

    this.attractorMesh.lookAt(this.end)
    let pos = this.curve.getPointAt( this.time / this.options.duration )
    let look = this.curve.getTangentAt( this.time / this.options.duration )
    this.attractorMesh.lookAt(pos.clone().add(look))

    this.attractorMesh.position.x = pos.x
    this.attractorMesh.position.y = pos.y
    this.attractorMesh.position.z = pos.z
  }

  _getMidPoint(v0, v1, fraction = 0.5, verticalFraction = 0.35) {

    let dir = v1.clone().sub(v0)
    let len = dir.length()
    dir = dir.normalize().multiplyScalar( len * fraction )
    dir = v0.clone().add(dir)

    return dir.clone().add(dir.normalize().multiplyScalar(len * verticalFraction))
  }

}
