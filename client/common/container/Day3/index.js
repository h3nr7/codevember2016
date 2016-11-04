import React, { Component } from 'react'
import * as THREE from 'three'
import AbstractThreeIndex from 'container/Day0/AbstractThreeIndex'

export default class Day extends AbstractThreeIndex {

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
