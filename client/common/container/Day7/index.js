
import React from 'react'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import earthVert from 'container/Day3/shader/earth.vert'
import earthFrag from 'container/Day3/shader/earth.frag'
import cloudVert from 'container/Day3/shader/cloud.vert'
import cloudFrag from 'container/Day3/shader/cloud.frag'
import atmosVert from 'container/Day3/shader/atmosphere.vert'
import atmosFrag from 'container/Day3/shader/atmosphere.frag'

const PI = Math.PI

export default class Day extends BasicThreeWithCam {

  constructor() {
    super()

    this.settings = {
      earthSize: 200
    }

    this.worldTexLoaded = this.worldTexLoaded.bind(this)
    this.cloudLoaded = this.cloudLoaded.bind(this)
    this.loadComplete = this.loadComplete.bind(this)
  }

  componentWillMount() {
    super.componentWillMount()

    this.loaderManager = new THREE.LoadingManager()
    this.textureLoader = new THREE.TextureLoader(this.loaderManager)

    this.loaderManager.onLoad = this.loadComplete
  }

  init() {
    super.init()

    // PRESET MATERIALS
    this.cityMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF66, visible: true })

    // LOAD ASSETS
    this.textureLoader.load('/public/texture/world2.jpg', this.worldTexLoaded)
    this.textureLoader.load('/public/texture/cloud.jpg', this.cloudLoaded)
  }

  createLocation({
    lat = 51.509865,
    lng = 	-0.118092,
    size = 2} = {} ) {

    let { earthSize } = this.settings
    let phi = -( 90 - lat ) * PI / 180
    let theta = ( 180 - lng ) * PI / 180

    let sinPhi = Math.sin(phi)
    let cosPhi = Math.cos(phi)
    let sinTheta = Math.sin(theta)
    let cosTheta = Math.cos(theta)

    let x = ( earthSize * sinPhi * cosTheta )
    let y = ( earthSize * cosPhi )
    let z = ( earthSize * sinPhi * sinTheta )

    let geo = new THREE.SphereBufferGeometry(size, 16, 16)

    geo.lookAt(this.scene.position)

    geo.applyMatrix( new THREE.Matrix4().makeTranslation(x, y, z) )
    let mesh = new THREE.Mesh(geo, this.cityMaterial)

    this.scene.add(mesh)

    return new THREE.Vector3(x, y, z)

  }

  createConnection({v0, v1, color = 0xFF00FF} = {}) {
    let midPoint = this._getMidPoint(v0, v1, 0.5)
    let len = v1.clone().sub(v0).length()

    midPoint = midPoint.clone().add(midPoint.normalize().multiplyScalar(len * 0.6))


    let curve = new THREE.QuadraticBezierCurve3(v0, midPoint, v1)
    let curveGeo = new THREE.Geometry()
    curveGeo.vertices = curve.getPoints( 50 )

    let curveMaterial = new THREE.LineBasicMaterial({color: color, linewidth: 3})
    let curveLine = new THREE.Line(curveGeo, curveMaterial)
    this.scene.add(curveLine)

  }

  worldTexLoaded(tex) {
    this.earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texture: { type: 't', value: tex }
      },
      vertexShader: earthVert,
      fragmentShader: earthFrag
    })

    let earthGeo = new THREE.SphereGeometry(this.settings.earthSize, 40, 30)
    this.earthMesh = new THREE.Mesh(earthGeo, this.earthMaterial)


    let point0 = this.createLocation()
    let point1 = this.createLocation({lat:	52.520008, lng: 13.404954})
    let point2 = this.createLocation({lat:	48.864716, lng: 2.349014})
    let point3 = this.createLocation({lat:	22.286394, lng: 114.149139})
    let point4 = this.createLocation({lat: 25.105497, lng:	121.597366})
    let point5 = this.createLocation({lat: 40.792240, lng:	-73.138260})
    let point6 = this.createLocation({lat: 	39.913818, lng:	116.363625})
    let point7 = this.createLocation({lat: 	-33.865143, lng:	151.209900})
    let point8 = this.createLocation({lat: 	-33.918861, lng: 18.423300  })
    let point9 = this.createLocation({lat: 	45.464211, lng: 	9.191383})

    this.createConnection({v0: point0, v1: point1})
    this.createConnection({v0: point0, v1: point2})
    this.createConnection({v0: point0, v1: point3})
    this.createConnection({v0: point0, v1: point4})
    this.createConnection({v0: point0, v1: point5, color: 0xCCFF00})
    this.createConnection({v0: point0, v1: point6, color: 0xCCFF00})
    this.createConnection({v0: point3, v1: point7, color: 0xCCFF00})
    this.createConnection({v0: point0, v1: point8, color: 0x00FFCC})
    this.createConnection({v0: point0, v1: point9, color: 0x00FFCC})
    this.createConnection({v0: point3, v1: point2, color: 0xffCC33})
    this.createConnection({v0: point3, v1: point4, color: 0xffCC33})
    this.createConnection({v0: point3, v1: point6})

  }

  cloudLoaded(tex) {
    let geo = new THREE.SphereGeometry(200, 40, 30)

    // this.atmosMaterial = new THREE.ShaderMaterial({
    //   uniforms: {},
    //   vertexShader: atmosVert,
    //   fragmentShader: atmosFrag,
    //   side: THREE.BackSide,
    //   blending: THREE.AdditiveBlending,
    //   transparent: true
    // })
    //
    // this.atmosMesh = new THREE.Mesh(geo, this.atmosMaterial)
    // this.atmosMesh.scale.set(1.04, 1.04, 1.04)

    this.cloudMaterial = new THREE.ShaderMaterial({
      uniforms: {
        percent: { type: 'f', value: 1.0 },
        texture: { type: 't', value: tex }
      },
      vertexShader: cloudVert,
      fragmentShader: cloudFrag,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    })

    this.atmosCloudMesh = new THREE.Mesh(geo, this.cloudMaterial)
    this.atmosCloudMesh.scale.set(1.04, 1.04, 1.04)

  }

  loadComplete() {
    this.scene.add(this.earthMesh)
    // this.scene.add(this.atmosMesh)
    this.scene.add(this.atmosCloudMesh)

    // Add GUI
    this.guiGlobeMaterial = this.guiAddFolder('Globe', true)
    this.guiAdd(this.guiGlobeMaterial, this.earthMaterial, 'visible')
    this.guiAdd(this.guiGlobeMaterial, this.cloudMaterial, 'visible')
    // this.guiAdd(this.guiGlobeMaterial, this.atmosMaterial, 'visible')

    this.guiLocationMaterial = this.guiAddFolder('Locations')
    this.guiAdd(this.guiLocationMaterial, this.cityMaterial, 'visible')
  }

  _getMidPoint(v0, v1, fraction) {
    let dir = v1.clone().sub(v0)
    let len = dir.length()
    dir = dir.normalize().multiplyScalar( len * fraction)
    return v0.clone().add(dir)
  }

  tick() {
    super.tick()
    if(this.atmosCloudMesh) {
      this.atmosCloudMesh.rotation.y += 0.00008
      this.atmosCloudMesh.rotation.x += 0.0001
    }
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
