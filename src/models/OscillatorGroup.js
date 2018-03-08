'use strict';

import Tone from 'tone';

import Oscillator from './Oscillator';

/*******************************************************************************
 *
 * A group of oscillators composing a Shepard tone.
 * @class OscillatorGroup
 *
 ******************************************************************************/
export default class OscillatorGroup {

 /**
  * Constructor.
  * @method constructor
  * @param config {Object} With properties:
  *   baseFreq {Number} Base frequency for lowest component.
  *   duration {Number} Duration of full loop in seconds.
  *   gain {Number} Gain for group.
  *   interval {Number} Interval for loop.
  *   octaves {Number} Number of octaves / components in tone.
  *   type {String} Oscillator type.
  */
  constructor (config) {

    const baseFreq = this.baseFreq = config.baseFreq;
    const duration = this.duration = config.duration;
    const octaves  = this.octaves  = config.octaves;

    this.interval  = config.interval;
    this.direction = config.direction;
    this.oscs      = [];

    this.gainNode = new Tone.Gain(config.gain);

    for (let i = 0; i < octaves; i++) {
      const phase = duration * i / octaves;
      const freq  = this.getFreq(baseFreq, phase, duration / octaves);
      const vol   = this.getVol(phase, 0.5, duration / 2, 0.2);
      this.oscs[i] = new Oscillator(phase, config.type, freq, vol);
    }

  }

 /**
  * Getter for gain.
  * @method gain
  * @return {Number} Current gain.
  */
  get gain () {
    return this.gainNode.gain.value;
  }

 /**
  * Setter for gain.
  * @method gain
  * @param gain {Number} Between 0 and 1.
  */
  set gain (gain) {
    this.gainNode.gain.value = gain;
  }

 /**
  * Chains oscillators to provided arguments.
  * @method chain
  * @param args {Object[]} Outputs.
  */
  chain () {
    this.oscs.forEach( d => d.connect(this.gainNode) );
    this.gainNode.chain.apply(this.gainNode, arguments);
  }

 /**
  * Starts oscillators.
  * @method start
  */
  start () {
    this.oscs.forEach( d => d.start() );
  }

 /**
  * Stops oscillators.
  * @method stop
  */
  stop () {
    this.oscs.forEach( d => d.stop() );
  }

 /**
  * Gets frequency.
  * @method getFreq
  * @param n0 {Number} Base frequency.
  * @param t {Number} Phase-shifted time.
  * @param tHalf {Number} Half life.
  * @return {Number} Frequency.
  */
  getFreq (n0, t, tHalf) {
    return n0 * Math.pow(2, -this.direction * t / tHalf);
  }

 /**
  * Gets volume.
  * @method getVol
  * @param x {Number} Phase-shifted time.
  * @param a {Number} Amplitude.
  * @param b {Number}
  * @param c {Number}
  * @return {Number} Volume.
  */
  getVol (x, a, b, c) {
    return a * Math.exp(-Math.pow(x - b, 2) / 2 * Math.pow(c, 2));
  }

 /**
  * Steps oscillators to next frequency and volume.
  * @method step
  * @param time {Number}
  */
  step (time) {
    time = time + this.interval;
    this.oscs.forEach( d => {
      const t = (time + d.phase) % this.duration;
      d.rampToValues(
        time,
        this.getFreq(this.baseFreq, t, this.duration / this.octaves),
        this.getVol(t, 0.5, this.duration / 2, 0.2)
      );
    });
  }

}
