'use strict';

class OceanBgm {
 constructor(){
  this.buffer=null;
  this.loading=null;
  this.source=null;
  this.gain=null;
  this.offset=0;
  this.startedAt=0;
  this.volume=.45;
 }
 async load(context){
  if(this.buffer)return;
  if(!this.loading)this.loading=this.decode(context).finally(()=>{this.loading=null;});
  return this.loading;
 }
 async decode(context){
  const response=await fetch('./audio/Pad+Sea.wav');
  if(!response.ok)throw Error('Ocean BGM missing: '+response.status);
  const original=await context.decodeAudioData(await response.arrayBuffer());
  const overlap=Math.min(Math.round(original.sampleRate*1.5),Math.floor(original.length/4));
  const length=original.length-overlap;
  const loop=context.createBuffer(original.numberOfChannels,length,original.sampleRate);
  let peak=0;
  for(let channel=0;channel<original.numberOfChannels;channel++){
   const input=original.getChannelData(channel),output=loop.getChannelData(channel);
   output.set(input.subarray(0,length));
   for(let i=0;i<overlap;i++){
    const mix=i/(overlap-1);
    output[i]=input[length+i]*(1-mix)+input[i]*mix;
   }
   for(const value of output)peak=Math.max(peak,Math.abs(value));
  }
  this.normalization=peak>0?Math.min(6,.5/peak):1;
  this.buffer=loop;
 }
 play(context,destination){
  if(!this.buffer||this.source||!context||context.state!=='running')return;
  const source=context.createBufferSource(),gain=context.createGain();
  source.buffer=this.buffer;
  source.loop=true;
  source.connect(gain);
  gain.connect(destination);
  const now=context.currentTime;
  gain.gain.setValueAtTime(0,now);
  gain.gain.linearRampToValueAtTime(this.volume*this.normalization,now+.04);
  this.source=source;
  this.gain=gain;
  this.startedAt=now;
  source.addEventListener('ended',()=>{source.disconnect();gain.disconnect();});
  source.start(now,this.offset);
 }
 pause(){
  if(!this.source)return;
  const context=this.source.context,now=context.currentTime;
  this.offset=(this.offset+now-this.startedAt)%this.buffer.duration;
  this.gain.gain.cancelScheduledValues(now);
  this.gain.gain.setTargetAtTime(0,now,.008);
  this.source.stop(now+.04);
  this.source=null;
  this.gain=null;
 }
 reset(){this.pause();this.offset=0;}
 setVolume(value){
  this.volume=value;
  if(this.gain)this.gain.gain.setTargetAtTime(value*this.normalization,this.gain.context.currentTime,.03);
 }
}
