import React, { Component } from 'react'
import * as d3 from 'd3'

export default class Day1 extends Component {

  constructor() {
    super()
    this.links = []
    this.settings = {
      n: 20
    }

    this.ticked = this.ticked.bind(this)
    this.dragSubject = this.dragSubject.bind(this)
    this.dragStart = this.dragStart.bind(this)
    this.dragged = this.dragged.bind(this)
    this.dragEnd = this.dragEnd.bind(this)
    this.drawLink = this.drawLink.bind(this)
    this.drawNode = this.drawNode.bind(this)
  }

  componentDidMount() {
    let { n } = this.settings

    this.context = this.canvas.getContext('2d')
    this.width = this.canvas.width
    this.height = this.canvas.height

    this.nodes = d3.range(n * n).map((i) => {
      return { index: i }
    })

    for(let y = 0; y < n; ++y) {
      for(let x = 0; x < n; ++x) {
        if(y > 0) this.links.push({ source: (y - 1) * n + x, target: y * n + x })
        if(x > 0) this.links.push({ source: y * n + (x - 1), target: y * n + x })
      }
    }

    this.simulation = d3.forceSimulation(this.nodes)
      .force("charge", d3.forceManyBody().strength(-5))
      .force("link", d3.forceLink(this.links).strength(1).distance(10).iterations(10))
      .on("tick", this.ticked)

    d3.select(this.canvas)
      .call(d3.drag()
        .container(this.canvas)
        .subject(this.dragSubject)
        .on('start', this.dragStart)
        .on('drag', this.dragged)
        .on('end', this.dragEnd))

  }

  compoenntWillUnmount() {

  }

  ticked() {
    let { context } = this
    context.clearRect(0, 0, this.width, this.height)
    context.save()
    context.translate(this.width / 2, this.height / 2)

    context.beginPath()
    this.links.forEach(this.drawLink)
    context.strokeStyle = '#aba'
    context.stroke()

    context.beginPath()
    this.nodes.forEach(this.drawNode)
    context.fill()
    context.strokeStyle = '#fff'
    context.stroke()

    context.restore()
  }

  dragSubject(evt) {
    return this.simulation.find(d3.event.x - this.width / 2, d3.event.y - this.height / 2)
  }

  dragStart(evt) {
    if(!d3.event.active) this.simulation.alphaTarget(0.3).restart()
    d3.event.subject.fx = d3.event.subject.x
    d3.event.subject.fy = d3.event.subject.y
  }

  dragged(evt) {
    d3.event.subject.fx = d3.event.x
    d3.event.subject.fy = d3.event.y
  }

  dragEnd(evt) {
    if(!d3.event.active) this.simulation.alphaTarget(0)
    d3.event.subject.fx = null
    d3.event.subject.fy = null
  }

  drawLink(d) {
    this.context.moveTo(d.source.x, d.source.y);
    this.context.lineTo(d.target.x, d.target.y);
  }

  drawNode(d) {
    this.context.moveTo(d.x + 3, d.y);
    this.context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }

  render() {
    return(
      <div className="day1__container">
        <canvas ref = {(c) => { this.canvas = c }} width="960" height="960"></canvas>
      </div>
    )
  }
}
