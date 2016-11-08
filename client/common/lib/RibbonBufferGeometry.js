import {
  BufferGeometry, Float32Attribute, Uint16Attribute, Uint32Attribute,
  Vector2, Vector3
 } from 'three'

 export default class RibbonBufferGeometry extends BufferGeometry {

   constructor({ path, normalPath, tubularSegments = 64, radius = 2, closed } = {}) {
     super()

     this.parameters = {
       path: path,
       tubularSegments: tubularSegments,
       radius: radius,
       closed: closed
     }

    //  this.tangents = 
   }

   generateBufferData() {

   }

   generateSegment( i ) {

   }

   generateIndices() {

   }

   generateUVs() {

   }


 }
