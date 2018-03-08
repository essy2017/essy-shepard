'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import ToneControl from './ToneControl';

export default class Output extends React.Component {

  render () {
    const props = this.props;
    return (
      <div className="output">
        <div className="label">Output</div>
        <div className="controls">
          <ToneControl
            className="tone-control-vol"
            domain={[0, 1]}
            height={props.ctrlHeight}
            onChange={props.onChangeVolume}
            value={props.volume}
            width={props.ctrlWidth}
          />
        </div>
      </div>
    );
  }

}

/**
 * Component property definitions.
 * @property propTypes
 * @type Object
 * @static
 */
Output.propTypes = {
  ctrlHeight     : PropTypes.number.isRequired,
  ctrlWidth      : PropTypes.number.isRequired,
  onChangeVolume : PropTypes.func.isRequired,
  volume         : PropTypes.number.isRequired
};
