import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'
import { generateRandomColor } from 'lib/GenericHelper'
import CanvasCacher from './CanvasCacher'
import RibbonGeometry from 'lib/RibbonGeometry'

export default class Day extends BasicThreeWithCam {

  constructor() {
    super()
    this.hideCanvas = true

  }

  componentWillMount() {
    super.componentWillMount()
    this.setState({
      canWidth: 256,
      canHeight: 256,
      sqSize: 8
    })

  }

  componentDidMount() {
    super.componentDidMount()
    let canvas = ReactDOM.findDOMNode(this.canvas)
    this.ctx = canvas.getContext('2d')

    let curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,10,0), new THREE.Vector3(50, 50, 70), new THREE.Vector3(100, 100, 100))
    let refCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(20, 20, 0), new THREE.Vector3(60, 60, 60), new THREE.Vector3(120, 120, 120))


    this._buildBlocks()


    let ribbonGeo = new RibbonGeometry({
      curve: curve,
      referenceCurve: refCurve,
      numSegments: 24,
      width: 256
    })

    this.texture = new THREE.Texture(canvas)

    // let material = new THREE.MeshBasicMaterial({color: 0xFF00FF, wireframe: true})
    let material = new THREE.MeshBasicMaterial({ map: this.texture })
    material.side = THREE.DoubleSide

    let mesh = new THREE.Mesh(ribbonGeo, material)


    console.log(ribbonGeo)

    this.gui.add(this, 'hideCanvas')

    this.scene.add(mesh)

  }

  onResize(event) {
    super.onResize(event)
  }

  _buildBlocks() {
    if(!this.ctx) return
    let { sqSize, canWidth, canHeight } = this.state
    let xW = canWidth / sqSize
    let yW = canHeight / sqSize
    let area = xW * yW

    for(let i = 0; i < xW; i++) {
      for(let j = 0; j < yW; j++) {
        this.ctx.fillStyle = generateRandomColor()
        this.ctx.fillRect(i * sqSize, j * sqSize, sqSize ,sqSize)
      }
    }
  }


  tick() {
    if(this.texture) this.texture.needsUpdate = true

    ReactDOM.findDOMNode(this.canvas).style.display = this.hideCanvas ? 'none' : 'block'
    this._buildBlocks()
    super.tick()
  }

  render() {

    let { width, height, canWidth, canHeight } = this.state

    let canProps = {
      width: canWidth,
      height: canHeight,
      left: (width - canWidth) / 2,
      top: (height - canHeight) / 2,
      style: {
        position: 'absolute',
        display: 'none',
        borderStyle: 'solid',
        borderWeight: '1px',
        borderColor: 'black',
        // zIndex: -99
      }
    }

    return(
      <div ref = { c => { this.container = c }}
        className="day__container"
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onWheel={this.mouseWheel}
        onMouseOut={this.mouseUp}
        onMouseMove={this.mouseMove}>
        <CanvasCacher
          {...canProps}
          ref={ c => this.canvas = c } />
      </div>
    )
  }
}
