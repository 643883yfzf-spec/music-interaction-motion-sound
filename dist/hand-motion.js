/* Normalized landmark tracking and movement-to-note decisions, shared with tests. */
(function(root){
class HandMotion {
 constructor(){this.reset();}
 reset(){this.tracks=[];this.nextId=1;this.time=null;}
 update(landmarks,time,noteCount,cooldown=.22){
  if(this.time!==null&&(time<=this.time||time-this.time>.5))this.reset();this.time=time;
  const detections=landmarks.filter(points=>points?.length===21).map(points=>{
   const palm=[0,5,9,13,17].map(i=>points[i]);
   return {points,x:palm.reduce((s,p)=>s+p.x,0)/5,y:palm.reduce((s,p)=>s+p.y,0)/5};
  });
  const pairs=[];this.tracks.forEach((t,ti)=>detections.forEach((d,di)=>{const dt=time-t.seen,dist=Math.hypot(t.x+t.vx*dt-d.x,t.y+t.vy*dt-d.y);if(dist<.25)pairs.push({ti,di,dist});}));
  pairs.sort((a,b)=>a.dist-b.dist);const usedT=new Set(),usedD=new Set();
  for(const p of pairs){if(usedT.has(p.ti)||usedD.has(p.di))continue;usedT.add(p.ti);usedD.add(p.di);const t=this.tracks[p.ti],d=detections[p.di],dt=time-t.seen;
   if(dt>.18){t.hits=0;t.speed=0;t.vx=0;t.vy=0;t.soundX=d.x;t.soundY=d.y;t.pending=-1;}
   else {const dx=d.x-t.x,dy=d.y-t.y;t.vx=t.vx*.6+dx/dt*.4;t.vy=t.vy*.6+dy/dt*.4;t.speed=Math.min(3,Math.hypot(t.vx,t.vy));}
   t.x=t.x*.3+d.x*.7;t.y=t.y*.3+d.y*.7;t.points=d.points;t.seen=time;t.hits++;t.path.push([t.x,t.y]);if(t.path.length>16)t.path.shift();
  }
  this.tracks=this.tracks.filter(t=>time-t.seen<.3);
  detections.forEach((d,i)=>{if(!usedD.has(i))this.tracks.push({...d,id:this.nextId++,seen:time,hits:1,vx:0,vy:0,speed:0,lastSound:-999,lastBand:-1,soundX:d.x,soundY:d.y,path:[[d.x,d.y]],flashUntil:-999});});
  const visible=this.tracks.filter(t=>t.seen===time).slice(0,2),events=[];
  for(const t of visible){
   const previous=t.fingers||[];t.fingers=[4,8,12,16,20].map((index,finger)=>{
    const point=t.points[index],old=previous[finger],dt=old?time-old.time:0;
    if(!old||dt>.18||dt<=0)return {finger,x:point.x,y:point.y,vx:0,vy:0,speed:0,time,lastSound:-999,lastBand:-1,soundX:point.x,soundY:point.y,flashUntil:-999,path:[[point.x,point.y]],frames:1};
    const vx=old.vx*.5+(point.x-old.rawX)/dt*.5,vy=old.vy*.5+(point.y-old.rawY)/dt*.5;
    return {...old,x:old.x*.25+point.x*.75,y:old.y*.25+point.y*.75,rawX:point.x,rawY:point.y,vx,vy,speed:Math.min(3,Math.hypot(vx,vy)),time,frames:old.frames+1,path:[...old.path.slice(-11),[point.x,point.y]]};
   });
   for(const f of t.fingers){if(f.rawX===undefined){f.rawX=f.x;f.rawY=f.y;}
    const band=Math.max(0,Math.min(noteCount-1,Math.floor((1-f.y)*noteCount)));
    if(f.pending===band)f.bandFrames=(f.bandFrames||0)+1;else{f.pending=band;f.bandFrames=1;}
    const travel=Math.hypot(f.x-f.soundX,f.y-f.soundY),crossed=band!==f.lastBand&&f.bandFrames>=2;
    if(t.hits>=4&&f.frames>=4&&f.speed>.065&&travel>.016&&time-f.lastSound>=cooldown&&(crossed||(travel>.055&&time-f.lastSound>.45))){f.lastSound=time;f.lastBand=band;f.soundX=f.x;f.soundY=f.y;f.flashUntil=time+.18;events.push({id:t.id,finger:f.finger,band,velocity:Math.round(Math.min(118,42+f.speed*90)),x:f.x,speed:f.speed});}
   }
  }
  return {targets:visible,events};
 }
}
root.HandMotion=HandMotion;if(typeof module!=='undefined')module.exports=HandMotion;
})(typeof window!=='undefined'?window:globalThis);
