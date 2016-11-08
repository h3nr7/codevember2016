import * as THREE from 'three'
import { BufferGeometry, Vector2, Vector3,
  Float32Attribute, Uint16Attribute, Uint32Attribute } from 'three';


/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Creates a tube which extrudes along a 3d spline.
 *
 */

function RibbonBufferGeometry( path, referencePath, tubularSegments, radius, closed ) {

	BufferGeometry.call( this );

	this.type = 'RibbonBufferGeometry';

  let radialSegments = 2;

	this.parameters = {
		path: path,
		tubularSegments: tubularSegments,
		radius: radius,
		radialSegments: radialSegments,
		closed: closed
	};

	tubularSegments = tubularSegments || 64;
	radius = radius || 1;
	closed = closed || false;

	// expose internals
  var frames = path.computeFrenetFrames( tubularSegments, closed );

  var normals = []
  var binormals = []

  _calFrames()

	this.tangents = frames.tangents;
	this.normals = normals;
	this.binormals = binormals;

	// helper variables

	var vertex = new Vector3();
	var normal = new Vector3();
	var uv = new Vector2();

	var i, j;

	// buffer

	var vertices = [];
	var normals = [];
	var uvs = [];
	var indices = [];

	// create buffer data

	generateBufferData();
  _calFrames();

	// build geometry

	this.setIndex( ( indices.length > 65535 ? Uint32Attribute : Uint16Attribute )( indices, 1 ) );
	this.addAttribute( 'position', Float32Attribute( vertices, 3 ) );
	this.addAttribute( 'normal', Float32Attribute( normals, 3 ) );
	this.addAttribute( 'uv', Float32Attribute( uvs, 2 ) );

	// functions

	function generateBufferData() {

		for ( i = 0; i < tubularSegments; i ++ ) {

			generateSegment( i );

		}

		// if the geometry is not closed, generate the last row of vertices and normals
		// at the regular position on the given path
		//
		// if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

		generateSegment( ( closed === false ) ? tubularSegments : 0 );

		// uvs are generated in a separate function.
		// this makes it easy compute correct values for closed geometries

		generateUVs();

		// finally create faces

		generateIndices();

	}

  function _calFrames() {

    for( let i = 0; i < tubularSegments; i++) {
      // Calculate normals
      let point = path.getPointAt( i / tubularSegments )
      let refPoint = referencePath.getPointAt( i / tubularSegments )
      normals[i] = refPoint.clone().sub(point).normalize()

      // calculate binormals
      let tang = path.getTangentAt(i / tubularSegments)
      let tmp = new THREE.Vector3()
      binormals[i] = tmp.crossVectors(tang, normals[i])
      console.log('meme', normals[i])
    }

    if(closed) {
      normals.push(normals[0].clone())
      binormals.push(binormals[0].clone())
    }

  }

	function generateSegment( i ) {

		// we use getPointAt to sample evenly distributed points from the given path

		var P = path.getPointAt( i / tubularSegments );

		// retrieve corresponding normal and binormal

		var N = frames.normals[ i ];
		var B = frames.binormals[ i ];

		// generate normals and vertices for the current segment

		for ( j = 0; j <= radialSegments; j ++ ) {

			var v = j / radialSegments * Math.PI * 2;

			var sin =   Math.sin( v );
			var cos = - Math.cos( v );

			// normal

			normal.x = ( cos * N.x + sin * B.x );
			normal.y = ( cos * N.y + sin * B.y );
			normal.z = ( cos * N.z + sin * B.z );
			normal.normalize();

			normals.push( normal.x, normal.y, normal.z );

			// vertex

			vertex.x = P.x + radius * normal.x;
			vertex.y = P.y + radius * normal.y;
			vertex.z = P.z + radius * normal.z;

			vertices.push( vertex.x, vertex.y, vertex.z );

		}

	}

	function generateIndices() {

		for ( j = 1; j <= tubularSegments; j ++ ) {

			for ( i = 1; i <= radialSegments; i ++ ) {

				var a = ( radialSegments + 1 ) * ( j - 1 ) + ( i - 1 );
				var b = ( radialSegments + 1 ) * j + ( i - 1 );
				var c = ( radialSegments + 1 ) * j + i;
				var d = ( radialSegments + 1 ) * ( j - 1 ) + i;

				// faces

				indices.push( a, b, d );
				indices.push( b, c, d );

			}

		}

	}

	function generateUVs() {

		for ( i = 0; i <= tubularSegments; i ++ ) {

			for ( j = 0; j <= radialSegments; j ++ ) {

				uv.x = i / tubularSegments;
				uv.y = j / radialSegments;

				uvs.push( uv.x, uv.y );

			}

		}

	}

}

RibbonBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
RibbonBufferGeometry.prototype.constructor = RibbonBufferGeometry;


export default RibbonBufferGeometry;
