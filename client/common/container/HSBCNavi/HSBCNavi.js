import React, { Component } from 'react'
import Moment from 'moment'
import { Link } from 'react-router'
import './HSBCNavi.scss'

export default class HSBCNavi extends Component {

  constructor() {
    super()
    this.dayButton = []
  }


  render() {
    return (
      <div className="hsbcnavi__container">
        <div className="hsbcnavi__logo" />
      </div>
    )
  }
}

HSBCNavi.contextTypes = {
  router: React.PropTypes.object.isRequired
}
