'use strict';

class HandRemix {
 constructor(){this.reset();}
 reset(){
  this.labels={left:null,right:null};
  this.selected=0;
  this.pending=0;
  this.pendingSince=0;
  this.left=null;
  this.armed=false;
  this.closedSince=null;
  this.openSince=null;
  this.lastTrigger=-Infinity;
  this.time=null;
  this.rightSeen=null;
  this.started=null;
  this.controls={volume:.5,filter:.7};
 }
 update(landmarks,handedness,time,aspect=4/3,mirror=true,cooldown=0){
  if(this.time!==null&&(time<=this.time||time-this.time>.5)){
   this.armed=false;this.closedSince=null;this.openSince=null;this.left=null;
  }
  const dt=this.time===null?.05:Math.min(.1,Math.max(.001,time-this.time));
  this.time=time;
  if(this.started===null)this.started=time;
  const hands=landmarks.map((points,index)=>{
   const category=handedness[index]?.[0];
   if(points?.length!==21||!category||category.score<.6)return null;
   const palm=[0,5,9,13,17].map(i=>points[i]);
   const rawX=palm.reduce((sum,p)=>sum+p.x,0)/palm.length;
   const y=palm.reduce((sum,p)=>sum+p.y,0)/palm.length;
   return {points,label:category.categoryName,x:mirror?1-rawX:rawX,y};
  }).filter(Boolean);
  const ambiguous=hands.length===2&&(hands[0].label===hands[1].label||Math.hypot((hands[0].x-hands[1].x)*aspect,hands[0].y-hands[1].y)<.16);
  const targets=[];
  if(!ambiguous)for(const hand of hands){
   const zone=hand.x<.46?'left':hand.x>.54?'right':null;
   if(!zone)continue;
   const other=zone==='left'?'right':'left';
   if(this.labels[zone]===null&&this.labels[other]!==hand.label)this.labels[zone]=hand.label;
   if(this.labels[zone]!==hand.label)continue;
   targets.push({...hand,role:zone});
  }
  const left=targets.find(t=>t.role==='left'),right=targets.find(t=>t.role==='right');
  const alpha=1-Math.exp(-dt/.09);
  let trigger=null,pinched=false;
  if(left){
   const fresh=!this.left||time-this.left.seen>.18;
   const x=fresh?left.x:this.left.x+(left.x-this.left.x)*alpha;
   this.left={x,seen:time};
   const position=Math.max(0,Math.min(.999,(x-.04)/.40))*7;
   const candidate=Math.floor(position);
   const inside=position<this.selected-.12||position>this.selected+1.12;
   if(candidate!==this.pending){this.pending=candidate;this.pendingSince=time;}
   if(candidate!==this.selected&&inside&&time-this.pendingSince>=.12)this.selected=candidate;
   const distance=(a,b)=>Math.hypot((a.x-b.x)*aspect,a.y-b.y);
   const palmSize=Math.max(distance(left.points[0],left.points[9]),distance(left.points[5],left.points[17]),.03);
   const pinch=distance(left.points[4],left.points[8])/palmSize;
   if(fresh){this.armed=false;this.openSince=null;this.closedSince=null;}
   if(pinch>.48){
    this.closedSince=null;
    if(this.openSince===null)this.openSince=time;
    if(time-this.openSince>=.10)this.armed=true;
   }else if(pinch<.32){
    pinched=true;this.openSince=null;
    if(this.closedSince===null)this.closedSince=time;
    if(this.armed&&time-this.closedSince>=.12&&time-this.lastTrigger>=cooldown){
     trigger=this.selected;this.lastTrigger=time;this.armed=false;
    }
   }else{this.closedSince=null;this.openSince=null;}
  }else{
   this.armed=false;this.closedSince=null;this.openSince=null;this.left=null;
  }
  if(right){
   this.rightSeen=time;
   const volume=Math.max(0,Math.min(1,(.85-right.y)/.70));
   const filter=Math.max(0,Math.min(1,(right.x-.56)/.40));
   this.controls.volume+=(volume-this.controls.volume)*alpha;
   this.controls.filter+=(filter-this.controls.filter)*alpha;
  }else if(time-(this.rightSeen??this.started)>.8){
   this.controls.volume+=(.5-this.controls.volume)*(1-Math.exp(-dt/.35));
  }
  return {targets,selected:this.selected,trigger,pinched,armed:this.armed,ambiguous,controls:{...this.controls},leftX:this.left?.x??null};
 }
}
if(typeof module!=='undefined')module.exports=HandRemix;
