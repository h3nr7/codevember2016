import React from 'react';

export default class CtaButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let { className, onClick, disabled, children, style, type, id, color } = this.props;
    let classType = ' ctabutton__type__' + type
    let disabledClass = disabled ? ' ctabutton__disabled' : ''
    return(
      <div id={id} className={"ctabutton__container " + className} style={style}>
        <button
          className={"ctabutton__button" + classType + " brand" + color + disabledClass}
          disabled={disabled}
          onClick={onClick}>
          {children}
        </button>
      </div>
    );
  }
}

CtaButton.propTypes = {
  onClick: React.PropTypes.func
};

CtaButton.defaultProps = {
  className: '',
  disabled: false,
  style: null,
  type: 'rectangle',
  color: 'white',
  id: null
};
