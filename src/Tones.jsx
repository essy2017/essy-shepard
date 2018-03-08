'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';

import OscillatorGroup from './models/OscillatorGroup';
import ToneControl from './ToneControl';

const OCTAVES   = 5;
const DURATION  = 10 * OCTAVES;
const INTERVAL  = DURATION / 48;
const F0        = 110;
const OSC_COUNT = 4;

export default class Tones extends React.Component {

 /**
  * Constructor.
  * @method constructor
  * @param props {Object}
  */
  constructor (props) {

    super(props);

    let gains = [];

    this.gainOut   = new Tone.Gain(props.volume);
    this.oscGroups = [];

    for (let i = 0; i < 2*OSC_COUNT; i++) {
      gains[i] = 0.5;
      this.oscGroups[i] = new OscillatorGroup({
        baseFreq  : F0 * Math.pow(2, i),
        gain      : gains[i],
        type      : 'triangle',
        duration  : DURATION,
        octaves   : OCTAVES,
        interval  : INTERVAL,
        direction : i < OSC_COUNT ? -1 : 1
      });
      this.oscGroups[i].chain(this.gainOut, Tone.Master);
    }

    this.loop = new Tone.Loop( time => {
      this.doLoop(time);
    }, INTERVAL);

    this.state = {
      gains: gains
    };
  }

 /**
  * Lifecycle method to start or stop tones.
  * @method componentWillReceiveProps
  * @param nextProps {Object}
  */
  componentWillReceiveProps (nextProps) {
    if (nextProps.on) {
      this.startLoop();
    }
    else {
      this.stopLoop();
    }
    if (this.props.volume !== nextProps.volume) {
      this.gainOut.gain.value = nextProps.volume;
    }
  }

 /**
  * Starts loop.
  * @method startLoop
  */
  startLoop () {
    this.oscGroups.forEach( g => g.start() );
    this.loop.start();
    Tone.Transport.start();
  }

 /**
  * Stops loop.
  * @method stopLoop
  */
  stopLoop () {
    this.loop.stop();
    this.oscGroups.forEach( g => g.stop() );
  }

 /**
  * Loop function.
  * @method doLoop
  * @param time {Number}
  */
  doLoop (time) {
    this.oscGroups.forEach( g => g.step(time) );
  }

 /**
  * Handler for change in gain control.
  * @method handleChangeControl
  * @param index {Number} Oscillator group index.
  * @param value {Number} New gain.
  */
  handleChangeControl (index, value) {
    let gains = this.state.gains;
    gains[index] = value;
    this.oscGroups[index].gain = value;
    this.setState({
      gains: gains
    });
  }

 /**
  * Renders component.
  * @method render
  */
  render () {

    const gains = this.state.gains;
    const props = this.props;

    return (
      <div className="tones">
        <div className="tones-group tones-up">
          <div className="label">Ascending</div>
          <div className="controls">
            {
              this.oscGroups.slice(0, OSC_COUNT).map( (g, i) =>
                <ToneControl
                  className={'tone-control-' + i}
                  domain={[0, 1]}
                  key={i}
                  height={props.ctrlHeight}
                  onChange={this.handleChangeControl.bind(this, i)}
                  value={gains[i]}
                  width={props.ctrlWidth}
                />
              )
            }
          </div>
        </div>
        <div className="tones-group tones-down">
          <div className="label">Descending</div>
          <div className="controls">
            {
              this.oscGroups.slice(OSC_COUNT).map( (g, i) =>
                <ToneControl
                  className={'tone-control-' + i}
                  domain={[0, 1]}
                  key={i}
                  height={props.ctrlHeight}
                  onChange={this.handleChangeControl.bind(this, OSC_COUNT + i)}
                  value={gains[OSC_COUNT + i]}
                  width={props.ctrlWidth}
                />
              )
            }
          </div>
        </div>
      </div>
    );
  }

}

/**
 * Component property type definitions.
 * @property propTypes
 * @type Object
 * @static
 */
Tones.propTypes = {
  ctrlHeight : PropTypes.number.isRequired,
  ctrlWidth  : PropTypes.number.isRequired,
  on         : PropTypes.bool.isRequired,
  volume     : PropTypes.number.isRequired
};
