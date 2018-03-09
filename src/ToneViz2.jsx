'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const MAX_VOL = 0.5;
const MAX_FREQ = Math.log(12000);

export default class ToneViz2 extends React.Component {

  constructor (props) {

    super(props);

    this.state = {
      lastValues : props.values,
      values     : props.values
    };

    this.animate = this.animate.bind(this);
  }

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

  animate (timestamp) {

    if (!this.start) {
      this.start = timestamp;
    }

    const diff    = (timestamp - this.start) / this.props.interval;
    const height  = this.props.height;
    const width      = this.props.width;
    const lastValues = this.state.lastValues;
    const values     = this.state.values;

    this.boxes.forEach( (group, i) => {
      group.forEach( (box, j) => {
        const lv = lastValues[i][j];
        const nv = values[i][j];
        box.style.left = width * (Math.log(lv[0]) + diff * (Math.log(nv[0]) - Math.log(lv[0]))) / MAX_FREQ;
        box.style.top  = height - height * (lv[1] + diff * (nv[1] - lv[1])) / MAX_VOL;

      });
    });

    if (this.props.on) {
      window.requestAnimationFrame(this.animate);
    }
    else {
      this.start = null;
    }
  }

  render () {
    const props = this.props;
    const style = {
      height : props.height,
      width  : props.width
    };

    this.boxes = [];

    return (
      <div className="tone-viz2" style={style}>
        {
          props.values.map( (v, i) => {
            this.boxes[i] = [];
            return v.map( (o, j) =>
              <div
                className={'box box-' + i}
                key={i + '' + j}
                ref={el => { this.boxes[i][j] = el; } }
              />
            )
          })
        }
      </div>
    );
  }

}

ToneViz2.propTypes = {
  height   : PropTypes.number.isRequired,
  interval : PropTypes.number.isRequired,
  on       : PropTypes.bool.isRequired,
  values   : PropTypes.array.isRequired,
  width    : PropTypes.number.isRequired
};
