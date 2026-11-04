let detector;
self.onmessage=async({data})=>{
 try{
  if(data.type==='init'){
   const {FilesetResolver,HandLandmarker}=await import('./vendor/mediapipe/vision_bundle.mjs');
   const files=await FilesetResolver.forVisionTasks(new URL('./vendor/mediapipe/wasm',self.location.href).href);
   detector=await HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:new URL('./vendor/mediapipe/hand_landmarker.task',self.location.href).href,delegate:'CPU'},runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.6,minHandPresenceConfidence:.6,minTrackingConfidence:.6});
   self.postMessage({type:'ready'});
  }else if(data.type==='frame'){
   try{const result=detector.detectForVideo(data.frame,data.timestamp);self.postMessage({type:'result',landmarks:result.landmarks,timestamp:data.timestamp});}finally{data.frame.close();}
  }
 }catch(error){self.postMessage({type:'error',message:error.message||String(error)});}
};
