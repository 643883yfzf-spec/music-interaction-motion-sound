// Keep a selected device on retries; never silently switch cameras.
export async function acquireCamera({mediaDevices, deviceId='', isCurrent=()=>true, onRetry=()=>{}, timeoutMs=20000}) {
  const selected=deviceId?{deviceId:{exact:deviceId}}:{};
  const attempts=[{...selected,width:{ideal:640},height:{ideal:480}},deviceId?selected:true];
  for(let i=0;i<attempts.length;i++) {
    if(!isCurrent())throw new DOMException('Camera request cancelled.','AbortError');
    let expired=false,timer;
    try {
      const pending=mediaDevices.getUserMedia({audio:false,video:attempts[i]}).then(stream=>{
        if(expired||!isCurrent()) {
          stream.getTracks().forEach(track=>track.stop());
          throw new DOMException('Camera request cancelled.','AbortError');
        }
        return stream;
      });
      return await Promise.race([pending,new Promise((_,reject)=>{
        timer=setTimeout(()=>{
          expired=true;
          reject(new DOMException('Camera access timed out. Check the browser permission prompt, or open this page directly in Chrome or Edge.','TimeoutError'));
        },timeoutMs);
      })]);
    } catch(error) {
      if(i===0&&isCurrent()&&['NotReadableError','OverconstrainedError','AbortError'].includes(error.name)) {
        onRetry();
        continue;
      }
      throw error;
    } finally {clearTimeout(timer);}
  }
}
