'use strict';

import React from 'react';

import Output from './Output';
import Tones from './Tones';
import ToneViz from './ToneViz';
import ToneViz2 from './ToneViz2';

const COMPONENTS = 4;
const OCTAVES    = 5;
const DURATION   = 10 * OCTAVES;
const INTERVAL   = DURATION / 24;
const BASE_FREQ  = 55;

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

          <div className="viz-group" style={{ marginLeft: space, width: bigWidth }}>
            <ToneViz2
              height={100}
              interval={INTERVAL * 1000}
              on={state.on}
              values={state.values}
              width={2*bigWidth}
            />
          </div>
        </div>
      </div>
    );
  }

}

/*
<div className="viz-group" style={{ marginLeft: space, width: bigWidth }}>
  {
    state.values.slice(0, COMPONENTS).map( (v, i) =>
      <ToneViz
        className={'tone-viz-' + i}
        interval={INTERVAL * 1000}
        key={i}
        on={state.on}
        values={state.values[i]}
        width={ctrlWidth}
      />
    )
  }
</div>
*/
