'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';

import OscillatorGroup from './models/OscillatorGroup';
import ToneControl from './ToneControl';


/*******************************************************************************
 *
 * Component to create panel for ascending and descending Shepard tones.
 * @class Tones
 * @extends React.Component
 *
 ******************************************************************************/
export default class Tones extends React.Component {

 /**
  * Constructor.
  * @method constructor
  * @param props {Object}
  */
  constructor (props) {

    super(props);

    let gains = [];

    this.reverb    = new Tone.JCReverb(props.reverb);
    this.gainOut   = new Tone.Gain(props.volume);
    this.oscGroups = [];

    for (let i = 0; i < 2*props.components; i++) {
      const isAsc = i < props.components;
      gains[i] = isAsc ? 0.5 : 0;
      this.oscGroups[i] = new OscillatorGroup({
        baseFreq  : props.baseFrequency * Math.pow(2, i),
        gain      : gains[i],
        type      : 'square',
        duration  : props.duration,
        octaves   : props.octaves,
        interval  : props.interval,
        direction : isAsc ? -1 : 1
      });
      this.oscGroups[i].chain(this.gainOut, this.reverb, Tone.Master);
    }

    this.loop = new Tone.Loop( time => {
      this.doLoop(time);
    }, props.interval);

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
    if (!this.props.on && nextProps.on) {
      this.startLoop();
    }
    if (this.props.on && !nextProps.on) {
      this.stopLoop();
    }
    if (this.props.volume !== nextProps.volume) {
      this.gainOut.gain.value = nextProps.volume;
    }
    if (this.props.reverb !== nextProps.reverb) {
      this.reverb.roomSize.value = nextProps.reverb;
    }
  }

 /**
  * Starts loop.
  * @method startLoop
  */
  startLoop () {
    this.gainOut.gain.value = 0;
    this.starting = true;
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
    if (this.starting) {
      this.gainOut.gain.linearRampToValueAtTime(this.props.volume, time + 2);
      this.starting = false;
    }
    let vals = [];
    this.oscGroups.forEach( (g, i) => {
      const gain = this.state.gains[i];
      const v    = g.step(time);
      vals.push(v.map( x => [x[0], gain * x[1]] ));
    });
    this.props.onLoop(vals);
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

    const gains      = this.state.gains;
    const props      = this.props;
    const panelWidth = props.panelWidth;
    const count      = props.components;

    return (
      <div className="tones" style={{ left: props.space }}>
        <div className="tones-group tones-up" style={{ marginLeft: props.space, width: panelWidth }}>
          <div className="label">Ascending</div>
          <div className="controls">
            {
              this.oscGroups.slice(0, count).map( (g, i) =>
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
        <div className="tones-group tones-down" style={{ marginLeft: props.space, width: panelWidth }}>
          <div className="label">Descending</div>
          <div className="controls">
            {
              this.oscGroups.slice(count).map( (g, i) =>
                <ToneControl
                  className={'tone-control-' + i}
                  domain={[0, 1]}
                  key={i}
                  height={props.ctrlHeight}
                  onChange={this.handleChangeControl.bind(this, count + i)}
                  value={gains[count + i]}
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
  baseFrequency : PropTypes.number.isRequired,
  components    : PropTypes.number.isRequired,
  ctrlHeight    : PropTypes.number.isRequired,
  ctrlWidth     : PropTypes.number.isRequired,
  duration      : PropTypes.number.isRequired,
  interval      : PropTypes.number.isRequired,
  octaves       : PropTypes.number.isRequired,
  on            : PropTypes.bool.isRequired,
  onLoop        : PropTypes.func.isRequired,
  panelWidth    : PropTypes.number.isRequired,
  reverb        : PropTypes.number.isRequired,
  space         : PropTypes.number.isRequired,
  volume        : PropTypes.number.isRequired
};
