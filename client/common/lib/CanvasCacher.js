import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class CanvasCacher extends Component {

  constructor() {
    super()
  }

  componentWillMount() {
    this.setState(this.props)
  }

  resize(width, height) {

  }

  render() {

    let { windowWidth, windowHeight,
          display, position, style,
          width, height, left, top } = this.state

    let outStyle = Object.assign(style, {
      width: width + 'px',
      height: height + 'px',
      left: left,
      top: top
    })

    return <canvas
      style={outStyle}
      width={width + 'px'}
      height={height + 'px'}  />
  }
}

CanvasCacher.defaultProps = {
  display: 'block',
  position: 'absolute',
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  style: {}
}
