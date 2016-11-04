import React, { Component } from 'react'
import Moment from 'moment'
import { Link } from 'react-router'
import './Navi.scss'

export default class Navi extends Component {

  constructor() {
    super()
    this.dayButton = []
  }

  renderDays() {
    let output = []
    let range = Number(Moment().date()) - 1
    let { pathname } = this.props.location

    for(let i = 0; i < range; i++) {
      let d = (i+1)
      let toPath = '/day/' + d

      let linkOutput = <Link
        ref = { c => this.dayButton.push(c) }
        key={'day' + i}
        to={'/day/' + d}
        className={"navi__day"}>{d}</Link>

      let divOutput = <a
        ref = { c => this.dayButton.push(c) }
        key={'day' + i}
        className={"navi__day current"}>{d}</a>

      output.push((pathname === toPath) ? divOutput : linkOutput)
    }

    return <div className="navi__daycontainer"><span className="navi__title">CODEVEMBER_2016</span> {output}</div>

  }

  render() {
    return (
      <div className="navi__container">
        <a className="navi__logo" href='http://monkiki.co'/>
        { this.renderDays() }
      </div>
    )
  }
}

Navi.contextTypes = {
  router: React.PropTypes.object.isRequired
}
