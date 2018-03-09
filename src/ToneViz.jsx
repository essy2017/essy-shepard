'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const MAX_VOL = 0.5;
const PI2     = 2 * Math.PI;

/*******************************************************************************
 *
 * Animates tones.
 * @class ToneViz
 * @extends React.Component
 *
 ******************************************************************************/
export default class ToneViz extends React.Component {

 /**
  * Constructor.
  * @method constructor
  * @param props {Object}
  */
  constructor (props) {

    super(props);

    this.state = {
      lastValues : props.values,
      values     : props.values
    };

    this.animate = this.animate.bind(this);
  }

 /**
  * Lifecycle method to restart animation.
  * @method componentWillReceiveProps
  * @param nextProps {Object}
  */
  componentWillReceiveProps (nextProps) {
    if (this.props.values !== nextProps.values) {
      this.setState({
        lastValues : this.state.values,
        values     : nextProps.values
      });
      this.start = null;
      window.cancelAnimationFrame(this.animationId);
      this.animationId = window.requestAnimationFrame(this.animate);
    }
  }

 /**
  * Animation loop.
  * @method animate
  * @param timestamp {Number} In milliseconds.
  */
  animate (timestamp) {

    if (!this.start) {
      this.start = timestamp;
    }

    const props      = this.props;
    const diff       = (timestamp - this.start) / props.interval;
    const lastValues = this.state.lastValues;
    const ctx        = this.canvas.getContext('2d');
    const rad        = 12;
    const colors     = props.colors;
    const minFreq    = Math.log(props.minFreq);
    const maxFreq    = Math.log(props.maxFreq);
    const height     = props.height;
    const width      = props.width;

    ctx.clearRect(0, 0, width, height);

    this.state.values.forEach( (val, i) => {
      ctx.fillStyle = colors[i];
      val.forEach( (v, j) => {

        const lv = lastValues[i][j];
        let x = (Math.log(lv[0]) + diff * (Math.log(v[0]) - Math.log(lv[0])) - minFreq) / (maxFreq - minFreq);
        let y = (lv[1] + diff * (v[1] - lv[1])) / MAX_VOL;
        let r = 2 + y * (rad - 2);
        x = x * 0.8 + 0.1;
        x = x * width;
        y = y * 0.6 + 0.2;
        y = height * (1 - y);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, PI2);
        ctx.fill();
        ctx.closePath();
      });
    });

    if (this.props.on) {
      window.requestAnimationFrame(this.animate);
    }
    else {
      this.start = null;
    }
  }

 /**
  * Renders component.
  * @method render
  */
  render () {
    const props = this.props;
    return (
      <canvas width={props.width} height={props.height} ref={ el => { this.canvas = el; }} />
    );
  }

}

/**
 * Component property definitions.
 * @property propTypes
 * @type Object
 * @static
 */
ToneViz.propTypes = {
  colors   : PropTypes.array.isRequired,
  height   : PropTypes.number.isRequired,
  interval : PropTypes.number.isRequired,
  minFreq  : PropTypes.number.isRequired,
  maxFreq  : PropTypes.number.isRequired,
  on       : PropTypes.bool.isRequired,
  values   : PropTypes.array.isRequired,
  width    : PropTypes.number.isRequired
};
