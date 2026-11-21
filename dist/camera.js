import {acquireCamera} from './camera-access.mjs';
const $=id=>document.getElementById(id),bridge=window.motionAudioBridge;
const view=$('cameraVideo'),canvas=$('cameraOverlay'),ctx=canvas.getContext('2d'),motion=new HandRemix(),player=new ChordPlayer();
const connections=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
let selected=false,stream=null,worker=null,request=0,raf=0,busy=false,running=false,lastSent=0,lastVideoTime=-1,notesPlayed=0,fpsFrames=0,fpsTime=0,loadTimer=0,rejectLoading=null,watchdog=0,lastResponse=0;
function status(text){$('cameraStatus').textContent=text;}
function syncSettings(){player.masterVolume=Number($('cameraVolume').value)/100;player.enabled=$('cameraSound').checked;player.applyControls();}
function clearHands(){motion.reset();player.setExpression(.5,.7);setText('remixVolumeValue','50%');setText('remixFilterValue','2.8 kHz');$('remixVolumeMeter').style.width='50%';$('remixFilterMeter').style.width='70%';ctx.clearRect(0,0,canvas.width,canvas.height);$('cameraHandCount').textContent='0 / 2';$('cameraHandList').textContent='等待双手进入各自操作区…';renderChordCards();}
function stop(message='摄像头已关闭，声音已停止。'){
 request++;running=false;cancelAnimationFrame(raf);clearTimeout(loadTimer);clearInterval(watchdog);
 if(rejectLoading){rejectLoading(new Error('cancelled'));rejectLoading=null;}
 if(worker){worker.terminate();worker=null;}if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
 view.pause();view.srcObject=null;busy=false;clearHands();player.stop();$('cameraStart').disabled=false;$('cameraStop').disabled=true;$('cameraDevice').disabled=false;$('cameraPlaceholder').hidden=false;$('cameraFPS').textContent='0 fps';$('cameraDeviceName').textContent='尚未启动';if(message)status(message);
}
function chooseSource(camera){
 selected=camera;$('videoTab').classList.toggle('selected',!camera);$('cameraTab').classList.toggle('selected',camera);$('videoTab').setAttribute('aria-pressed',String(!camera));$('cameraTab').setAttribute('aria-pressed',String(camera));$('cameraPanel').hidden=!camera;$('videoWorkspace').hidden=camera;
 document.querySelector('.explanation').hidden=camera;document.querySelector('main > details').hidden=camera;
 if(camera){bridge.pauseVideo();bridge.stop();syncSettings();refreshDevices();}else stop();
}
async function refreshDevices(){
 if(!navigator.mediaDevices?.enumerateDevices)return;
 try{const devices=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput'),current=$('cameraDevice').value;$('cameraDevice').replaceChildren(new Option('系统默认摄像头',''));devices.forEach((d,i)=>$('cameraDevice').append(new Option(d.label||'摄像头 '+(i+1),d.deviceId)));if(devices.some(d=>d.deviceId===current))$('cameraDevice').value=current;
 }catch(e){status('设备列表暂时不可用；可尝试直接开启默认摄像头。');}
}
async function start(){
 if(!selected||running||$('cameraStart').disabled)return;
 let phase='audio';
 const token=++request;$('cameraStart').disabled=true;$('cameraStop').disabled=false;$('cameraDevice').disabled=true;notesPlayed=0;$('cameraNoteCount').textContent='0';clearHands();
 try{
  if(!isSecureContext||!navigator.mediaDevices?.getUserMedia)throw Error('请通过 http://localhost:8765 或 HTTPS 打开页面，并使用支持摄像头的浏览器。');
  await player.init();if(token!==request)return;
  phase='camera';
  status('正在请求摄像头权限，请在浏览器中允许摄像头访问…');
  const id=$('cameraDevice').value;
  const acquired=await acquireCamera({mediaDevices:navigator.mediaDevices,deviceId:id,isCurrent:()=>token===request,onRetry:()=>status('Retrying camera with basic settings…')});
  if(token!==request){acquired.getTracks().forEach(t=>t.stop());return;}stream=acquired;
  phase='preview';view.muted=true;view.autoplay=true;view.srcObject=stream;await view.play();if(token!==request)return;
  canvas.width=view.videoWidth||640;canvas.height=view.videoHeight||480;view.parentElement.style.aspectRatio=canvas.width+'/'+canvas.height;
  $('cameraPlaceholder').hidden=true;$('cameraDeviceName').textContent=stream.getVideoTracks()[0].label||'Web Camera';refreshDevices();
  stream.getVideoTracks()[0].addEventListener('ended',()=>{if(token===request)stop('摄像头已断开，请检查设备连接后重新开启。');});
  phase='model';status('画面已连接，正在载入本地手部识别模型…');
  worker=new Worker(new URL('./hand-worker.js?v=20261121',import.meta.url));
  await new Promise((resolve,reject)=>{
   rejectLoading=reject;loadTimer=setTimeout(()=>reject(Error('手部模型载入超时，请检查 vendor 文件是否完整。')),45000);
   worker.onerror=()=>{if(!running)reject(Error('手部识别模块启动失败，请使用新版 Chrome 或 Edge，检查本地模型文件。'));else stop('手部识别模块发生错误，请重新开启摄像头。');};
   worker.onmessage=({data})=>{
    if(token!==request)return;
    if(data.type==='ready'){clearTimeout(loadTimer);rejectLoading=null;resolve();}
    else if(data.type==='error'){if(!running)reject(Error(data.message));else stop('识别失败：'+data.message);}
    else if(data.type==='result'){busy=false;lastResponse=performance.now();processHands(data.landmarks,data.handedness,data.timestamp/1000);}
   };worker.postMessage({type:'init'});
  });
  if(token!==request)return;running=true;fpsFrames=0;fpsTime=performance.now();lastSent=0;lastVideoTime=-1;lastResponse=performance.now();
  status('已开启 · 左手横向选和弦，捏合触发；右手控制音量与滤波。');raf=requestAnimationFrame(loop);
  watchdog=setInterval(()=>{if(running&&performance.now()-lastResponse>8000)stop('摄像头或识别暂时无响应，请重新开启。');},1000);
 }catch(e){if(token!==request)return;const errors={NotAllowedError:'摄像头权限未允许。请在浏览器地址栏的网站权限中允许摄像头后重试。',NotFoundError:'没有发现摄像头，请确认 Web Camera 已连接。',NotReadableError:'Browser could not read the camera. Close other camera apps; check browser/Windows access or select another camera.',OverconstrainedError:'所选摄像头不可用，请刷新设备列表或改用系统默认摄像头。'};console.error('Camera startup failed',{phase,name:e.name,message:e.message});stop((errors[e.name]||'Camera startup failed.')+' ['+phase+' / '+e.name+'] '+e.message);}
}
async function loop(now){
 if(!running)return;raf=requestAnimationFrame(loop);
 if(busy||now-lastSent<50||view.readyState<2||view.currentTime===lastVideoTime)return;
 busy=true;lastSent=now;lastVideoTime=view.currentTime;const token=request;
 try{const bitmap=await createImageBitmap(view);if(token!==request||!running){bitmap.close();return;}worker.postMessage({type:'frame',frame:bitmap,timestamp:now},[bitmap]);}
 catch(e){if(token===request)stop('读取摄像头画面失败：'+e.message);}
}
function setText(id,text){
 const translated=window.i18n.text(text);
 if($(id).textContent!==translated)$(id).textContent=translated;
}
function renderChordCards(){
 if(!$('chordCards').children.length){
  for(let i=0;i<7;i++){
   const card=document.createElement('button');
   card.className='chord-card';card.dataset.chord=String(i);card.type='button';
   card.innerHTML='<span>和弦 '+(i+1)+'</span><small>8 s</small><em></em>';card.setAttribute('aria-label',window.i18n.text('和弦')+' '+(i+1));
   card.onclick=async()=>{
    motion.selected=i;motion.pending=i;renderChordCards();
    try{await player.init();if(selected)triggerChord(i,true);}
    catch(error){status(window.i18n.text(error.message));}
   };
   $('chordCards').append(card);

  }
 }
 [...$('chordCards').children].forEach((card,index)=>{
  const chosen=index===motion.selected,playing=player.playing.includes(index);
  card.classList.toggle('chosen',chosen);card.classList.toggle('playing',playing);
  card.setAttribute('aria-pressed',String(chosen));
  const state=window.i18n.text(playing?'演奏中':chosen?'已选':'');
  if(card.querySelector('em').textContent!==state)card.querySelector('em').textContent=state;
  card.setAttribute('aria-label',window.i18n.text('和弦')+' '+(index+1)+(playing?' · '+window.i18n.text('演奏中'):chosen?' · '+window.i18n.text('已选'):''));
 });
 setText('chordSelection','待触发 · 和弦 '+(motion.selected+1));
 setText('cameraLastNote',player.playing.length?player.playing.map(index=>'和弦 '+(index+1)).join(' + '):'—');
}
function triggerChord(index,audition=false){
 if(!player.play(index,{audition}))return;
 notesPlayed++;setText('cameraNoteCount',String(notesPlayed));renderChordCards();
}
function processHands(landmarks,handedness,time){
 const result=motion.update(landmarks,handedness,time,canvas.width/canvas.height,$('cameraMirror').checked,Number($('cameraCooldown').value)/1000);
 player.setExpression(result.controls.volume,result.controls.filter);
 if(result.trigger!==null)triggerChord(result.trigger);
 setText('cameraHandCount',result.targets.length+' / 2');
 setText('remixVolumeValue',Math.round(result.controls.volume*100)+'%');
 const hz=player.cutoff;
 setText('remixFilterValue',hz>=1000?(hz/1000).toFixed(1)+' kHz':Math.round(hz)+' Hz');
 $('remixVolumeMeter').style.width=result.controls.volume*100+'%';
 $('remixFilterMeter').style.width=result.controls.filter*100+'%';
 const left=result.targets.some(t=>t.role==='left'),right=result.targets.some(t=>t.role==='right');
 setText('cameraHandList',result.ambiguous?'双手过近或重叠 · 请分开双手':(left?(result.pinched?'左手 · 已捏合':result.armed?'左手 · 可捏合触发':'左手 · 请先张开'):'左手 · 等待进入左区')+'　／　'+(right?'右手 · 控制中':'右手 · 等待进入右区'));
 renderChordCards();drawHands(result);
 fpsFrames++;const now=performance.now();
 if(now-fpsTime>1000){$('cameraFPS').textContent=Math.round(fpsFrames*1000/(now-fpsTime))+' fps';fpsFrames=0;fpsTime=now;}
}
function drawHands(result){
 const w=canvas.width,h=canvas.height,mirror=$('cameraMirror').checked,X=x=>(mirror?1-x:x)*w;
 ctx.clearRect(0,0,w,h);
 for(const hand of result.targets){
  const color=hand.role==='left'?'#d2fa85':'#83dfdc',points=hand.points;
  ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;
  ctx.beginPath();
  for(const [a,b]of connections){ctx.moveTo(X(points[a].x),points[a].y*h);ctx.lineTo(X(points[b].x),points[b].y*h);}
  ctx.stroke();
  for(const point of points){ctx.beginPath();ctx.arc(X(point.x),point.y*h,3,0,Math.PI*2);ctx.fill();}
  const x=hand.x*w,y=hand.y*h;
  ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.stroke();
  ctx.font='bold 14px sans-serif';
  const label=window.i18n.text(hand.role==='left'?'左手 · 和弦 '+(result.selected+1):'右手 · 音量 / 滤波');
  const width=ctx.measureText(label).width+16,tx=Math.max(0,Math.min(w-width,x-width/2)),ty=Math.max(80,y+34);
  ctx.fillStyle='#101b15ee';ctx.fillRect(tx,ty-18,width,26);ctx.fillStyle=color;ctx.fillText(label,tx+8,ty);
  if(hand.role==='left'){
   ctx.lineWidth=result.pinched?6:3;ctx.strokeStyle=result.pinched?'white':color;
   ctx.beginPath();ctx.moveTo(X(points[4].x),points[4].y*h);ctx.lineTo(X(points[8].x),points[8].y*h);ctx.stroke();
  }
 }
}

$('videoTab').onclick=()=>chooseSource(false);$('cameraTab').onclick=()=>chooseSource(true);
$('cameraStart').onclick=start;$('cameraStop').onclick=()=>stop();$('cameraRefresh').onclick=refreshDevices;
$('cameraVolume').oninput=()=>{$('cameraVolumeOut').textContent=$('cameraVolume').value+'%';syncSettings();};
$('cameraSound').onchange=()=>{syncSettings();if(!player.enabled)player.stop();};
$('cameraCooldown').oninput=()=>$('cameraCooldownOut').textContent=$('cameraCooldown').value+' ms';
$('cameraMirror').onchange=()=>{view.classList.toggle('mirrored',$('cameraMirror').checked);player.stop();clearHands();};view.classList.add('mirrored');
window.addEventListener('pagehide',()=>stop(''));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&stream)stop('页面已切到后台，摄像头已关闭；返回后可重新开启。');});
navigator.mediaDevices?.addEventListener('devicechange',refreshDevices);


player.onchange=renderChordCards;
$('chordStop').onclick=()=>player.stop();
renderChordCards();
document.addEventListener('languagechange',renderChordCards);
