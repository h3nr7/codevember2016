import React, { Component } from 'react'
import * as d3 from 'd3'

export default class Day extends Component {

  constructor() {
    super()
  }




  render() {
    return(
      <div ref = { c => { this.container = c }}
        className="day__container"
        onMouseMove={this.mouseMove}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}>
        <h2 className="inprogress">working on it...</h2>
      </div>
    )
  }
}
