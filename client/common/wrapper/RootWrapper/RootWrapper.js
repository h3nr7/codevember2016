import React from 'react'
import './RootWrapper.scss'
import Navi from 'container/Navi'

class RootWrapper extends React.Component {

  constructor() {
    super()
  }

  componentWillMount() {

  }

  render() {
    return(
      <div className="rootwrapper__mediahelper">
        <div className="rootwrapper__container">
            { this.props.children }
        </div>
        <Navi {...this.props}/>
      </div>
    )
  }
}

export default RootWrapper
