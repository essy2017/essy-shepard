'use strict';

import React from 'react';


import Output from './Output';
import Tones from './Tones';

export default class App extends React.Component {

 /**
  * Constructor.
  * @method constructor
  * @param props {Object}
  */
  constructor (props) {
    super(props);
    this.state = {
      on     : false,
      volume : 0.5,
      width  : 600
    };

    this.handleClickOnOff   = this.handleClickOnOff.bind(this);
    this.handleChangeVolume = this.handleChangeVolume.bind(this);
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
  * Handler for change in output volume.
  * @method handleChangeVolume
  * @param volume {Number} New volume.
  */
  handleChangeVolume (volume) {
    this.setState({
      volume: volume
    });
  }

  render () {

    const state      = this.state;
    const ctrlHeight = 200;
    const ctrlWidth  = 20;

    return (
      <div className="shepard" style={{ width: state.width }}>
        <div className="control-area">
          <Tones
            ctrlHeight={ctrlHeight}
            ctrlWidth={ctrlWidth}
            on={state.on}
            volume={state.volume}
          />
          <Output
            ctrlHeight={ctrlHeight}
            ctrlWidth={ctrlWidth}
            onChangeVolume={this.handleChangeVolume}
            volume={state.volume}
          />
        </div>
        <div className="btn-area">
          <button onClick={this.handleClickOnOff}>{state.on ? 'Stop' : 'Start'}</button>
        </div>
      </div>
    );
  }

}
