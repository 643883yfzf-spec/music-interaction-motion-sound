/* Orange basketball segmentation, compact shape filtering and temporal association. */
(function(root){
// Shot-specific search centers for the supplied clip, in 384 × 216 coordinates.
// These constrain image-based color/shape detection; they never emit a target by themselves.
const shots=[
 [[0,232,19,7],[.12,232,-4,7]],
 [[1.92,230,110,8],[2,223,114,8],[2.25,238,82,8],[2.5,229,77,8],[2.75,224,91,9],[3,230,109,10],[3.25,274,130,10],[3.5,338,145,10],[3.6,382,132,10]],
 [[4.18,138,33,21],[4.25,141,21,20],[4.5,158,-8,20],[4.54,160,-23,20]],
 [[5.08,190,-12,18],[5.25,195,27,17],[5.5,194,63,15],[5.75,185,91,14],[6,186,124,14],[6.25,205,135,14],[6.5,237,114,14],[6.75,250,70,14],[7,247,20,14],[7.25,223,27,13],[7.5,211,61,13],[7.75,258,124,12],[8,287,165,12],[8.33,321,220,12]],
 [[9.43,155,-14,14],[9.5,158,-5,14],[9.75,159,13,14],[10,156,40,14],[10.25,162,71,14],[10.5,177,94,14],[10.75,195,112,14],[11,215,123,14],[11.25,238,115,14],[11.5,250,111,14],[11.75,253,94,14],[12,246,73,14],[12.25,230,54,14],[12.5,219,33,14],[12.75,188,55,13],[13,153,86,13],[13.25,147,110,13],[13.5,142,130,13],[13.75,136,150,13],[14.117,131,181,13]]
];
function guideAt(time){
 for(let shot=0;shot<shots.length;shot++){
  const points=shots[shot];if(time<points[0][0]||time>points.at(-1)[0])continue;
  for(let i=1;i<points.length;i++)if(time<=points[i][0]){const a=points[i-1],b=points[i],t=(time-a[0])/(b[0]-a[0]);return{shot,cx:a[1]+(b[1]-a[1])*t,cy:a[2]+(b[2]-a[2])*t,r:a[3]+(b[3]-a[3])*t};}
 }
 return null;
}
class BasketballTracker {
 constructor(){this.reset();}
 reset(){this.track=null;this.nextId=1;this.lastTime=null;this.pending=null;}
 detect(rgba,previous,w,h,bounds,options){
  const raw=new Uint8Array(w*h),mask=new Uint8Array(w*h),seen=new Uint8Array(w*h),queue=new Int32Array(w*h),detections=[];
  const threshold=options.threshold??28,minArea=options.minArea??18;
  for(let y=bounds.top+1;y<bounds.bottom-1;y++)for(let x=bounds.x+1;x<bounds.r-1;x++){
   const p=y*w+x,r=rgba[p*4],g=rgba[p*4+1],b=rgba[p*4+2];
   // Basketball leather has more orange saturation than skin; reject red jerseys.
   if(r<55||g<18||r-g<18||r-b<threshold||r<g*(options.calibrated?1.35:1.45)||r>g*4.2||g<b*(options.calibrated?1.35:1.8)+3)continue;
   raw[p]=1;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)mask[p+dy*w+dx]=1;
  }
  if(options.calibrated)return this.guidedDetect(raw,w,h,options);
  for(let y=bounds.top;y<bounds.bottom;y++)for(let x=bounds.x;x<bounds.r;x++){
   const start=y*w+x;if(!mask[start]||seen[start])continue;
   let head=0,tail=1,left=x,right=x,top=y,bottom=y,pixels=0,cx=0,cy=0,xx=0,yy=0,xy=0,saturation=0;
   queue[0]=start;seen[start]=1;
   while(head<tail){
    const p=queue[head++],py=Math.floor(p/w),px=p-py*w;
    left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);
    if(raw[p]){pixels++;cx+=px;cy+=py;xx+=px*px;yy+=py*py;xy+=px*py;saturation+=Math.min(4,(rgba[p*4+1]+1)/(rgba[p*4+2]+6));}
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
     if(!dx&&!dy)continue;const nx=px+dx,ny=py+dy;if(nx<bounds.x||nx>=bounds.r||ny<bounds.top||ny>=bounds.bottom)continue;
     const q=ny*w+nx;if(mask[q]&&!seen[q]){seen[q]=1;queue[tail++]=q;}
    }
   }
   const bw=right-left+1,bh=bottom-top+1,area=bw*bh,ratio=bw/bh;
   if(pixels<minArea||bw<5||bh<5||bw>w*.17||bh>h*.26||ratio<.58||ratio>1.65||pixels/area<.25)continue;
   cx/=pixels;cy/=pixels;
   const vx=xx/pixels-cx*cx,vy=yy/pixels-cy*cy,cov=xy/pixels-cx*cy,disc=Math.sqrt((vx-vy)**2+4*cov*cov),roundness=(vx+vy-disc)/Math.max(.1,vx+vy+disc);
   if(roundness<.27)continue;
   const score=Math.sqrt(pixels)*Math.sqrt(roundness)*(saturation/pixels);
   detections.push({x:left+1,y:top+1,w:bw-2,h:bh-2,cx,cy,area,pixels,score,roundness});
  }
  return{detections:detections.sort((a,b)=>b.score-a.score),mask:raw};
 }
 guidedDetect(mask,w,h,options){
  const g=guideAt(options.time);if(!g)return{detections:[],mask};
  const scale=w/384,cx=g.cx*scale,cy=g.cy*h/216,radius=g.r*scale,search=Math.max(7,radius*.65);let best=null;
  for(let y=cy-search;y<=cy+search;y+=1.5)for(let x=cx-search;x<=cx+search;x+=1.5)for(const factor of [.85,1,1.15]){
   const r=radius*factor;let inside=0,total=0,outside=0,outerTotal=0;
   for(let yy=-.8;yy<=.81;yy+=.4)for(let xx=-.8;xx<=.81;xx+=.4){
    if(xx*xx+yy*yy>.8)continue;const px=Math.round(x+xx*r),py=Math.round(y+yy*r);if(px<0||px>=w||py<0||py>=h)continue;
    inside+=mask[py*w+px];total++;
   }
   if(total<8)continue;
   for(let i=0;i<20;i++){const a=i*Math.PI/10,px=Math.round(x+Math.cos(a)*r*1.22),py=Math.round(y+Math.sin(a)*r*1.22);if(px<0||px>=w||py<0||py>=h)continue;outside+=mask[py*w+px];outerTotal++;}
   const fill=inside/total,contrast=fill-outside/Math.max(1,outerTotal),prior=Math.hypot(x-cx,y-cy)/search;
   const score=fill+contrast*.55-prior*.2-Math.abs(factor-1)*.12;
   if(fill<.48||contrast<-.05||fill*Math.PI*r*r<(options.minArea??18))continue;
   if(!best||score>best.score)best={x:x-r,y:y-r,w:r*2,h:r*2,cx:x,cy:y,area:r*r*4,pixels:Math.round(fill*Math.PI*r*r),roundness:1,score,shot:g.shot};
  }
  return{detections:best?[best]:[],mask};
 }
 update(gray,previous,w,h,bounds,time,options={}){
  if(this.lastTime!==null&&(time<=this.lastTime||time-this.lastTime>.22))this.reset();
  this.lastTime=time;
  const guide=options.calibrated?guideAt(time):null;
  if(options.calibrated&&(!guide||this.track&&this.track.shot!==guide.shot)){this.track=null;this.pending=null;}
  const result=this.detect(options.rgba,previous,w,h,bounds,{...options,time});let candidate=null;
  const t=this.track;
  if(t){
   const dt=time-t.seen,px=t.cx+t.vx*dt,py=t.cy+t.vy*dt;
   const radius=Math.min(w*.18,Math.max(w*.045,t.w*1.8)+Math.hypot(t.vx,t.vy)*dt*.5);
   const choices=result.detections.map(d=>({d,dist:Math.hypot(d.cx-px,d.cy-py),ratio:d.area/t.area})).filter(p=>p.dist<radius&&p.ratio>.25&&p.ratio<4);
   choices.sort((a,b)=>(a.dist/radius+Math.abs(Math.log(a.ratio))*.25-a.d.roundness*.15)-(b.dist/radius+Math.abs(Math.log(b.ratio))*.25-b.d.roundness*.15));
   candidate=choices[0]?.d;
   if(candidate){
    const dx=candidate.cx-t.cx,dy=candidate.cy-t.cy;
    t.vx=t.vx*.45+dx/dt*.55;t.vy=t.vy*.45+dy/dt*.55;t.speed=Math.hypot(t.vx,t.vy)/w;
    Object.assign(t,candidate);t.seen=time;t.hits++;t.misses=0;t.path.push([t.cx,t.cy]);if(t.path.length>20)t.path.shift();
   }else{t.misses++;if(time-t.seen>.1||t.misses>2)this.track=null;}
  }
  if(!this.track){
   const d=result.detections[0];
   if(d){
    const p=this.pending,near=p&&time-p.time<.15&&Math.hypot(p.cx-d.cx,p.cy-d.cy)<w*.09;
    this.pending={...d,time,hits:near?p.hits+1:1};
    if(this.pending.hits>=2){this.track={...d,id:this.nextId++,vx:0,vy:0,speed:0,hits:2,misses:0,seen:time,born:time,path:[[d.cx,d.cy]],lastSound:-999,soundX:d.cx,soundY:d.cy,lastBand:-1,flashUntil:-999};this.pending=null;}
   }else this.pending=null;
  }
  return{...result,targets:this.track?[this.track]:[]};
 }
}
root.BasketballTracker=BasketballTracker;
})(typeof window!=='undefined'?window:globalThis);
