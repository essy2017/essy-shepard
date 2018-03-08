'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class Button extends React.Component {

  render () {
    return (
      <button
        className="sbtn"
        onClick={this.props.onClick}
      >{this.props.label}</button>
    );
  }

}

Button.propTypes = {
  label   : PropTypes.string.isRequired,
  onClick : PropTypes.func.isRequired
};
