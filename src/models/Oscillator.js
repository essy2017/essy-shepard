'use strict';

import Tone from 'tone';


/*******************************************************************************
 *
 * Wrapper for an oscillator.
 * @class Oscillator
 *
 ******************************************************************************/
export default class Oscillator {

 /**
  * Constructor.
  * @method constructor
  * @param phase {Number}
  * @param type {String}
  * @param freq {Number}
  * @param vol {Number}
  */
  constructor (phase, type, freq, vol) {
    this.phase = phase;
    this.gain = new Tone.Gain(vol);
    this.osc = new Tone.Oscillator({
      frequency : freq,
      type      : type
    });
  }

 /**
  * Connects oscillator to node.
  * @method connect
  * @param node {Tone.AudioNode}
  */
  connect (node) {
    this.osc.chain(this.gain, node);
  }

 /**
  * Starts oscillator.
  * @method start
  */
  start () {
    this.osc.start();
  }

 /**
  * Stops oscillator.
  * @method stop
  */
  stop () {
    this.osc.stop();
  }

 /**
  * Ramps to frequency and volume.
  * @method rampToValues
  * @param time {Number} Time to ramp to.
  * @param freq {Number} Frequency to ramp to.
  * @param vol {Number} Volume to ramp to.
  */
  rampToValues (time, freq, vol) {
    this.osc.frequency.linearRampToValueAtTime(freq, time);
    this.gain.gain.linearRampToValueAtTime(vol, time);
  }

}
