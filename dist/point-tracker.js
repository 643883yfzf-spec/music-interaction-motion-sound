/* Bright moving spark heads; share the fragment tracker's identity/trajectory lifecycle. */
(function(root){
class BrightPointTracker extends root.FragmentTracker {
 detect(gray,previous,w,h,bounds,threshold,minPixels){
  const mask=new Uint8Array(w*h),seen=new Uint8Array(w*h),queue=new Int32Array(w*h),detections=[];
  // Keep separated sparks separate: unlike glass, do not dilate bright contours.
  for(let y=bounds.top;y<bounds.bottom;y++)for(let x=bounds.x;x<bounds.r;x++){
   const p=y*w+x;if(gray[p]>=threshold)mask[p]=1;
  }
  for(let y=bounds.top;y<bounds.bottom;y++)for(let x=bounds.x;x<bounds.r;x++){
   const start=y*w+x;if(!mask[start]||seen[start])continue;
   let head=0,tail=1,left=x,right=x,top=y,bottom=y,moving=0,best=start,bestScore=-1;
   queue[0]=start;seen[start]=1;
   while(head<tail){
    const p=queue[head++],py=Math.floor(p/w),px=p-py*w;
    left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);
    if(previous&&Math.abs(gray[p]-previous[p])>12)moving++;
    // Prefer a bright, newly illuminated head over the fading tail behind it.
    let light=0,novelty=0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
     const nx=px+dx,ny=py+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;
     const q=ny*w+nx;light+=gray[q];novelty+=previous?Math.max(0,gray[q]-previous[q]):0;
    }
    const score=light*.35+novelty;
    if(score>bestScore){bestScore=score;best=p;}
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
     if(!dx&&!dy)continue;const nx=px+dx,ny=py+dy;
     if(nx<bounds.x||nx>=bounds.r||ny<bounds.top||ny>=bounds.bottom)continue;
     const q=ny*w+nx;if(mask[q]&&!seen[q]){seen[q]=1;queue[tail++]=q;}
    }
   }
   const bw=right-left+1,bh=bottom-top+1;
   // Reject compression noise, static lettering, smoke and the merged burst core.
   if(tail<minPixels||moving/tail<.04||tail>w*h*.012||bw*bh>w*h*.045||bw>w*.5||bh>h*.35)continue;
   const py=Math.floor(best/w),px=best-py*w;let weight=0,cx=0,cy=0;
   for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
    const nx=px+dx,ny=py+dy;if(nx<bounds.x||nx>=bounds.r||ny<bounds.top||ny>=bounds.bottom)continue;
    const p=ny*w+nx;if(!mask[p])continue;
    const a=gray[p]*(1+(previous?Math.max(0,gray[p]-previous[p])/255:0));weight+=a;cx+=nx*a;cy+=ny*a;
   }
   cx/=weight;cy/=weight;
   detections.push({x:Math.max(0,cx-4),y:Math.max(0,cy-4),w:8,h:8,cx,cy,area:64,pixels:tail,motion:moving/tail,strength:bestScore});
  }
  detections.sort((a,b)=>b.strength-a.strength);
  return{detections:detections.slice(0,80),mask};
 }
 update(gray,previous,w,h,bounds,time,options={}){
  return super.update(gray,previous,w,h,bounds,time,{...options,pointTracking:true,confirmations:2});
 }
}
root.BrightPointTracker=BrightPointTracker;
})(typeof window!=='undefined'?window:globalThis);
