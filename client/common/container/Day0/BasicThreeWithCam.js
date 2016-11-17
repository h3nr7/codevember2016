import AbstractThreeIndex from './AbstractThreeIndex'
import { DirectionalLight, Vector2 } from 'three'
const PI_HALF = Math.PI / 2

export default class BasicThreeWithCam extends AbstractThreeIndex {

  constructor(opts = {}) {
    super()

    this.options = Object.assign({
      hasLight: false,
      lightIntensity: 0.6,
      zoomMax: 1500,
      zoomMin: 500
    }, opts)
  }

  componentWillMount() {

    super.componentWillMount()

    this.isMouseDown = false
    this.mouse = { x:0, y:0 }
    this.mouseRaw = { x: 0, y: 0 }
    this.mouseOnDown = { x:0, y:0 }
    this.rotation = { x:0 , y:0 , z:0 }
    this.target = { x: Math.PI*3/2, y: Math.PI / 6.0 }
    this.targetOnDown = { x: 0, y: 0 }

    this.distance = 1000
    this.distanceTarget = 1000

    this.mouseVector = new Vector2()

    this.gui = new dat.GUI({ autoPlace: false })
    this.gui.close()
  }

  componentDidMount() {
    super.componentDidMount()
    this.gui.domElement.style.position = 'absolute'
    this.gui.domElement.style.top = '2rem'
    this.gui.domElement.style.right = '0px'
    this.container.appendChild(this.gui.domElement)
  }

  init() {
    super.init()
    this.time = 0
    this.startTime = Date.now()
    if( this.options.hasLight ) this.initLight()
  }

  initCamera(z = 300, viewAngle = 30, near = 1, far = 1000000) {
    super.initCamera(this.distance, viewAngle, near, far)
  }

  initLight() {
    this.directLight = new DirectionalLight(0xFFFFFF, this.options.lightIntensity)
    this.scene.add(this.directLight)
  }

  tick() {

    this.time = Date.now() - this.startTime

    this.rotation.x += (this.target.x - this.rotation.x) * 0.1
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1
    this.distance += (this.distanceTarget - this.distance) * 0.3

    this.camera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y)
    this.camera.position.y = this.distance * Math.sin(this.rotation.y)
    this.camera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y)

    if(this.directLight) {
      let { x, y, z } = this.camera.position
      this.directLight.position.set(x, y, z)
    }

    this.camera.lookAt(this.scene.position)
  }

  zoom(z) {
    let { zoomMax, zoomMin } = this.options
    this.distanceTarget -= z
    this.distanceTarget = this.distanceTarget > zoomMax ? zoomMax : this.distanceTarget
    this.distanceTarget = this.distanceTarget < zoomMin ? zoomMin : this.distanceTarget
  }

  mouseDown(event) {
    event.preventDefault()
    this.isMouseDown = true

    this.mouseOnDown.x = - event.clientX
    this.mouseOnDown.y = event.clientY

    this.targetOnDown.x = this.target.x
    this.targetOnDown.y = this.target.y
  }

  mouseUp(event) {
    this.isMouseDown = false
  }

  mouseOut(event) {
    this.isMouseDown = false
  }

  mouseWheel(event) {
    event.preventDefault()
    this.zoom(event.deltaY * 0.3)
  }

  mouseMove(event) {

    let { width, height } = this.state
    let { offsetLeft, offsetTop } = this.renderer.domElement || {}

    if(this.isMouseDown) {
      this.mouse.x = - event.clientX;
      this.mouse.y = event.clientY;
      let zoomDamp = this.distance/1000;

      this.target.x = this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005 * zoomDamp;
      this.target.y = this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005 * zoomDamp;

      this.target.y = this.target.y > PI_HALF ? PI_HALF : this.target.y;
      this.target.y = this.target.y < - PI_HALF ? - PI_HALF : this.target.y;

    }

    this.mouseRaw.x = event.clientX
    this.mouseRaw.y = event.clientY
    this.mouseVector.x = ( (event.clientX - offsetLeft) / width ) * 2 - 1
    this.mouseVector.y = -( (event.clientY - offsetTop) / height ) * 2 + 1
    // this.mouseVector.x = ( event.clientX / window.innerWidth ) * 2 - 1
    // this.mouseVector.y = - ( event.clientY / window.innerHeight ) * 2 + 1
  }

  /**
   * on resize handler
   * @return {[type]} [description]
   */
  onResize() {

    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    this.camera.aspect =  window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize( window.innerWidth, window.innerHeight)
  }

  guiAddFolder(name, isOpen = false) {
    let folder = this.gui.addFolder(name)
    if(isOpen) folder.open()
    return folder
  }

  /**
   * add GUI variable
   * @param  {[type]} obj  [description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  guiAdd(folder, obj, name, opt = undefined) {
    folder = !!folder ? folder : this.gui
    let controller = folder.add(obj, name, opt)
    return controller
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
