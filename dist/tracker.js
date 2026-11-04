/* Connected bright contours + predictive frame association. No network/model dependency. */
(function(root){
class FragmentTracker {
 constructor(){this.reset();}
 reset(){this.tracks=[];this.nextId=1;this.selected=[];this.lastTime=null;}
 detect(gray,previous,w,h,bounds,threshold,minArea){
  const mask=new Uint8Array(w*h),bright=new Uint8Array(w*h),seen=new Uint8Array(w*h),queue=new Int32Array(w*h),detections=[];
  // One-pixel dilation joins broken reflective edges. Motion is measured on original pixels.
  for(let y=bounds.top+1;y<bounds.bottom-1;y++)for(let x=bounds.x+1;x<bounds.r-1;x++){
   const p=y*w+x;if(gray[p]<threshold)continue;bright[p]=1;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)mask[p+dy*w+dx]=1;
  }
  for(let y=bounds.top;y<bounds.bottom;y++)for(let x=bounds.x;x<bounds.r;x++){
   const start=y*w+x;if(!mask[start]||seen[start])continue;
   let head=0,tail=1,left=x,right=x,top=y,bottom=y,pixels=0,motion=0,cx=0,cy=0;queue[0]=start;seen[start]=1;
   while(head<tail){const p=queue[head++],py=Math.floor(p/w),px=p-py*w;left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);
    if(bright[p]){pixels++;cx+=px;cy+=py;if(previous&&Math.abs(gray[p]-previous[p])>8)motion++;}
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=px+dx,ny=py+dy;if(nx<bounds.x||nx>=bounds.r||ny<bounds.top||ny>=bounds.bottom)continue;const q=ny*w+nx;if(mask[q]&&!seen[q]){seen[q]=1;queue[tail++]=q;}}
   }
   const bw=right-left+1,bh=bottom-top+1,area=bw*bh;
   // Ignore static full-height glass, merged clouds and tiny glints.
   if(area<minArea||pixels<12||bw<5||bh<5||area>w*h*.085||bh>h*.64||bw>w*.4||pixels/area<.045)continue;
   detections.push({x:left,y:top,w:bw,h:bh,cx:cx/pixels,cy:cy/pixels,area,pixels,motion:motion/Math.max(1,pixels)});
  }
  detections.sort((a,b)=>b.area-a.area);return {detections:detections.slice(0,40),mask:bright};
 }
 update(gray,previous,w,h,bounds,time,options={}){
  if(this.lastTime!==null&&(time<=this.lastTime||time-this.lastTime>.22))this.reset();
  const dt=this.lastTime===null?1/30:time-this.lastTime;this.lastTime=time;
  const confirmations=options.confirmations??3;
  const result=this.detect(gray,previous,w,h,bounds,options.threshold??28,options.minArea??100),pairs=[];
  this.tracks.forEach((t,ti)=>result.detections.forEach((d,di)=>{
   const age=time-t.seen,px=t.cx+t.vx*age,py=t.cy+t.vy*age,dist=Math.hypot(d.cx-px,d.cy-py),radius=options.pointTracking?Math.min(w*.075,w*.022+Math.hypot(t.vx,t.vy)*age*.7)+Math.min(t.misses*2,6):Math.min(w*.11,Math.max(w*.035,Math.hypot(t.w,t.h)*.6))+Math.min(t.misses*3,9),ratio=d.area/t.area;
   if(dist<radius&&ratio>.28&&ratio<3.5)pairs.push({ti,di,cost:dist/radius+Math.abs(Math.log(ratio))*.38});
  }));
  pairs.sort((a,b)=>a.cost-b.cost);const usedT=new Set(),usedD=new Set();
  for(const p of pairs){if(usedT.has(p.ti)||usedD.has(p.di))continue;usedT.add(p.ti);usedD.add(p.di);const t=this.tracks[p.ti],d=result.detections[p.di],elapsed=time-t.seen,dx=d.cx-t.cx,dy=d.cy-t.cy;
   t.vx=t.vx*.55+dx/elapsed*.45;t.vy=t.vy*.55+dy/elapsed*.45;
   t.speed=Math.hypot(t.vx,t.vy)/w;Object.assign(t,d);t.seen=time;t.misses=0;t.hits++;t.path.push([t.cx,t.cy]);if(t.path.length>14)t.path.shift();
  }
  this.tracks.forEach((t,i)=>{if(!usedT.has(i))t.misses++;});
  this.tracks=this.tracks.filter(t=>time-t.seen<.18&&t.misses<=4);
  result.detections.forEach((d,i)=>{if(!usedD.has(i)&&d.motion>.06)this.tracks.push({...d,id:this.nextId++,vx:0,vy:0,speed:0,hits:1,misses:0,seen:time,born:time,path:[[d.cx,d.cy]],lastSound:-999,soundX:d.cx,soundY:d.cy,lastBand:-1,flashUntil:-999});});
  // Retain selected identities; fill vacancies from larger confirmed contours.
  this.selected=this.selected.filter(id=>this.tracks.some(t=>t.id===id&&t.hits>=confirmations));
  const eligible=this.tracks.filter(t=>t.hits>=confirmations&&t.misses===0&&!this.selected.includes(t.id)).sort((a,b)=>options.pointTracking?b.strength-a.strength:b.area-a.area);
  const limit=options.maxTargets??6;this.selected=this.selected.slice(0,limit);
  for(const t of eligible){if(this.selected.length>=limit)break;this.selected.push(t.id);}
  return {...result,targets:this.selected.map(id=>this.tracks.find(t=>t.id===id)).filter(t=>t&&t.misses<=2)};
 }
}
root.FragmentTracker=FragmentTracker;if(typeof module!=='undefined')module.exports=FragmentTracker;
})(typeof window!=='undefined'?window:globalThis);
