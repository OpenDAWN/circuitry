var context = new AudioContext();

var gain0 = context.createGain();
var gain1 = context.createGain();
var gain2 = context.createGain();

var osc0 = context.createOscillator();
var biquad = context.createBiquadFilter();
var source = context.createBufferSource();

osc0.connect(gain0);
source.connect(gain2);

gain0.connect(gain1);
gain1.connect(gain2);
gain2.connect(gain0);
gain2.connect(gain1);
gain2.connect(gain2);
gain0.connect(context.destination);
gain1.connect(context.destination);
gain2.connect(context.destination);

// gain2.disconnect(gain2);