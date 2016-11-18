import React from 'react'
import ReactDOM from 'react-dom'
import BaseCanvas from './BaseCanvas'
import CanvasCacher from 'lib/CanvasCacher'
import * as THREE from 'three'


export default class SignTextureCanvas extends BaseCanvas {

  constructor() {
    super()

  }


  init() {
    super.init()
    let { width, height } = this.props

  }

  animate() {
    super.animate()

  }


}

SignTextureCanvas.defaultProps = {
  width: 256,
  height: 128,
}
