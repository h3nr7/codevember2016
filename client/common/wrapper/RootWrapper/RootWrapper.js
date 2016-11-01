import React from 'react'
import './RootWrapper.scss'

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
      </div>
    )
  }
}

export default RootWrapper
