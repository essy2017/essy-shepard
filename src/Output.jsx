'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import ToneControl from './ToneControl';

/*******************************************************************************
 *
 * Wrapper for single ToneControl with label.
 * @class Output
 * @extends React.Component
 *
 ******************************************************************************/
export default class Output extends React.Component {

 /**
  * Renders component.
  * @method render
  */
  render () {
    const props = this.props;
    return (
      <div className={'output ' + props.className} style={{ marginLeft: props.left, width: props.width }}>
        <div className="label">{props.label}</div>
        <div className="controls">
          <ToneControl
            domain={[0, 1]}
            height={props.ctrlHeight}
            onChange={props.onChange}
            value={props.value}
            width={props.ctrlWidth}
          />
        </div>
      </div>
    );
  }

}

/**
 * Default component property values.
 * @property defaultProps
 * @type Object
 * @static
 */
Output.defaultProps = {
  className: ''
};

/**
 * Component property definitions.
 * @property propTypes
 * @type Object
 * @static
 */
Output.propTypes = {
  className  : PropTypes.string,
  ctrlHeight : PropTypes.number.isRequired,
  ctrlWidth  : PropTypes.number.isRequired,
  left       : PropTypes.number.isRequired,
  onChange   : PropTypes.func.isRequired,
  value      : PropTypes.number.isRequired,
  width      : PropTypes.number.isRequired
};
