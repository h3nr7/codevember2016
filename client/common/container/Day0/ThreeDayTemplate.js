import React, { Component } from 'react'
import * as THREE from 'three'
import AbstractThreeIndex from 'container/Day0/AbstractThreeIndex'

export default class ThreeDayTemplate extends AbstractThreeIndex {

  constructor() {
    super()
  }

  componentWillMount() {
    super.componentWillMount()
  }

  componentDidMount() {
    super.componentDidMount()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  init() {
    super.init()

    // TODO: add initialisation
  }

  tick() {
    super.tick()
    // TODO: tick function
  }


  render() {
    return(
      <div
        ref = { c => { this.container = c }}
        className="day__container">
      </div>
    )
  }
}
