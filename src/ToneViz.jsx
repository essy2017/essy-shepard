'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class ToneViz extends React.Component {

  constructor (props) {

    super(props);

    let lastValues = [];
    for (let i = 0; i < props.values.length; i++) {
      lastValues.push(0);
    }

    this.state = {
      lastValues : lastValues,
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

    const diff       = (timestamp - this.start) / this.props.interval;
    const lastValues = this.state.lastValues;
    const values     = this.state.values;

    this.bars.forEach( (bar, i) => {
      bar.style.opacity = 0.1 + 1.8 * (lastValues[i][1] + diff * (values[i][1] - lastValues[i][1]));
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
    this.bars = [];

    return (
      <div className={'tone-viz ' + props.className}>
        {
          this.state.values.map( (v, i) =>
            <div
              className="bar"
              key={i}
              ref={el => { this.bars[i] = el } }
              style={{ width: props.width, height: 5, marginTop: 1 }}
            />
          )
        }
      </div>
    );
  }

}

ToneViz.defaultProps = {
  className: ''
};

ToneViz.propTypes = {
  className : PropTypes.string,
  interval  : PropTypes.number.isRequired,
  on        : PropTypes.bool.isRequired,
  values    : PropTypes.array.isRequired,
  width     : PropTypes.number.isRequired
};
