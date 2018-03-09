'use strict';

import React from 'react';

import Output from './Output';
import Tones from './Tones';
import ToneViz from './ToneViz';

const COMPONENTS = 4;
const OCTAVES    = 5;
const DURATION   = 10 * OCTAVES;
const INTERVAL   = DURATION / 24;
const BASE_FREQ  = 55;
const MAX_FREQ   = BASE_FREQ * Math.pow(2, OCTAVES + COMPONENTS - 1.9);

const COLORS = [
  'rgb(0,83,174)',
  'rgb(0,108,231)',
  'rgb(26,133,255)',
  'rgb(71,159,255)',
  'rgb(31,92,57)',
  'rgb(41,130,79)',
  'rgb(52,170,102)',
  'rgb(80,193,128)'
];

/*******************************************************************************
 *
 * Main entry point.
 * @class App
 * @extends React.Component
 *
 ******************************************************************************/
export default class App extends React.Component {

 /**
  * Constructor.
  * @method constructor
  * @param props {Object}
  */
  constructor (props) {

    super(props);

    let vals = [];
    for (let i = 0; i < 2*COMPONENTS; i++) {
      vals[i] = [];
      for (let j = 0; j < OCTAVES; j++) {
        vals[i][j] = [0, 0];
      }
    }

    this.state = {
      on     : false,
      reverb : 0.5,
      values : vals,
      volume : 0.25,
      width  : 650
    };

    this.handleClickOnOff = this.handleClickOnOff.bind(this);
    this.handleLoop       = this.handleLoop.bind(this);
  }

 /**
  * Handler for change in on/off state.
  * @method handleClickOnOff
  */
  handleClickOnOff () {
    this.setState({
      on: !this.state.on
    });
  }

 /**
  * Handler for change in output values.
  * @method handleChange
  * @param prop {String} Property.
  * @param value {Number} New value.
  */
  handleChange (prop, value) {
    this.setState({
      [prop]: value
    });
  }

  handleLoop (vals) {
    this.setState({ values: vals });
  }

 /**
  * Renders component.
  * @method render
  */
  render () {

    const state      = this.state;
    const width      = state.width;
    const nControls  = 4;
    const ctrlHeight = width / 3.5;
    let ctrlWidth;

    let space      = 4;
    let smallWidth = 10;
    let bigWidth   = (100 - 2*smallWidth - (nControls + 1) * space) / 2;

    space      = width * space / 100;
    smallWidth = width * smallWidth / 100;
    bigWidth   = width * bigWidth / 100;
    ctrlWidth  = smallWidth / 3.5;

    return (
      <div className="shepard" style={{ width: state.width }}>
        <div className="btn-area">
          <button onClick={this.handleClickOnOff}>{state.on ? 'Stop' : 'Start'}</button>
        </div>
        <div className="control-area">
          <Tones
            ascending={true}
            baseFrequency={BASE_FREQ}
            colors={COLORS}
            components={COMPONENTS}
            ctrlHeight={ctrlHeight}
            ctrlWidth={ctrlWidth}
            duration={DURATION}
            interval={INTERVAL}
            octaves={OCTAVES}
            on={state.on}
            onLoop={this.handleLoop}
            panelWidth={bigWidth}
            reverb={state.reverb}
            space={space}
            volume={state.volume}
          />
          <Output
            className="reverb"
            ctrlHeight={ctrlHeight}
            ctrlWidth={ctrlWidth}
            label="Reverb"
            left={space}
            onChange={this.handleChange.bind(this, 'reverb')}
            value={state.reverb}
            width={smallWidth}
          />
          <Output
            className="volume"
            ctrlHeight={ctrlHeight}
            ctrlWidth={ctrlWidth}
            label="Volume"
            left={space}
            onChange={this.handleChange.bind(this, 'volume')}
            value={state.volume}
            width={smallWidth}
          />
        </div>
        <div className="viz-area">
          <ToneViz
            colors={COLORS}
            height={70}
            interval={INTERVAL * 1000}
            minFreq={BASE_FREQ}
            maxFreq={MAX_FREQ}
            on={state.on}
            values={state.values}
            width={2*bigWidth + 2*smallWidth + 3*space}
          />
        </div>
      </div>
    );
  }

}
