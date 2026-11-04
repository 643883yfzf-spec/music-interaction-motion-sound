const $=id=>document.getElementById(id),bridge=window.motionAudioBridge;
const view=$('cameraVideo'),canvas=$('cameraOverlay'),ctx=canvas.getContext('2d'),motion=new HandMotion();
const connections=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
let selected=false,stream=null,worker=null,request=0,raf=0,busy=false,running=false,lastSent=0,lastVideoTime=-1,notesPlayed=0,fpsFrames=0,fpsTime=0,loadTimer=0,rejectLoading=null,watchdog=0,lastResponse=0;
function status(text){$('cameraStatus').textContent=text;}
function syncSettings(){const s=bridge.settings();$('cameraTone').value=s.tone;$('cameraScale').value=s.scale;$('cameraVolume').value=s.volume;$('cameraSound').checked=s.sound;$('cameraVolumeOut').textContent=s.volume+'%';}
function clearHands(){motion.reset();ctx.clearRect(0,0,canvas.width,canvas.height);$('cameraHandCount').textContent='0 / 2';$('cameraHandList').textContent='等待手部进入画面…';$('cameraLastNote').textContent='—';}
function stop(message='摄像头已关闭，声音已停止。'){
 request++;running=false;cancelAnimationFrame(raf);clearTimeout(loadTimer);clearInterval(watchdog);
 if(rejectLoading){rejectLoading(new Error('cancelled'));rejectLoading=null;}
 if(worker){worker.terminate();worker=null;}if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
 view.pause();view.srcObject=null;busy=false;clearHands();bridge.stop();$('cameraStart').disabled=false;$('cameraStop').disabled=true;$('cameraDevice').disabled=false;$('cameraPlaceholder').hidden=false;$('cameraFPS').textContent='0 fps';$('cameraDeviceName').textContent='尚未启动';if(message)status(message);
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
 const token=++request;$('cameraStart').disabled=true;$('cameraStop').disabled=false;$('cameraDevice').disabled=true;notesPlayed=0;$('cameraNoteCount').textContent='0';clearHands();
 try{
  if(!isSecureContext||!navigator.mediaDevices?.getUserMedia)throw Error('请通过 http://localhost:8765 或 HTTPS 打开页面，并使用支持摄像头的浏览器。');
  await bridge.init();if(token!==request)return;
  status('正在请求摄像头权限，请在浏览器中允许摄像头访问…');
  const id=$('cameraDevice').value;
  const acquired=await navigator.mediaDevices.getUserMedia({audio:false,video:{width:{ideal:640},height:{ideal:480},frameRate:{ideal:30,max:30},...(id?{deviceId:{exact:id}}:{})}});
  if(token!==request){acquired.getTracks().forEach(t=>t.stop());return;}stream=acquired;
  view.srcObject=stream;await view.play();if(token!==request)return;
  canvas.width=view.videoWidth||640;canvas.height=view.videoHeight||480;view.parentElement.style.aspectRatio=canvas.width+'/'+canvas.height;
  $('cameraPlaceholder').hidden=true;$('cameraDeviceName').textContent=stream.getVideoTracks()[0].label||'Web Camera';refreshDevices();
  stream.getVideoTracks()[0].addEventListener('ended',()=>{if(token===request)stop('摄像头已断开，请检查设备连接后重新开启。');});
  status('画面已连接，正在载入本地手部识别模型…');
  worker=new Worker(new URL('./hand-worker.js',import.meta.url));
  await new Promise((resolve,reject)=>{
   rejectLoading=reject;loadTimer=setTimeout(()=>reject(Error('手部模型载入超时，请检查 vendor 文件是否完整。')),45000);
   worker.onerror=()=>{if(!running)reject(Error('手部识别模块启动失败，请使用新版 Chrome 或 Edge，检查本地模型文件。'));else stop('手部识别模块发生错误，请重新开启摄像头。');};
   worker.onmessage=({data})=>{
    if(token!==request)return;
    if(data.type==='ready'){clearTimeout(loadTimer);rejectLoading=null;resolve();}
    else if(data.type==='error'){if(!running)reject(Error(data.message));else stop('识别失败：'+data.message);}
    else if(data.type==='result'){busy=false;lastResponse=performance.now();processHands(data.landmarks,data.timestamp/1000);}
   };worker.postMessage({type:'init'});
  });
  if(token!==request)return;running=true;fpsFrames=0;fpsTime=performance.now();lastSent=0;lastVideoTime=-1;lastResponse=performance.now();
  status('已开启 · 五个手指分别演奏，上下移动指尖改变音高。');raf=requestAnimationFrame(loop);
  watchdog=setInterval(()=>{if(running&&performance.now()-lastResponse>8000)stop('摄像头或识别暂时无响应，请重新开启。');},1000);
 }catch(e){if(token!==request)return;const errors={NotAllowedError:'摄像头权限未允许。请在浏览器地址栏的网站权限中允许摄像头后重试。',NotFoundError:'没有发现摄像头，请确认 Web Camera 已连接。',NotReadableError:'摄像头可能正被其他程序占用，请关闭占用程序后重试。',OverconstrainedError:'所选摄像头不可用，请刷新设备列表或改用系统默认摄像头。'};stop(errors[e.name]||'启动失败：'+e.message);}
}
async function loop(now){
 if(!running)return;raf=requestAnimationFrame(loop);
 if(busy||now-lastSent<50||view.readyState<2||view.currentTime===lastVideoTime)return;
 busy=true;lastSent=now;lastVideoTime=view.currentTime;const token=request;
 try{const bitmap=await createImageBitmap(view);if(token!==request||!running){bitmap.close();return;}worker.postMessage({type:'frame',frame:bitmap,timestamp:now},[bitmap]);}
 catch(e){if(token===request)stop('读取摄像头画面失败：'+e.message);}
}
function processHands(landmarks,time){
 const notes=bridge.notes(),{targets,events}=motion.update(landmarks,time,notes.length,Number($('cameraCooldown').value)/1000),mirror=$('cameraMirror').checked;
 for(const event of events){const x=mirror?1-event.x:event.x,note=notes[event.band];bridge.play(note,event.velocity,x*2-1);notesPlayed++;$('cameraLastNote').textContent='手 '+event.id+' '+fingerName(event.finger)+' · '+bridge.name(note);const t=targets.find(t=>t.id===event.id);if(t){t.note=note;t.fingers[event.finger].note=note;}}
 $('cameraNoteCount').textContent=notesPlayed;$('cameraHandCount').textContent=targets.length+' / 2';renderHandCards(targets,time);drawHands(targets,time);
 fpsFrames++;const now=performance.now();if(now-fpsTime>1000){$('cameraFPS').textContent=Math.round(fpsFrames*1000/(now-fpsTime))+' fps';fpsFrames=0;fpsTime=now;}
}
function fingerName(index){return ['拇指','食指','中指','无名指','小指'][index];}
function renderHandCards(targets,time){
 $('cameraHandList').replaceChildren();if(!targets.length){$('cameraHandList').textContent='未检测到手部 · 请让手掌与手指完整入镜';return;}
 for(const t of targets){const row=document.createElement('div');row.className='targetcard finger-card';row.style.setProperty('--target',t.id%2?'#d2fa85':'#a8bfff');const b=document.createElement('b');b.textContent='手 '+t.id;row.append(b);const list=document.createElement('div');list.className='finger-chips';for(const f of t.fingers||[]){const chip=document.createElement('span');chip.className='finger-chip'+(f.flashUntil>time?' sounding':'');chip.textContent=fingerName(f.finger)+' '+(f.note?bridge.name(f.note):'—');list.append(chip);}row.append(list);$('cameraHandList').append(row);}
}
function drawHands(targets,time){
 const w=canvas.width,h=canvas.height,mirror=$('cameraMirror').checked,X=x=>(mirror?1-x:x)*w;ctx.clearRect(0,0,w,h);
 for(const t of targets){const color=t.flashUntil>time?'#ffffff':t.id%2?'#d2fa85':'#a8bfff',pts=t.points;ctx.strokeStyle=color;ctx.lineWidth=2;
  ctx.beginPath();for(const [a,b]of connections){ctx.moveTo(X(pts[a].x),pts[a].y*h);ctx.lineTo(X(pts[b].x),pts[b].y*h);}ctx.stroke();
  ctx.fillStyle=color;for(const p of pts){ctx.beginPath();ctx.arc(X(p.x),p.y*h,3,0,Math.PI*2);ctx.fill();}
  const palette=['#f6b57c','#d2fa85','#83dfdc','#b6a1ff','#fa9bc5'];
  for(const f of t.fingers||[]){const x=X(f.x),y=f.y*h,lit=f.flashUntil>time;ctx.strokeStyle=lit?'#fff':palette[f.finger];ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=lit?4:2;ctx.beginPath();ctx.arc(x,y,lit?12:8,0,Math.PI*2);ctx.stroke();ctx.beginPath();f.path.forEach(([px,py],i)=>i?ctx.lineTo(X(px),py*h):ctx.moveTo(X(px),py*h));ctx.stroke();ctx.font='bold 12px sans-serif';const text=window.i18n.text(fingerName(f.finger))+(f.note?' '+bridge.name(f.note):'');const tw=ctx.measureText(text).width+8,tx=Math.max(0,Math.min(w-tw,x+11)),ty=Math.max(18,Math.min(h-5,y+(f.finger%2?16:-10)));ctx.fillStyle='#101912d9';ctx.fillRect(tx,ty-14,tw,18);ctx.fillStyle=lit?'#fff':palette[f.finger];ctx.fillText(text,tx+4,ty);}

 }
}
$('videoTab').onclick=()=>chooseSource(false);$('cameraTab').onclick=()=>chooseSource(true);
$('cameraStart').onclick=start;$('cameraStop').onclick=()=>stop();$('cameraRefresh').onclick=refreshDevices;
$('cameraTone').onchange=()=>{bridge.stop();bridge.configure({tone:$('cameraTone').value});clearHands();};
$('cameraScale').onchange=()=>{bridge.stop();bridge.configure({scale:$('cameraScale').value});clearHands();};
$('cameraVolume').oninput=()=>{bridge.configure({volume:$('cameraVolume').value});$('cameraVolumeOut').textContent=$('cameraVolume').value+'%';};
$('cameraSound').onchange=()=>{bridge.stop();bridge.configure({sound:$('cameraSound').checked});};
$('cameraCooldown').oninput=()=>$('cameraCooldownOut').textContent=$('cameraCooldown').value+' ms';
$('cameraMirror').onchange=()=>{view.classList.toggle('mirrored',$('cameraMirror').checked);clearHands();};view.classList.add('mirrored');
window.addEventListener('pagehide',()=>stop(''));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&stream)stop('页面已切到后台，摄像头已关闭；返回后可重新开启。');});
navigator.mediaDevices?.addEventListener('devicechange',refreshDevices);

