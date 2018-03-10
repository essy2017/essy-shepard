'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const isTouch   = 'ontouchstart' in window;
const MOUSEMOVE = isTouch ? 'touchmove' : 'mousemove';
const MOUSEUP   = isTouch ? 'touchend' : 'mouseup';

/*******************************************************************************
 *
 * A vertical slide control for tone.
 * @class ToneControl
 * @extends React.Component
 *
 ******************************************************************************/
export default class ToneControl extends React.Component {

 /**
  * Constructor.
  * @method constructor
  * @param props {Object}
  */
  constructor (props) {

    super(props);

    this.setStyles(props);

    this.handleMouseDownKnob = this.handleMouseDownKnob.bind(this);
    this.handleMouseMoveKnob = this.handleMouseMoveKnob.bind(this);
    this.handleMouseUpKnob   = this.handleMouseUpKnob.bind(this);
  }

 /**
  * Lifecycle method to update styles and sizes as needed.
  * @method componentWillReceiveProps
  * @param nextProps {Object}
  */
  componentWillReceiveProps (nextProps) {
    const props = this.props;
    if (
      props.width       !== nextProps.width       ||
      props.height      !== nextProps.height      ||
      props.borderWidth !== nextProps.borderWidth ||
      props.knobSize    !== nextProps.knobSize
    ) {
      this.setStyles(nextProps);
    }
  }

 /**
  * Sets styles and sizing properties.
  * @method setStyles
  * @param props {Object}
  */
  setStyles (props) {

    this.knobWidth = props.knobSize * props.width;
    this.innerHeight = props.height - this.knobWidth - 2*props.borderWidth;
    this.styles = {
      wrap: {
        height : props.height,
        width  : props.width
      },
      track: {
        borderRadius : props.width / 2,
        borderWidth  : props.borderWidth,
        height       : this.innerHeight + 2*props.borderWidth,
        top          : this.knobWidth / 2 + 2*props.borderWidth,
        width        : props.width
      }
    };

  }

 /**
  * Handler for mousedown events on knob.
  * @method handleMouseDownKnob
  * @param e {Event}
  */
  handleMouseDownKnob (e) {
    this.offsetY = e.pageY - e.target.offsetTop + 2*this.props.borderWidth;
    document.addEventListener(MOUSEMOVE, this.handleMouseMoveKnob, false);
    document.addEventListener(MOUSEUP, this.handleMouseUpKnob, false);
  }

 /**
  * Handler for mousemove events during knob drag.
  * @method handleMouseMoveKnob
  * @param e {Event}
  */
  handleMouseMoveKnob (e) {
    this.props.onChange(this.valueFromY(e.pageY - this.offsetY));
  }

 /**
  * Handler for mouseup events during knob drag.
  * @method handleMouseUpKnob
  * @param e {Event}
  */
  handleMouseUpKnob (e) {
    document.removeEventListener(MOUSEMOVE, this.handleMouseMoveKnob);
    document.removeEventListener(MOUSEUP, this.handleMouseUpKnob);
  }

 /**
  * Gets knob Y position within component from value.
  * @method getKnobPosition
  * @param value {Number} Component value.
  * @return {Number} Y position for knob within component.
  */
  getKnobPosition (value) {
    const d = this.props.domain;
    const h = this.innerHeight;
    return h - (value - d[0]) / (d[1] - d[0]) * h + 2*this.props.borderWidth;
  }

 /**
  * Retrieves component value from Y position.
  * @method valueFromY
  * @param y {Number} Y position within component.
  * @return {Number} Value.
  */
  valueFromY (y) {
    const d = this.props.domain;
    const h = this.innerHeight;
    return d[1] - (d[1] - d[0]) * Math.max(0, Math.min(h, y) / h);
  }

 /**
  * Renders component.
  * @method render
  */
  render () {

    const props       = this.props;
    const pos         = this.getKnobPosition(props.value);
    const borderWidth = props.borderWidth;
    const knobWidth   = this.knobWidth;
    const halfKnob    = knobWidth / 2;
    const halfWidth   = props.width / 2;
    const styleFill   = {
      borderBottomLeftRadius  : halfWidth,
      borderBottomRightRadius : halfWidth,
      bottom                  : halfKnob - borderWidth,
      top                     : pos + halfKnob,
      width                   : props.width
    };
    const styleKnob = {
      borderRadius : halfKnob,
      borderWidth  : borderWidth,
      height       : knobWidth,
      left         : halfWidth,
      marginLeft   : -halfKnob,
      marginTop    : borderWidth,
      top          : pos,
      width        : knobWidth
    };

    if (props.color) {
      styleFill.backgroundColor = props.color;
      styleKnob.backgroundColor = props.color;
    }

    return (
      <div className={'tone-control ' + props.className} style={this.styles.wrap}>
        <div className="fill" style={styleFill}></div>
        <div className="track" style={this.styles.track}></div>
        <div className="knob" style={styleKnob} onMouseDown={this.handleMouseDownKnob} onTouchStart={this.handleMouseDownKnob}></div>
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
ToneControl.defaultProps = {
  borderWidth : 2,
  className   : '',
  knobSize    : 1.3
};

/**
 * Component property definitions.
 * @property propTypes
 * @type Object
 * @static
 */
ToneControl.propTypes = {
  className : PropTypes.string,
  color     : PropTypes.string,
  domain    : PropTypes.array.isRequired,
  height    : PropTypes.number.isRequired,
  knobSize  : PropTypes.number,
  onChange  : PropTypes.func.isRequired,
  value     : PropTypes.number.isRequired,
  width     : PropTypes.number.isRequired
};
