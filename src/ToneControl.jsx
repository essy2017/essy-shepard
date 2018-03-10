'use strict';

import React from 'react';
import PropTypes from 'prop-types';

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

    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
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
  * Handler for drag start event.
  * @method handleStart
  * @param isTouch {Boolean}
  * @param e {Event}
  */
  handleStart (isTouch, e) {

    e.preventDefault();

    const pageY = isTouch ? e.targetTouches[0].pageY : e.pageY;

    this.eventMove = isTouch ? 'touchmove' : 'mousemove';
    this.eventEnd  = isTouch ? 'touchend' : 'mouseup';

    this.offsetY = pageY - e.target.offsetTop + 2*this.props.borderWidth;
    this.isTouch = isTouch;

    document.addEventListener(this.eventMove, this.handleMove, false);
    document.addEventListener(this.eventEnd, this.handleEnd, false);
  }

 /**
  * Handler for move events on drag.
  * @method handleMove
  * @param e {Event}
  */
  handleMove (e) {
    e.preventDefault();
    const pageY = this.isTouch ? e.targetTouches[0].pageY : e.pageY;
    this.props.onChange(this.valueFromY(pageY - this.offsetY));
  }

 /**
  * Handler for end events on drag.
  * @method handleEnd
  * @param e {Event}
  */
  handleEnd (e) {
    document.removeEventListener(this.eventMove, this.handleMove);
    document.removeEventListener(this.eventEnd, this.handleEnd);
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
        <div className="knob" style={styleKnob} onMouseDown={this.handleStart.bind(this, false)} onTouchStart={this.handleStart.bind(this, true)}></div>
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
