'use strict';
const $=id=>document.getElementById(id), video=$('video'), N=24;
const sourceCanvas=document.createElement('canvas'), sx=sourceCanvas.getContext('2d',{willReadFrequently:true});
const overlay=$('overlay'), ox=overlay.getContext('2d'), maskCanvas=document.createElement('canvas'), mx=maskCanvas.getContext('2d');
const history=$('history'), hx=history.getContext('2d');
const scales={minor:[0,3,5,7,10],major:[0,2,4,7,9],chromatic:[0,1,2,3,4,5,6,7,8,9,10,11]};
let prev=null,lastTime=-1,flash=Array(N).fill(0),levels=Array(N).fill(0),noteCount=0,impactCount=0,lastImpact=-999,prevEnergy=0,impactReady=true,trace=[],audio=null,master=null,voices=new Set(),blobURL=null,frameCounter=0,fpsStart=performance.now(),measuredFPS=0,notes=[],bandEls=[],lastHit=-999;
const presets={glass:{src:'sample.mp4',name:'素材1 · 玻璃碎裂',threshold:28,minArea:120,maxTargets:6,cooldown:180,method:'FRAGMENT TRACKING'},fireworks:{src:'fireworks.mp4',name:'素材2 · 烟花光点',threshold:110,minArea:3,maxTargets:6,cooldown:180,method:'SPARK TRACKING'},basketball:{src:'basketball.mp4',name:'素材3 · 篮球',threshold:28,minArea:18,maxTargets:1,cooldown:180,method:'BASKETBALL TRACKING',tone:'brass',impact:false},ocean:{src:'ocean.mp4',name:'素材4 · 海浪浪花',threshold:160,minArea:10,maxTargets:16,cooldown:320,method:'FOAM PATCH TRACKING',tone:'harp',impact:false}};
let activePreset='glass',tracker=new FragmentTracker();
const isOcean=()=>activePreset==='ocean';let oceanNoteTimes=[];
const isFireworks=()=>activePreset==='fireworks',isBasketball=()=>activePreset==='basketball';
const waitingTargets=()=>isOcean()?'等待运动的浪花团块…':isBasketball()?'等待篮球进入画面…':isFireworks()?'等待可分离的烟花光点…':'等待可分离的大碎片…';let trackedTargets=[],lastTargetSound=-999;const targetColors=['#d5a1ff','#79dfdc','#ffbc77','#d2fa85','#f49cae','#94b9ff'];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function makeBands(){const scale=scales[$('scale').value],pool=[];for(let n=48;n<=($('tone').value==='harp'?84:76);n++)if(scale.includes(n%12))pool.push(n);notes=Array.from({length:N},(_,i)=>['brass','harp'].includes($('tone').value)?pool[Math.round(i*(pool.length-1)/(N-1))]:48+scale[i%scale.length]+12*Math.floor(i/scale.length));$('bands').replaceChildren();bandEls=[];for(let i=N-1;i>=0;i--){const d=document.createElement('div');d.className='band';d.innerHTML='<span>'+noteName(notes[i])+'</span><i></i>';$('bands').append(d);bandEls[i]=d;}}
function noteName(n){return ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][n%12]+(Math.floor(n/12)-1);}
function tell(text){$('status').textContent=text;}
function stopSounds(){for(const o of voices){try{o.stop();}catch{}}voices.clear();}
function resetAnalysis(counts=false){prev=null;lastTime=-1;oceanNoteTimes=[];tracker.reset();trackedTargets=[];$('targetList').textContent=waitingTargets();$('targetCount').textContent='0 / '+$('maxTargets').value;flash.fill(0);levels.fill(0);prevEnergy=0;lastImpact=-999;lastHit=-999;impactReady=true;stopSounds();if(counts){noteCount=0;impactCount=0;trace=[];$('noteCount').textContent=0;$('impactCount').textContent=0;}$('energy').innerHTML='0.0<small>%</small>';$('hitBadge').textContent='等待运动';$('lastNote').textContent='—';bandEls.forEach(el=>el.classList.remove('active'));drawHistory();drawOverlay(video.currentTime);}
async function initAudio(){if(!audio){audio=new(window.AudioContext||window.webkitAudioContext)();master=audio.createGain();const compressor=audio.createDynamicsCompressor();compressor.threshold.value=-15;compressor.ratio.value=8;master.connect(compressor);compressor.connect(audio.destination);master.gain.value=Number($('volume').value)/100*.5;}if(audio.state==='suspended')await audio.resume();}
function trackVoice(node){voices.add(node);node.onended=()=>voices.delete(node);}
function synth(note,velocity,pan=0,hit=false){if(!audio||audio.state!=='running'||!$('sound').checked||voices.size>($('tone').value==='harp'?40:26))return;if(!hit&&$('tone').value==='harp'){playHarp(note,velocity,pan);return;}if(!hit&&$('tone').value==='brass'){playHorn(note,velocity,pan);return;}const t=audio.currentTime,g=audio.createGain(),p=audio.createStereoPanner();p.pan.value=clamp(pan,-1,1);g.connect(p);p.connect(master);const o=audio.createOscillator();o.type='sine';o.connect(g);if(hit){o.frequency.setValueAtTime(115,t);o.frequency.exponentialRampToValueAtTime(38,t+.22);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.7,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+.45);o.start(t);o.stop(t+.47);}else{const freq=440*Math.pow(2,(note-69)/12);o.frequency.value=freq;const length=$('tone').value==='glass'?.6:.36;const amp=.17*(velocity/127);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,amp),t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+length);o.start(t);o.stop(t+length+.02);if($('tone').value==='glass'){const overtone=audio.createOscillator(),og=audio.createGain();overtone.frequency.value=freq*2.756;og.gain.setValueAtTime(amp*.22,t);og.gain.exponentialRampToValueAtTime(.0001,t+.18);overtone.connect(og);og.connect(p);overtone.start(t);overtone.stop(t+.2);trackVoice(overtone);}}trackVoice(o);}

function playHarp(note,velocity,pan){
 const t=audio.currentTime,f=440*2**((note-69)/12),osc=audio.createOscillator(),gain=audio.createGain(),filter=audio.createBiquadFilter(),stereo=audio.createStereoPanner();
 const real=new Float32Array(9),imag=new Float32Array([0,1,.42,.23,.13,.08,.045,.025,.012]);
 osc.setPeriodicWave(audio.createPeriodicWave(real,imag));osc.frequency.value=f;
 filter.type='lowpass';filter.frequency.setValueAtTime(Math.min(9000,f*12),t);filter.frequency.exponentialRampToValueAtTime(Math.max(900,f*3),t+.8);
 const amp=.18*(velocity/127);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(Math.max(.001,amp),t+.004);gain.gain.exponentialRampToValueAtTime(Math.max(.001,amp*.3),t+.16);gain.gain.exponentialRampToValueAtTime(.0001,t+1.1);
 stereo.pan.value=clamp(pan,-1,1);osc.connect(filter);filter.connect(gain);gain.connect(stereo);stereo.connect(master);trackVoice(osc);osc.start(t);osc.stop(t+1.13);
 osc.addEventListener('ended',()=>{osc.disconnect();filter.disconnect();gain.disconnect();stereo.disconnect();});
}

function playHorn(note,velocity,pan){
 const now=audio.currentTime,freq=440*2**((note-69)/12),level=.22*(velocity/127),gain=audio.createGain(),filter=audio.createBiquadFilter(),stereo=audio.createStereoPanner();
 stereo.pan.value=clamp(pan,-1,1);filter.type='lowpass';filter.Q.value=.75;
 filter.frequency.setValueAtTime(Math.min(1800,freq*2),now);filter.frequency.exponentialRampToValueAtTime(Math.min(7500,freq*8),now+.028);filter.frequency.exponentialRampToValueAtTime(Math.min(4200,freq*3.8),now+.16);
 gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.001,level),now+.018);gain.gain.exponentialRampToValueAtTime(Math.max(.001,level*.58),now+.1);gain.gain.setValueAtTime(Math.max(.001,level*.58),now+.19);gain.gain.exponentialRampToValueAtTime(.0001,now+.36);
 filter.connect(gain);gain.connect(stereo);stereo.connect(master);
 for(const [type,detune,amount]of [['sawtooth',-2,.65],['triangle',2,.35]]){const osc=audio.createOscillator(),mix=audio.createGain();osc.type=type;osc.frequency.setValueAtTime(freq*.992,now);osc.frequency.exponentialRampToValueAtTime(freq,now+.025);osc.detune.value=detune;mix.gain.value=amount;osc.connect(mix);mix.connect(filter);trackVoice(osc);osc.addEventListener('ended',()=>{osc.disconnect();mix.disconnect();});osc.start(now);osc.stop(now+.38);}
}
async function playPause(){try{await initAudio();if(video.paused){if(video.ended)video.currentTime=0;await video.play();tell('目标跟踪中 · 框的位置 → 音高，速度 → 力度');}else video.pause();}catch(e){tell('无法播放：'+e.message);}}
function analysisBounds(w,h){if(isOcean())return{x:0,r:w,top:Math.floor(h*.16),bottom:h};if(isBasketball())return{x:0,r:w,top:0,bottom:h};return{x:0,r:w,top:Math.floor(h*(isFireworks()?.01:.02)),bottom:Math.floor(h*(isFireworks()?.99:.92))};}
function analyze(time){if(!video.videoWidth||video.seeking)return;const w=384,h=Math.round(w*video.videoHeight/video.videoWidth);if(sourceCanvas.width!==w||sourceCanvas.height!==h){sourceCanvas.width=w;sourceCanvas.height=h;maskCanvas.width=w;maskCanvas.height=h;overlay.width=w*4;overlay.height=h*4;prev=null;}sx.drawImage(video,0,0,w,h);const raw=sx.getImageData(0,0,w,h).data,gray=new Uint8Array(w*h);for(let i=0;i<gray.length;i++)gray[i]=(raw[i*4]*.2126+raw[i*4+1]*.7152+raw[i*4+2]*.0722);
 if(time===lastTime||(isOcean()&&prev&&gray.every((v,i)=>v===prev[i]))){drawOverlay(time);return;}if(time<lastTime){resetAnalysis(true);}if(prev===null||time-lastTime>.2){prev=gray;lastTime=time;drawOverlay(time);return;}
 const bounds=analysisBounds(w,h),counts=Array(N).fill(0),totals=Array(N).fill(0),img=mx.createImageData(w,h),threshold=Number($('threshold').value);let active=0,total=0,sumX=0;
 for(let y=bounds.top;y<bounds.bottom;y++){const band=clamp(Math.floor((1-(y-bounds.top)/(bounds.bottom-bounds.top))*N),0,N-1);for(let x=bounds.x;x<bounds.r;x++){const idx=y*w+x;totals[band]++;total++;const amount=Math.abs(gray[idx]-prev[idx]);if(isOcean()?(gray[idx]>=threshold&&amount>=14):amount>=threshold){counts[band]++;active++;sumX+=x;const p=idx*4;img.data[p]=180;img.data[p+1]=250;img.data[p+2]=120;img.data[p+3]=200;}}}
 mx.putImageData(img,0,0);levels=counts.map((v,i)=>v/Math.max(1,totals[i]));const energy=active/Math.max(1,total),cooldown=Number($('cooldown').value)/1000;
 const result=tracker.update(gray,prev,w,h,bounds,time,{threshold,minArea:Number($('minArea').value),maxTargets:Number($('maxTargets').value),rgba:raw,calibrated:isBasketball()&&!blobURL});trackedTargets=result.targets;
 if($('mask').checked){const targetMask=mx.createImageData(w,h);for(let i=0;i<result.mask.length;i++)if(result.mask[i]){targetMask.data[i*4]=190;targetMask.data[i*4+1]=250;targetMask.data[i*4+2]=130;targetMask.data[i*4+3]=220;}mx.putImageData(targetMask,0,0);}
 oceanNoteTimes=oceanNoteTimes.filter(t=>time-t<1);let sounded=0;for(const t of (isOcean()?[...trackedTargets].sort((a,b)=>a.lastSound-b.lastSound):trackedTargets)){if(t.misses||t.speed<.018)continue;const band=clamp(Math.floor((1-(t.cy-bounds.top)/(bounds.bottom-bounds.top))*N),0,N-1);if(t.pendingBand===band)t.bandFrames=(t.bandFrames||0)+1;else{t.pendingBand=band;t.bandFrames=1;}const distance=Math.hypot(t.cx-t.soundX,t.cy-t.soundY)/w;const crossed=band!==t.lastBand&&t.bandFrames>=2;const travelled=distance>(isOcean()?.012:.025)&&time-t.lastSound>(isOcean()?.32:.5);if(sounded<(isOcean()?5:3)&&(!isOcean()||oceanNoteTimes.length<18)&&(crossed||travelled)&&time-t.lastSound>=cooldown){const velocity=Math.round(clamp(40+t.speed*230,40,120));synth(notes[band],velocity,t.cx/w*2-1);t.lastSound=time;t.soundX=t.cx;t.soundY=t.cy;t.lastBand=band;t.note=notes[band];t.flashUntil=time+.2;flash[band]=time+.2;noteCount++;sounded++;if(isOcean())oceanNoteTimes.push(time);lastTargetSound=time;$('lastNote').textContent='#'+t.id+' '+noteName(notes[band]);}}
 renderTargets(time);
 if(isFireworks()&&energy<.006)impactReady=true;
 let hit=false;if($('impact').checked&&(!isBasketball()||trackedTargets.some(t=>!t.misses))&&impactReady&&energy>.012&&energy-prevEnergy>.003&&time-lastImpact>1.2){hit=true;lastImpact=time;lastHit=time;impactReady=false;impactCount++;synth(36,110,0,true);}
 trace.push({energy,hit});if(trace.length>240)trace.shift();prevEnergy=energy;prev=gray;lastTime=time;$('energy').innerHTML=(energy*100).toFixed(1)+'<small>%</small>';$('noteCount').textContent=noteCount;$('impactCount').textContent=impactCount;$('hitBadge').textContent=time-lastHit<.4?(isBasketball()?'● 运动重音':isFireworks()?'● 烟花爆发':'● 主撞击'):(isBasketball()?trackedTargets.some(t=>!t.misses&&t.speed>.018):active)?(isOcean()?'浪花运动中':isBasketball()?'篮球运动中':isFireworks()?'光点运动中':'碎片运动中'):'等待运动';$('frameLabel').textContent=String(Math.floor(time*30)).padStart(4,'0');frameCounter++;const now=performance.now();if(now-fpsStart>=1000){measuredFPS=Math.round(frameCounter*1000/(now-fpsStart));frameCounter=0;fpsStart=now;$('fps').innerHTML=measuredFPS+'<small>fps</small>';}
 drawOverlay(time);drawHistory();}
function renderTargets(time){
 $('targetCount').textContent=trackedTargets.filter(t=>!t.misses).length+' / '+$('maxTargets').value;
 $('targetList').replaceChildren();
 if(!trackedTargets.length){$('targetList').textContent=waitingTargets();return;}
 for(const t of trackedTargets){const row=document.createElement('div');row.className='targetcard'+(t.misses?' lost':'')+(t.flashUntil>time?' sounding':'');row.style.setProperty('--target',targetColors[t.id%6]);const title=document.createElement('b');title.textContent='#'+String(t.id).padStart(2,'0');const note=document.createElement('em');note.textContent=t.misses?'暂失':t.note?noteName(t.note):'跟踪中';const speed=document.createElement('span');speed.textContent='速度 '+(t.speed*100).toFixed(1)+'%宽/s'+(t.flashUntil>time?' · ♪':'');row.append(title,note,speed);$('targetList').append(row);}
}
function drawTargets(time){
 if(!$('boxes').checked)return;
 const factor=overlay.width/sourceCanvas.width;
 ox.save();ox.scale(factor,factor);ox.lineWidth=.65;ox.font='bold 5px monospace';
 for(const t of trackedTargets){const color=targetColors[t.id%6],lit=t.flashUntil>time;
  if($('trails').checked&&t.path.length>1){ox.strokeStyle=color+'88';ox.beginPath();t.path.forEach(([x,y],i)=>i?ox.lineTo(x,y):ox.moveTo(x,y));ox.stroke();}
  ox.setLineDash(t.misses?[2,2]:[]);ox.strokeStyle=lit?'#ffffff':color;ox.lineWidth=lit?1.1:.65;if(isFireworks()||isBasketball()){ox.beginPath();ox.arc(t.cx,t.cy,isBasketball()?Math.max(t.w,t.h)/2+1:(lit?6:4.5),0,Math.PI*2);ox.stroke();}else ox.strokeRect(t.x-1,t.y-1,t.w+2,t.h+2);ox.setLineDash([]);
  const text='#'+String(t.id).padStart(2,'0')+(t.misses?' ?':t.note?' '+noteName(t.note):''),tw=ox.measureText(text).width+4,tx=clamp(t.x-1,0,sourceCanvas.width-tw),ty=Math.max(7,t.y-2);
  ox.fillStyle=lit?'#ffffff':'#111912dd';ox.fillRect(tx,ty-6,tw,7);ox.fillStyle=lit?'#14220d':color;ox.fillText(text,tx+2,ty-1);ox.fillStyle=color;ox.fillRect(t.cx-1,t.cy-1,2,2);
 }
 ox.restore();
}
function drawOverlay(time){const w=overlay.width,h=overlay.height;if(!w)return;ox.clearRect(0,0,w,h);const b=analysisBounds(w,h);if($('mask').checked){ox.fillStyle='#020703bb';ox.fillRect(0,0,w,h);ox.imageSmoothingEnabled=false;ox.drawImage(maskCanvas,0,0,w,h);}if($('grid').checked){for(let i=0;i<N;i++){const y=b.bottom-(i+1)/N*(b.bottom-b.top),bh=(b.bottom-b.top)/N;ox.fillStyle=flash[i]>time?'#d2fa8519':'transparent';ox.fillRect(b.x,y,b.r-b.x,bh);ox.strokeStyle=flash[i]>time?'#d2fa8599':'#b6d69420';ox.lineWidth=1;ox.beginPath();ox.moveTo(b.x,y);ox.lineTo(b.r,y);ox.stroke();}ox.strokeStyle='#c6ef8c66';ox.strokeRect(b.x,b.top,b.r-b.x,b.bottom-b.top);}drawTargets(time);bandEls.forEach((el,i)=>{el.classList.toggle('active',flash[i]>time);el.querySelector('i').style.opacity=flash[i]>time?'1':String(.45+Math.min(levels[i]*3,.55));});}
function drawHistory(){const w=Math.max(100,Math.floor(history.clientWidth*devicePixelRatio)),h=80*devicePixelRatio;if(history.width!==w||history.height!==h){history.width=w;history.height=h;}hx.clearRect(0,0,w,h);hx.strokeStyle='#34412e';hx.lineWidth=1;hx.beginPath();hx.moveTo(0,h-1);hx.lineTo(w,h-1);hx.stroke();if(!trace.length)return;hx.beginPath();hx.moveTo(0,h);trace.forEach((p,i)=>hx.lineTo(i/239*w,h-clamp(p.energy*5,0,.95)*h));hx.lineTo((trace.length-1)/239*w,h);hx.closePath();hx.fillStyle='#d2fa8520';hx.fill();hx.beginPath();trace.forEach((p,i)=>{const x=i/239*w,y=h-clamp(p.energy*5,0,.95)*h;i?hx.lineTo(x,y):hx.moveTo(x,y);if(p.hit){hx.fillStyle='#edb77a';hx.fillRect(x,0,2*devicePixelRatio,h);}});hx.strokeStyle='#b7dc80';hx.lineWidth=1.5*devicePixelRatio;hx.stroke();}
function clock(v){if(!Number.isFinite(v))return '00:00';return Math.floor(v/60).toString().padStart(2,'0')+':'+Math.floor(v%60).toString().padStart(2,'0');}
function uiTime(){$('time').textContent=clock(video.currentTime)+' / '+clock(video.duration);$('seek').value=video.duration?Math.round(video.currentTime/video.duration*1000):0;}
function onFrame(now,meta){if(!video.paused&&!video.seeking)analyze(meta?meta.mediaTime:video.currentTime);uiTime();if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(onFrame);else requestAnimationFrame(onFrame);}
$('play').onclick=playPause;$('centerplay').onclick=playPause;
video.addEventListener('play',()=>{frameCounter=0;fpsStart=performance.now();$('play').textContent='Ⅱ 暂停';$('centerplay').hidden=true;});
video.addEventListener('pause',()=>{$('play').textContent='▶ 继续演奏';$('centerplay').hidden=false;stopSounds();tell('已暂停 · 点击继续演奏');});
video.addEventListener('ended',()=>{resetAnalysis();$('play').textContent='▶ 重新演奏';tell('播放结束 · 可重播或更换视频');});
video.addEventListener('seeking',()=>resetAnalysis(true));video.addEventListener('seeked',()=>{analyze(video.currentTime);uiTime();});
video.addEventListener('loadedmetadata',()=>{$('stage').style.aspectRatio=video.videoWidth+'/'+video.videoHeight;$('stage').style.setProperty('--video-ratio',video.videoWidth/video.videoHeight);});
video.addEventListener('loadeddata',()=>{resetAnalysis(true);analyze(video.currentTime);uiTime();tell('视频已就绪 · 点击开始演奏');});
video.addEventListener('error',()=>tell('视频无法解码，请更换 H.264 编码的 MP4 文件。'));
$('restart').onclick=()=>{resetAnalysis(true);video.currentTime=0;uiTime();};$('loop').onchange=()=>video.loop=$('loop').checked;video.loop=true;
$('seek').addEventListener('input',()=>{if(Number.isFinite(video.duration)){video.currentTime=Number($('seek').value)/1000*video.duration;}});
$('file').onchange=()=>{const f=$('file').files[0];if(!f)return;for(const id of ['glassSample','fireworksSample','basketballSample','oceanSample']){$(id).classList.remove('selected');$(id).setAttribute('aria-pressed','false');}video.pause();resetAnalysis(true);if(blobURL)URL.revokeObjectURL(blobURL);blobURL=URL.createObjectURL(f);video.src=blobURL;video.load();$('filename').dataset.noI18n='';$('filename').textContent=f.name;$('play').textContent='▶ 开始演奏';};

function configurePreset(key){
 activePreset=key;const p=presets[key];tracker=isOcean()?new FoamTracker():isBasketball()?new BasketballTracker():isFireworks()?new BrightPointTracker():new FragmentTracker();
 $('tone').value=p.tone||'glass';$('impact').checked=p.impact!==false;$('maxTargets').disabled=isBasketball();$('maxTargets').max=isOcean()?'24':isBasketball()?'1':'6';
 $('threshold').max=isOcean()?'240':'160';$('thresholdLabel').textContent=isOcean()?'浪花亮度阈值':isBasketball()?'橙色匹配阈值':'亮度 / 像素阈值';
 $('threshold').value=p.threshold;
 Object.assign($('minArea'),{min:isOcean()?'4':isBasketball()?'6':isFireworks()?'2':'50',max:isOcean()?'80':isBasketball()?'120':isFireworks()?'30':'800',step:isOcean()?'2':isBasketball()?'2':isFireworks()?'1':'10',value:String(p.minArea)});
 $('maxTargets').value=p.maxTargets;$('cooldown').value=p.cooldown;
 $('methodLabel').textContent=p.method;$('minAreaLabel').textContent=isOcean()?'最小运动浪花像素数':isBasketball()?'最小篮球像素数':isFireworks()?'最小光点像素数':'最小碎片框面积';
 $('accentLabel').textContent=isBasketball()?'运动重音':isFireworks()?'爆发重音':'撞击重音';$('accentMetric').textContent=isBasketball()?'运动重音':isFireworks()?'烟花爆发':'主撞击';
 $('analysisDescription').textContent=isOcean()?'跟踪局部明亮且运动的浪花团块，默认同时选择16个，最多24个。高度、速度和左右位置驱动声音；每秒最多18个音符，轮流让不同团块发声，避免持续堆叠。浪花分裂或消散后编号可能更换。':isBasketball()?'结合篮球的橙色、圆形轮廓和连续运动定位球体，并针对片段的镜头变化校准搜索位置。篮球的高度、速度与左右位置驱动号音色；发声时球体圆环闪白。篮球离开画面或无法确认时停止触发。':isFireworks()?'逐帧提取明亮且运动的烟花光点，优先定位光尾前方的新亮点，过滤静态文字与大面积爆发中心。跨帧预测位置保持编号；高度控制音高，速度控制力度，左右控制声像。光点发声时圆环闪白。':'每帧以 384 像素宽分析玻璃亮轮廓，筛选大碎片，结合位置预测与尺寸匹配保持编号。目标上下移动改变音高，移动速度决定力度，左右位置决定声像；发声时对应框会闪白。';
 $('extractionDescription').textContent=isOcean()?'运动白色浪花 + 局部团块分离':isBasketball()?'橙色球体 + 圆形轮廓 + 运动匹配':isFireworks()?'运动亮点 + 光尾前端定位':'亮轮廓连接 + 尺寸过滤 · 优先保留较大碎片';
 updateLabels();
}
function selectSample(key){
 video.pause();if(blobURL){URL.revokeObjectURL(blobURL);blobURL=null;}$('file').value='';
 configurePreset(key);makeBands();resetAnalysis(true);
 for(const [id,value]of [['glassSample','glass'],['fireworksSample','fireworks'],['basketballSample','basketball'],['oceanSample','ocean']]){const selected=key===value;$(id).classList.toggle('selected',selected);$(id).setAttribute('aria-pressed',String(selected));}
 delete $('filename').dataset.noI18n;$('filename').textContent=presets[key].name;
 video.src=presets[key].src;video.load();$('play').textContent='▶ 开始演奏';uiTime();
}
$('glassSample').onclick=()=>selectSample('glass');$('fireworksSample').onclick=()=>selectSample('fireworks');$('basketballSample').onclick=()=>selectSample('basketball');$('oceanSample').onclick=()=>selectSample('ocean');

function updateLabels(){$('thresholdOut').textContent=$('threshold').value;$('minAreaOut').textContent=$('minArea').value+(isOcean()||isFireworks()||isBasketball()?' px':' px²');$('maxTargetsOut').textContent=$('maxTargets').value+' 个';$('cooldownOut').textContent=$('cooldown').value+' ms';$('volumeOut').textContent=$('volume').value+'%';if(master)master.gain.setTargetAtTime(Number($('volume').value)/100*.5,audio.currentTime,.03);}
['threshold','cooldown','volume','minArea','maxTargets'].forEach(id=>$(id).addEventListener('input',updateLabels));
['scale','tone'].forEach(id=>$(id).addEventListener('change',()=>{resetAnalysis();if(id==='scale'||id==='tone')makeBands();updateLabels();renderTargets(video.currentTime);analyze(video.currentTime);}));
['grid','mask','boxes','trails'].forEach(id=>$(id).onchange=()=>drawOverlay(video.currentTime));
$('sound').onchange=()=>{stopSounds();if($('sound').checked)initAudio().catch(e=>tell(e.message));};
$('reset').onclick=()=>{const p=presets[activePreset],vals={minArea:p.minArea,maxTargets:p.maxTargets,scale:'minor',tone:p.tone||'glass',threshold:p.threshold,cooldown:p.cooldown,volume:'35'};for(const [id,v]of Object.entries(vals))$(id).value=v;$('sound').checked=true;$('impact').checked=p.impact!==false;$('grid').checked=false;$('boxes').checked=true;$('trails').checked=true;$('mask').checked=false;resetAnalysis(true);makeBands();updateLabels();analyze(video.currentTime);tell(isOcean()?'已恢复海浪预设 · 竖琴音色':isBasketball()?'已恢复篮球预设 · 号音色':isFireworks()?'已恢复烟花光点预设':'已恢复玻璃碎裂预设');};
window.addEventListener('pagehide',()=>{video.pause();stopSounds();});window.addEventListener('resize',drawHistory);
configurePreset(activePreset);makeBands();updateLabels();if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(onFrame);else requestAnimationFrame(onFrame);
// Read-only diagnostics for validation, without changing state.
window.motionScore={getState:()=>({preset:activePreset,noteCount,impactCount,energy:prevEnergy,levels:[...levels],targets:trackedTargets.map(t=>({id:t.id,x:t.x,y:t.y,w:t.w,h:t.h,speed:t.speed,hits:t.hits,misses:t.misses,note:t.note})),fps:measuredFPS,time:video.currentTime,audioState:audio?.state})};

window.motionAudioBridge={
 init:initAudio, stop:stopSounds, pauseVideo:()=>video.pause(),
 notes:()=>[...notes], name:noteName,
 play:(note,velocity,pan)=>{synth(note,velocity,pan);},
 settings:()=>({tone:$('tone').value,scale:$('scale').value,volume:$('volume').value,sound:$('sound').checked}),
 configure:({tone,scale,volume,sound})=>{if(tone!==undefined&&tone!==$('tone').value){$('tone').value=tone;makeBands();}if(scale!==undefined&&scale!==$('scale').value){$('scale').value=scale;makeBands();}if(volume!==undefined)$('volume').value=volume;if(sound!==undefined)$('sound').checked=sound;updateLabels();}
};
