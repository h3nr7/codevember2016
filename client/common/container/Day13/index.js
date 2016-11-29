import React, { Component } from 'react'
import * as THREE from 'three'
import Fbo from './Fbo'
import BasicThreeWithCam from 'container/Day0/BasicThreeWithCam'


export default class Day extends BasicThreeWithCam {

  constructor() {
    super()

    this.fboSettings = {
      width: 256,
      height: 256,
      density: 1
    }

  }

  getPoint(v,size) {
    //the 'discard' method, not the most efficient
    v.x = Math.random() * 2 - 1 ;
    v.y = Math.random() * 2 - 1 ;
    v.z = Math.random() * 2 - 1 ;
    if(v.length()>1) return this.getPoint(v,size);
    return v.normalize().multiplyScalar(size);
  }

  getSphere( count, size ){

      var len = count * 3;
      var data = new Float32Array( len );
      var p = new THREE.Vector3();
      for( var i = 0; i < len; i+=3 )
      {
          this.getPoint( p, size );
          data[ i     ] = p.x;
          data[ i + 1 ] = p.y;
          data[ i + 2 ] = p.z;
      }
      return data;
  }

  init() {
    super.init()

    let { width, height, density } = this.fboSettings
    let l = Math.ceil ( width * height * density )

    this.randomData = this.getSphere(l, 256)

    this.fbo = new Fbo( this.renderer, this.randomData )
    this.scene.add( this.fbo.particles )

  }

  tick() {
    super.tick()
    this.fbo.update()
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
