'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const MAX_VOL = 0.5;
const PI2     = 2 * Math.PI;
const MAX_RAD = 6;
const MIN_RAD = 2;

const NUM_LEGS     = 3;
const LEG_INTERVAL = 1200;
const LEG_DURATION = NUM_LEGS * LEG_INTERVAL;

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

    this.resetLegs(props.values);

    this.minFreq   = Math.log(props.minFreq);
    this.maxFreq   = Math.log(props.maxFreq);
    this.freqRange = this.maxFreq - this.minFreq;

    this.animate   = this.animate.bind(this);
  }

 /**
  * Resets legs collection.
  * @method resetLegs
  * @param values {Number[][]} Values.
  */
  resetLegs (values) {
    this.legs = [];
    for (let i = 0; i < values.length; i++) {
      this.legs[i] = [];
      for (let j = 0; j < values[i].length; j++) {
        this.legs[i][j] = [];
      }
    }
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
      window.requestAnimationFrame(this.animate);
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
    if (!this.lastLeg) {
      this.lastLeg = timestamp;
    }

    const props      = this.props;
    const diff       = (timestamp - this.start) / props.interval;
    const lastValues = this.state.lastValues;
    const ctx        = this.canvas.getContext('2d');

    let legs      = this.legs;
    let createLeg = false;

    if (timestamp - this.lastLeg > LEG_INTERVAL) {
      this.lastLeg = timestamp;
      createLeg = true;
    }

    ctx.clearRect(0, 0, props.width, props.height);

    this.state.values.forEach( (val, i) => {

      ctx.fillStyle = props.colors[i];

      val.forEach( (v, j) => {

        const lv = lastValues[i][j];
        const logLv0 = Math.log(lv[0]);
        let x = (logLv0 + diff * (Math.log(v[0]) - logLv0) - this.minFreq) / this.freqRange;
        let y = (lv[1] + diff * (v[1] - lv[1])) / MAX_VOL;
        let r = MIN_RAD + y * (MAX_RAD - MIN_RAD);
        x = x * 0.8 + 0.1;
        x = x * props.width;
        y = y * 0.6 + 0.2;
        y = props.height * (1 - y);

        // Create leg if indicated.
        if (createLeg) {
          if (legs[i][j].length === NUM_LEGS) {
            legs[i][j].pop();
          }
          legs[i][j].unshift([x, y, r, timestamp]);
        }

        // Render legs.
        legs[i][j].forEach( leg => {
          ctx.beginPath();
          ctx.globalAlpha = 1 - Math.min(1, (timestamp - leg[3]) / LEG_DURATION);
          ctx.arc(leg[0], leg[1], leg[2], 0, PI2);
          ctx.fill();
          ctx.closePath();
          ctx.globalAlpha = 1;
        });

        // Render circle.
        ctx.beginPath();
        ctx.arc(x, y, r, 0, PI2);
        ctx.fill();
        ctx.closePath();

      });
    });

    if (props.on) {
      window.requestAnimationFrame(this.animate);
    }
    else {
      this.start = null;
      this.lastLeg = null;
      this.resetLegs(props.values);
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
