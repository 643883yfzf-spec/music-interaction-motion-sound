'use strict';

class ChordPlayer {
 constructor(){
  this.context=null;this.loading=null;this.samples=[];this.voices=new Set();
  this.volume=.5;this.brightness=.7;this.masterVolume=.65;this.enabled=true;
 }
 async init(){
  if(!this.context){
   this.context=new AudioContext();
   this.filter=this.context.createBiquadFilter();this.filter.type='lowpass';this.filter.Q.value=1.4;
   this.filterTail=this.context.createBiquadFilter();this.filterTail.type='lowpass';this.filterTail.Q.value=.7;
   this.audition=this.context.createGain();this.audition.gain.value=1;
   this.expression=this.context.createGain();this.master=this.context.createGain();
   const compressor=this.context.createDynamicsCompressor();compressor.threshold.value=-12;compressor.ratio.value=6;
   this.filter.connect(this.filterTail);this.filterTail.connect(this.expression);this.expression.connect(this.master);this.master.connect(compressor);this.audition.connect(compressor);compressor.connect(this.context.destination);
   this.applyControls();
  }
  if(this.context.state==='suspended')await this.context.resume();
  if(this.samples.length)return;
  if(!this.loading)this.loading=Promise.all(Array.from({length:7},async(_,index)=>{
   const response=await fetch('./audio/chords/chord-'+(index+1)+'.wav');
   if(!response.ok)throw Error('和弦素材载入失败，请重试。');
   const buffer=await this.context.decodeAudioData(await response.arrayBuffer());
   let peak=0;
   for(let channel=0;channel<buffer.numberOfChannels;channel++)for(const value of buffer.getChannelData(channel))peak=Math.max(peak,Math.abs(value));
   return {buffer,gain:peak>0?Math.min(4,.35/peak):1};
  })).then(samples=>{this.samples=samples;}).finally(()=>{this.loading=null;});
  return this.loading;
 }
 get playing(){return [...new Set([...this.voices].map(voice=>voice.index))];}
 get cutoff(){return 90*Math.pow(12000/90,this.brightness);}
 applyControls(){
  if(!this.context)return;
  const now=this.context.currentTime;
  this.expression.gain.setTargetAtTime(this.volume,now,.06);
  this.master.gain.setTargetAtTime(this.enabled?this.masterVolume*.65:0,now,.04);
  this.filter.frequency.setTargetAtTime(this.cutoff,now,.07);
  this.filterTail.frequency.setTargetAtTime(this.cutoff,now,.07);
 }
 setExpression(volume,brightness){this.volume=volume;this.brightness=brightness;this.applyControls();}
 fade(voice,seconds=.3){
  if(voice.fading)return;
  voice.fading=true;
  const now=this.context.currentTime;
  voice.gain.gain.cancelAndHoldAtTime(now);
  voice.gain.gain.linearRampToValueAtTime(0,now+seconds);
  voice.source.stop(now+seconds+.01);
 }
 play(index,{audition=false}={}){
  if(!this.context||!this.samples[index]||!this.enabled)return false;
  const active=[...this.voices].filter(voice=>!voice.fading);
  const repeated=active.find(voice=>voice.index===index);
  if(repeated)this.fade(repeated);
  else if(active.length>=2)this.fade(active[0]);
  const sample=this.samples[index],source=this.context.createBufferSource(),gain=this.context.createGain(),now=this.context.currentTime;
  source.buffer=sample.buffer;source.connect(gain);gain.connect(audition?this.audition:this.filter);
  gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(sample.gain,now+.025);
  gain.gain.setValueAtTime(sample.gain,now+Math.max(.026,sample.buffer.duration-.2));
  gain.gain.linearRampToValueAtTime(0,now+sample.buffer.duration);
  const voice={source,gain,index,audition,fading:false};this.voices.add(voice);
  source.addEventListener('ended',()=>{
   this.voices.delete(voice);source.disconnect();gain.disconnect();
   if(this.onchange)this.onchange();
  });
  source.start(now);source.stop(now+sample.buffer.duration);
  if(this.onchange)this.onchange();
  return true;
 }
 stop(){for(const voice of this.voices)this.fade(voice,.18);if(this.onchange)this.onchange();}
}
