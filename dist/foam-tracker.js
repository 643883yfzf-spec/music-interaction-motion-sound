/* Follow spatially separated patches of newly moving white foam, not individual droplets. */
(function(root){
class FoamTracker extends root.FragmentTracker{
 detect(gray,previous,w,h,bounds,threshold,minArea){
  const mask=new Uint8Array(w*h),detections=[],size=28;
  for(let top=bounds.top;top<bounds.bottom;top+=size)for(let left=0;left<w;left+=size){
   let count=0,cx=0,cy=0,weight=0;
   for(let y=top;y<Math.min(top+size,bounds.bottom);y++)for(let x=left;x<Math.min(left+size,w);x++){
    const p=y*w+x,change=previous?Math.abs(gray[p]-previous[p]):0;
    if(gray[p]<threshold||change<14)continue;
    mask[p]=1;count++;const a=Math.min(change,80);cx+=x*a;cy+=y*a;weight+=a;
   }
   if(count<minArea)continue;cx/=weight;cy/=weight;
   detections.push({x:Math.max(0,cx-9),y:Math.max(0,cy-9),w:18,h:18,cx,cy,area:324,pixels:count,motion:1,strength:weight});
  }
  detections.sort((a,b)=>b.strength-a.strength);
  return{detections:detections.slice(0,100),mask};
 }
 update(gray,previous,w,h,bounds,time,options={}){return super.update(gray,previous,w,h,bounds,time,{...options,pointTracking:true,confirmations:2});}
}
root.FoamTracker=FoamTracker;
})(typeof window!=='undefined'?window:globalThis);
