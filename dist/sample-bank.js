/* Sample manifests give the MIDI pitch and, when measured, the reference frequency of each WAV. */
(function(root){
class StudentSampleBank{
 constructor(){this.ready=false;this.samples=[];this.active=new Set();}
 async load(context, directory='./samples/', targetPeak=.5){
  const response=await fetch(directory+'manifest.json');if(!response.ok)throw Error('Sample manifest could not be loaded.');const manifest=await response.json();
  const samples=await Promise.all(manifest.map(async row=>{const file=await fetch(directory+row.file);if(!file.ok)throw Error('Sample missing: '+row.file);const buffer=await context.decodeAudioData(await file.arrayBuffer());let peak=0;for(let ch=0;ch<buffer.numberOfChannels;ch++){const data=buffer.getChannelData(ch);for(let i=0;i<data.length;i++)peak=Math.max(peak,Math.abs(data[i]));}if(peak<.000001)throw Error('Silent sample: '+row.file);return {...row,buffer,gain:Math.min(6,targetPeak/peak)};}));
  this.samples=samples;this.ready=true;
 }
 select(note){return this.samples.reduce((best,s)=>!best||Math.abs(s.midi-note)<Math.abs(best.midi-note)?s:best,null);}
 play(context,destination,note,velocity,pan){
  if(!this.ready)return null;const sample=this.select(note),now=context.currentTime;
  if(this.active.size>=16){const oldest=this.active.values().next().value;oldest.gain.gain.cancelScheduledValues(now);oldest.gain.gain.setTargetAtTime(.0001,now,.008);try{oldest.source.stop(now+.035);}catch{}this.active.delete(oldest);}
  const source=context.createBufferSource(),gain=context.createGain(),panner=context.createStereoPanner();source.buffer=sample.buffer;const targetFrequency=440*2**((note-69)/12);source.playbackRate.value=sample.frequency ? targetFrequency/sample.frequency : 2**((note-sample.midi)/12);panner.pan.value=Math.max(-1,Math.min(1,pan));
  const duration=sample.buffer.duration/source.playbackRate.value,level=sample.gain*Math.max(.05,Math.min(1,velocity/127));gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(level,now+.003);gain.gain.setValueAtTime(level,now+Math.max(.004,duration-.035));gain.gain.linearRampToValueAtTime(0,now+duration);
  source.connect(gain);gain.connect(panner);panner.connect(destination);const entry={source,gain};this.active.add(entry);source.addEventListener('ended',()=>{this.active.delete(entry);source.disconnect();gain.disconnect();panner.disconnect();});source.start(now);source.stop(now+duration);return source;
 }
}
root.StudentSampleBank=StudentSampleBank;if(typeof module!=='undefined')module.exports=StudentSampleBank;
})(typeof window!=='undefined'?window:globalThis);
