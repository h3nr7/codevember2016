import React from 'react'
import './RootWrapper.scss'
import Navi from 'container/Navi'
import HSBCNavi from 'container/HSBCNavi'

class RootWrapper extends React.Component {

  constructor() {
    super()
  }

  render() {

    let hsbcPathCheck = new RegExp(/hsbc/)
    let isHsbc = hsbcPathCheck.test(this.props.location.pathname)

    return(
      <div className="rootwrapper__mediahelper">
        <div className="rootwrapper__container">
            { this.props.children }
        </div>
        { isHsbc ? <HSBCNavi {...this.props}/> : <Navi {...this.props}/> }
      </div>
    )
  }
}

export default RootWrapper
