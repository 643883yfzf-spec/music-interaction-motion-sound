/* UI-only translation; detection and uploaded filenames are unchanged. */
(()=>{
const dictionary=Object.fromEntries(`动势谱|Motion Score
动势谱 / MOTION SCORE|MOTION SCORE
动势谱 · 视频声音实验室|Motion Score · Video & Finger Music Lab
视频声音实验室|Visual Music Lab
让每一次运动，|Turn every movement 
成为声音。|into sound.
锁定大碎片，让每个目标的位置与速度驱动声音。|Track motion. Play with video or your fingertips.
本地分析 · 原视频静音|Local processing · Source audio muted
功能选项|Source mode
01 视频识别|01 Video tracking
02 摄像头 · 指尖演奏|02 Camera · Finger play
实时摄像头|Live camera
尚未启动|Not started
最多识别双手|Up to 2 hands · 10 fingertips
举起手，让动作成为声音。|Raise your fingers. Make music.
点击“开启摄像头”，允许访问你的 Web Camera。|Select Start camera, then allow camera access.
开启摄像头并演奏|Start camera & play
关闭摄像头|Stop camera
镜像预览|Mirror preview
摄像头尚未开启；画面仅在本机分析，不录制、不上传，也不使用麦克风。|Camera is off. Frames stay on this device. No recording, uploads or microphone.
已识别手部|Hands detected
本次音符|Notes played
最近音符|Last note
等待手部进入画面…|Waiting for hands…
指尖演奏设置|Finger play settings
摄像头|Camera
系统默认摄像头|System default camera
刷新设备列表|Refresh cameras
电钢琴|Electric Piano
号|Horn
学生采样 · S 短音|Student samples · Short (S)
音色|Sound preset
玻璃 · 清脆短音|Glass · Bright pluck
柔和 · 正弦拨弦|Soft · Sine pluck
音阶|Scale
C 小调五声音阶|C minor pentatonic
C 大调五声音阶|C major pentatonic
半音阶|Chromatic
演奏间隔|Retrigger interval
音量|Volume
网页发声|Browser audio
怎样演奏|How to play
五个指尖独立触发音符：上下改变音高，左右改变声像，速度改变力度；发声时对应指尖闪白。|Each fingertip plays independently. Height sets pitch, horizontal position sets pan, and speed sets velocity. A fingertip flashes white when it plays.
保持手掌和手指完整入镜。静止时不持续重复发声，离开画面后停止触发。|Keep your full hand in view. Still fingers do not retrigger. Lost fingers stop generating notes.
每只手的拇指、食指、中指、无名指和小指均可演奏。骨架辅助定位，指尖各自显示轨迹和音符。|Thumb, index, middle, ring and little fingers all play. Each tip has its own trail, note and visual feedback.
如果已有 MIDI 连接，手部音符仍发送到通道 1。切换回视频模式会自动关闭摄像头。|With MIDI connected, finger notes use channel 1. Switching to video mode turns the camera off.
视频输入|Video input
素材1 · 玻璃碎裂|Sample 1 · Shattering glass
＋ 更换视频|＋ Choose video
全画面|Full frame
等待运动|Waiting for motion
开始播放并开启声音|Play and enable audio
▶ 开始演奏|▶ Start playing
▶ 继续演奏|▶ Resume
▶ 重新演奏|▶ Play again
Ⅱ 暂停|Ⅱ Pause
↺ 重播|↺ Restart
返回开头|Return to start
循环|Loop
视频进度|Video position
已载入示例 · 点击开始，启用声音|Sample loaded · Select Start to enable audio
跟随框|Tracking boxes
显示检测蒙版|Detection mask
高度分区|Pitch grid
运动活跃度|Motion activity
本轮音符|Notes this loop
主撞击|Main impact
分析频率|Analysis rate
已锁定目标|Tracked objects
白框闪烁 = 此碎片正在发声|White flash = this fragment plays
等待可分离的大碎片…|Waiting for distinct fragments…
运动轨迹|Motion history
最近约 8 秒 · 活跃度 / 撞击|Last ~8 seconds · Activity / impact
高度音谱|Pitch bands
高 ↑|High ↑
低 ↓|Low ↓
映射工作台|Mapping controls
恢复预设|Reset preset
画面提取|Visual analysis
检测方式|Detection mode
大碎片 · 独立目标跟踪|Large fragments · Object tracking
帧差 · 只听变化|Frame difference · Motion
亮度 · 发光目标|Brightness · Light targets
亮度 / 像素阈值|Brightness / pixel threshold
最小碎片框面积|Minimum bounding area
最多跟踪|Maximum objects
显示运动轨迹|Motion trails
区域触发比例|Region trigger ratio
分析范围|Analysis region
全画面（排除边缘水印）|Full frame (trimmed edges)
中间 70%|Center 70%
左侧 50%|Left 50%
右侧 50%|Right 50%
声音映射|Sound mapping
重触发间隔|Retrigger interval
网页音量|Browser volume
撞击重音|Impact accent
连接 MIDI 设备|Connect MIDI
MIDI 输出|MIDI output
未连接 · 当前使用网页声音|Not connected · Browser audio
音符通道 1 · 撞击通道 10 / 音符 36|Notes: ch 1 · Impact: ch 10 / note 36
CC 20 = 首个有效目标速度 · CC 21 = 其横向位置|CC20: first moving target speed · CC21: its horizontal position
停止所有声音 / MIDI Panic|Stop all audio / MIDI panic
从一帧画面，到一枚音符。|From a frame to a note.
每帧以 384 像素宽分析玻璃亮轮廓，筛选大碎片，结合位置预测与尺寸匹配保持编号。目标上下移动改变音高，移动速度决定力度，左右位置决定声像；发声时对应框会闪白。|Video is analyzed at 384 pixels wide. Bright contours identify larger fragments; predicted position and size preserve track IDs. Height sets pitch, speed sets velocity and horizontal position sets pan. Boxes flash when notes play.
01 / 提取|01 / Extract
亮轮廓连接 + 尺寸过滤|Bright contours + size filtering
优先保留较大碎片|Prioritize larger fragments
02 / 判断|02 / Track
跨帧位置预测 + 匹配|Position prediction + frame matching
确认目标后持续编号|Keep IDs after confirmation
03 / 演奏|03 / Play
目标高度 / 速度 / 声像|Height / speed / stereo position
框闪烁与音符同步|Flashes synchronized with notes
使用与 Ableton 连接说明|Usage & Ableton connection
原型 04 · 视频与指尖演奏|Prototype 04 · Video & finger tracking
摄像头已关闭，声音已停止。|Camera off. Audio stopped.
已开启 · 五个手指分别演奏，上下移动指尖改变音高。|Camera ready. Each fingertip plays independently; move tips up or down to change pitch.
正在请求摄像头权限，请在浏览器中允许摄像头访问…|Requesting camera access. Please allow access in your browser…
画面已连接，正在载入本地手部识别模型…|Camera connected. Loading the local landmark model…
未检测到手部 · 请让手掌与手指完整入镜|No hands detected. Keep your full hand in view.
设备列表暂时不可用；可尝试直接开启默认摄像头。|Camera list unavailable. Try the default camera.
请通过 http://localhost:8765 或 HTTPS 打开页面，并使用支持摄像头的浏览器。|Open via localhost:8765 or HTTPS in a camera-compatible browser.
摄像头已断开，请检查设备连接后重新开启。|Camera disconnected. Check the connection and restart.
手部模型载入超时，请检查 vendor 文件是否完整。|Model loading timed out. Check the vendor files.
手部识别模块启动失败，请使用新版 Chrome 或 Edge，检查本地模型文件。|Model startup failed. Use a current Chrome or Edge and check local model files.
手部识别模块发生错误，请重新开启摄像头。|Tracking error. Restart the camera.
摄像头或识别暂时无响应，请重新开启。|Camera or tracking stopped responding. Restart the camera.
摄像头权限未允许。请在浏览器地址栏的网站权限中允许摄像头后重试。|Camera permission denied. Allow it in your browser site settings and retry.
没有发现摄像头，请确认 Web Camera 已连接。|No camera found. Connect your Web Camera.
摄像头可能正被其他程序占用，请关闭占用程序后重试。|Camera may be in use. Close other camera apps and retry.
所选摄像头不可用，请刷新设备列表或改用系统默认摄像头。|Selected camera unavailable. Refresh or choose the default camera.
页面已切到后台，摄像头已关闭；返回后可重新开启。|Camera stopped while the page was hidden. Restart when you return.
已恢复玻璃碎裂预设|Glass preset restored
已暂停 · 点击继续演奏|Paused · Select Resume to continue
已暂停并停止所有声音|Paused. All audio stopped.
播放结束 · 可重播或更换视频|Playback ended · Restart or choose another video
视频已就绪 · 点击开始演奏|Video ready · Select Start playing
视频无法解码，请更换 H.264 编码的 MP4 文件。|Cannot decode video. Choose an H.264 MP4 file.
目标跟踪中 · 框的位置 → 音高，速度 → 力度|Tracking · Height → pitch, speed → velocity
区域分析中 · 高度 → 音高，活跃度 → 力度|Region analysis · Height → pitch, activity → velocity
区域检测模式 · 切换“大碎片”启用独立跟踪|Region mode · Select Large fragments for object tracking
碎片运动中|Fragments moving
暂失|Lost
跟踪中|Tracking
拇指|Thumb
食指|Index
中指|Middle
无名指|Ring
小指|Little
不发送 MIDI|No MIDI output
未选择 MIDI 输出|No MIDI output selected
未发现 MIDI 输出。请先启动 loopMIDI，创建端口后重新连接。|No MIDI outputs found. Start loopMIDI, create a port, then reconnect.
请选择输出端口；通道 1 = 音符，通道 10 / 36 = 撞击；CC 20 活跃度 / CC 21 横向位置|Choose an output. Notes: ch 1; impact: ch 10 / 36; CC20: motion; CC21: position.
当前浏览器不支持 Web MIDI，请使用支持该接口的浏览器并通过 HTTPS 或 localhost 打开。|Web MIDI is unavailable. Use a compatible browser via HTTPS or localhost.`.split('\n').map(line=>line.split('|')));
dictionary["点击“开始演奏”启动视频与音频。原视频始终静音，听到的是分析结果驱动的合成声音。更换视频只在浏览器本地读取，不会上传。"]="Select Start playing to enable video and audio. The original video stays muted; all notes come from visual analysis. Selected files are processed locally without uploads.";
dictionary["连接 Live：在 Windows 启动 loopMIDI 并创建一个端口 → 点击“连接 MIDI 设备”并授权 → 选择该端口 → Live 设置中开启该输入的 Track（映射 CC 时同时开启 Remote）→ MIDI 乐器轨选通道 1、Monitor In。鼓轨选通道 10，将低鼓放在 MIDI 音符 36。Ctrl+M 可将 CC 20 / 21 映射到效果器；建议先关闭网页发声避免双重声音。"]="In Windows, create a port in loopMIDI. Connect MIDI here and select that port. Enable Track for the input in Live, and Remote for CC mapping. Set an instrument track to channel 1 and Monitor In. Use channel 10, note 36 for the impact drum. Ctrl+M maps CC20/21 to effects. Disable browser audio to avoid doubling.";
dictionary["网页 MIDI 需支持 Web MIDI 的浏览器及 HTTPS 或 localhost。网页的“活跃度”表示变化像素占比，不代表真实物理速度或冲击力。主撞击每轮最多触发一次。默认模式跟踪可分离的亮轮廓；透明、重叠或反光消失时可能丢失或更换编号，不能保证框始终对应完整物理碎片。虚线框表示暂时丢失，此时不触发新音符。区域帧差与亮度模式保留用于对照；切换、循环或拖动进度会重置检测历史。单帧最多触发 3 个旋律音。轨迹速度以画面宽度/秒估算，不代表真实物理速度。CC20/21 在跟踪模式下读取列表中首个有效运动目标，区域模式沿用整体活跃度与横向位置。"]="Web MIDI requires a compatible browser via HTTPS or localhost. Activity measures changing pixels, not physical force or speed. The impact accent fires once per video loop. Reflective contours may merge or lose IDs; dashed boxes indicate lost tracks and do not trigger notes. Seeking and looping reset tracking. Finger mode detects up to two hands and gives each fingertip its own note trigger; all ten fingertips can play. Speed is measured relative to image width.";
const traditional={"万":"萬","与":"與","专":"專","业":"業","丛":"叢","东":"東","丝":"絲","丢":"丟","两":"兩","严":"嚴","丧":"喪","个":"個","丰":"豐","临":"臨","为":"為","丽":"麗","举":"舉","义":"義","乌":"烏","乐":"樂","乔":"喬","习":"習","乡":"鄉","书":"書","买":"買","乱":"亂","争":"爭","亏":"虧","亘":"亙","亚":"亞","产":"產","亩":"畝","亲":"親","亵":"褻","亿":"億","仅":"僅","从":"從","仑":"侖","仓":"倉","仪":"儀","们":"們","价":"價","众":"眾","优":"優","会":"會","伛":"傴","伞":"傘","伟":"偉","传":"傳","伤":"傷","伥":"倀","伦":"倫","伧":"傖","伪":"偽","伫":"佇","体":"體","佣":"傭","佥":"僉","侠":"俠","侣":"侶","侥":"僥","侦":"偵","侧":"側","侨":"僑","侩":"儈","侪":"儕","侬":"儂","俣":"俁","俦":"儔","俨":"儼","俩":"倆","俪":"儷","俭":"儉","债":"債","倾":"傾","偬":"傯","偻":"僂","偾":"僨","偿":"償","傥":"儻","傧":"儐","储":"儲","傩":"儺","儿":"兒","兑":"兌","兖":"兗","党":"黨","兰":"蘭","关":"關","兴":"興","兹":"茲","养":"養","兽":"獸","冁":"囅","内":"內","冈":"岡","册":"冊","写":"寫","军":"軍","农":"農","冯":"馮","冲":"沖","决":"決","况":"況","冻":"凍","净":"凈","准":"準","凉":"涼","减":"減","凑":"湊","凛":"凜","几":"幾","凤":"鳳","凫":"鳧","凭":"憑","凯":"凱","凶":"兇","击":"擊","凿":"鑿","刍":"芻","划":"劃","刘":"劉","则":"則","刚":"剛","创":"創","删":"刪","别":"別","刭":"剄","刹":"剎","刽":"劊","刿":"劌","剀":"剴","剂":"劑","剐":"剮","剑":"劍","剥":"剝","剧":"劇","劝":"勸","办":"辦","务":"務","劢":"勱","动":"動","励":"勵","劲":"勁","劳":"勞","势":"勢","勋":"勛","匀":"勻","匦":"匭","匮":"匱","区":"區","医":"醫","华":"華","协":"協","单":"單","卖":"賣","卢":"盧","卤":"鹵","卧":"臥","卫":"衛","却":"卻","卺":"巹","厂":"廠","厅":"廳","历":"歷","厉":"厲","压":"壓","厌":"厭","厍":"厙","厕":"廁","厢":"廂","厣":"厴","厦":"廈","厨":"廚","厩":"廄","厮":"廝","县":"縣","参":"參","双":"雙","发":"發","变":"變","叙":"敘","叠":"疊","台":"臺","叶":"葉","号":"號","叹":"嘆","叽":"嘰","吓":"嚇","吕":"呂","吗":"嗎","吨":"噸","听":"聽","启":"啟","吴":"吳","呐":"吶","呒":"嘸","呓":"囈","呕":"嘔","呖":"嚦","呗":"唄","员":"員","呙":"咼","呛":"嗆","呜":"嗚","咏":"詠","咙":"嚨","咛":"嚀","响":"響","哑":"啞","哒":"噠","哓":"嘵","哔":"嗶","哕":"噦","哗":"嘩","哙":"噲","哜":"嚌","哝":"噥","哟":"喲","唛":"嘜","唠":"嘮","唢":"嗩","唤":"喚","啧":"嘖","啬":"嗇","啭":"囀","啮":"嚙","啸":"嘯","喷":"噴","喽":"嘍","喾":"嚳","嗫":"囁","嗳":"噯","嘘":"噓","嘤":"嚶","嘱":"囑","噜":"嚕","嚣":"囂","团":"團","园":"園","囱":"囪","围":"圍","囵":"圇","国":"國","图":"圖","圆":"圓","圹":"壙","场":"場","坏":"壞","块":"塊","坚":"堅","坛":"壇","坜":"壢","坝":"壩","坞":"塢","坟":"墳","坠":"墜","垄":"壟","垆":"壚","垒":"壘","垦":"墾","垧":"坰","垩":"堊","垫":"墊","垭":"埡","垲":"塏","埘":"塒","埙":"塤","埚":"堝","堑":"塹","堕":"墮","墒":"墑","墙":"墻","壮":"壯","声":"聲","壳":"殼","壶":"壺","处":"處","备":"備","复":"復","够":"夠","头":"頭","夹":"夾","夺":"奪","奁":"奩","奂":"奐","奋":"奮","奖":"獎","奥":"奧","妆":"妝","妇":"婦","妈":"媽","妩":"嫵","妪":"嫗","妫":"媯","姗":"姍","娄":"婁","娅":"婭","娆":"嬈","娇":"嬌","娈":"孌","娱":"娛","娲":"媧","娴":"嫻","婴":"嬰","婵":"嬋","婶":"嬸","媪":"媼","嫒":"嬡","嫔":"嬪","嫱":"嬙","嬷":"嬤","孙":"孫","学":"學","孪":"孿","宁":"寧","宝":"寶","实":"實","宠":"寵","审":"審","宪":"憲","宫":"宮","宽":"寬","宾":"賓","寝":"寢","对":"對","寻":"尋","导":"導","寿":"壽","将":"將","尔":"爾","尘":"塵","尝":"嘗","尧":"堯","尴":"尷","尽":"盡","层":"層","屉":"屜","届":"屆","属":"屬","屡":"屢","屦":"屨","屿":"嶼","岁":"歲","岂":"豈","岖":"嶇","岗":"崗","岘":"峴","岚":"嵐","岛":"島","岩":"巖","岭":"嶺","岽":"崠","岿":"巋","峄":"嶧","峡":"峽","峤":"嶠","峥":"崢","峦":"巒","崂":"嶗","崃":"崍","崭":"嶄","嵘":"嶸","嵛":"崳","嵝":"嶁","巅":"巔","巩":"鞏","巯":"巰","币":"幣","帅":"帥","师":"師","帏":"幃","帐":"帳","帘":"簾","帜":"幟","带":"帶","帧":"幀","帮":"幫","帱":"幬","帻":"幘","帼":"幗","幂":"冪","广":"廣","庄":"莊","庆":"慶","庐":"廬","庑":"廡","库":"庫","应":"應","庙":"廟","庞":"龐","废":"廢","廪":"廩","开":"開","异":"異","弃":"棄","弑":"弒","张":"張","弥":"彌","弪":"弳","弯":"彎","弹":"彈","强":"強","归":"歸","当":"當","录":"錄","彦":"彥","彻":"徹","径":"徑","徕":"徠","忆":"憶","忏":"懺","忧":"憂","忾":"愾","怀":"懷","态":"態","怂":"慫","怃":"憮","怄":"慪","怅":"悵","怆":"愴","怜":"憐","总":"總","怼":"懟","怿":"懌","恋":"戀","恳":"懇","恶":"惡","恸":"慟","恹":"懨","恺":"愷","恻":"惻","恼":"惱","恽":"惲","悦":"悅","悫":"愨","悬":"懸","悭":"慳","悯":"憫","惊":"驚","惧":"懼","惨":"慘","惩":"懲","惫":"憊","惬":"愜","惭":"慚","惮":"憚","惯":"慣","愠":"慍","愤":"憤","愦":"憒","慑":"懾","懑":"懣","懒":"懶","戆":"戇","戋":"戔","戏":"戲","戗":"戧","战":"戰","戬":"戩","户":"戶","扑":"撲","扞":"捍","执":"執","扩":"擴","扪":"捫","扫":"掃","扬":"揚","扰":"擾","抚":"撫","抛":"拋","抟":"摶","抠":"摳","抡":"掄","抢":"搶","护":"護","报":"報","担":"擔","拟":"擬","拢":"攏","拣":"揀","拥":"擁","拦":"攔","拧":"擰","拨":"撥","择":"擇","挂":"掛","挚":"摯","挛":"攣","挝":"撾","挞":"撻","挟":"挾","挠":"撓","挡":"擋","挢":"撟","挣":"掙","挤":"擠","挥":"揮","捞":"撈","损":"損","捡":"撿","换":"換","捣":"搗","据":"據","掳":"擄","掴":"摑","掷":"擲","掸":"撣","掺":"摻","掼":"摜","揽":"攬","揿":"撳","搀":"攙","搁":"擱","搂":"摟","搅":"攪","携":"攜","摄":"攝","摅":"攄","摆":"擺","摇":"搖","摈":"擯","摊":"攤","撄":"攖","撑":"撐","撵":"攆","撷":"擷","撸":"擼","撺":"攛","擀":"搟","擞":"擻","攒":"攢","敌":"敵","敛":"斂","数":"數","斋":"齋","斓":"斕","斩":"斬","断":"斷","无":"無","旧":"舊","时":"時","旷":"曠","昙":"曇","昼":"晝","显":"顯","晋":"晉","晒":"曬","晓":"曉","晔":"曄","晕":"暈","晖":"暉","暂":"暫","暧":"曖","术":"術","朴":"樸","机":"機","杀":"殺","杂":"雜","权":"權","杆":"桿","条":"條","来":"來","杨":"楊","杩":"榪","极":"極","构":"構","枞":"樅","枢":"樞","枣":"棗","枥":"櫪","枨":"棖","枪":"槍","枫":"楓","枭":"梟","柠":"檸","柽":"檉","栀":"梔","栅":"柵","标":"標","栈":"棧","栉":"櫛","栊":"櫳","栋":"棟","栌":"櫨","栎":"櫟","栏":"欄","树":"樹","栖":"棲","样":"樣","栾":"欒","桠":"椏","桡":"橈","桢":"楨","档":"檔","桤":"榿","桥":"橋","桦":"樺","桧":"檜","桨":"槳","桩":"樁","梦":"夢","检":"檢","棂":"欞","椁":"槨","椟":"櫝","椠":"槧","椤":"欏","椭":"橢","楼":"樓","榄":"欖","榇":"櫬","榈":"櫚","榉":"櫸","槛":"檻","槟":"檳","槠":"櫧","横":"橫","樯":"檣","樱":"櫻","橱":"櫥","橹":"櫓","橼":"櫞","檩":"檁","欢":"歡","欤":"歟","欧":"歐","歼":"殲","殁":"歿","殇":"殤","残":"殘","殒":"殞","殓":"殮","殚":"殫","殡":"殯","殴":"毆","毁":"毀","毂":"轂","毕":"畢","毙":"斃","毡":"氈","毵":"毿","氇":"氌","气":"氣","氢":"氫","氩":"氬","氲":"氳","汇":"匯","汉":"漢","汤":"湯","汹":"洶","沟":"溝","没":"沒","沣":"灃","沤":"漚","沥":"瀝","沦":"淪","沧":"滄","沩":"溈","沪":"滬","泞":"濘","泪":"淚","泶":"澩","泷":"瀧","泸":"瀘","泺":"濼","泻":"瀉","泼":"潑","泽":"澤","泾":"涇","洁":"潔","洒":"灑","浃":"浹","浅":"淺","浆":"漿","浇":"澆","浈":"湞","浊":"濁","测":"測","浍":"澮","济":"濟","浏":"瀏","浑":"渾","浒":"滸","浓":"濃","浔":"潯","涛":"濤","涝":"澇","涞":"淶","涟":"漣","涠":"潿","涡":"渦","涣":"渙","涤":"滌","润":"潤","涧":"澗","涨":"漲","涩":"澀","渊":"淵","渌":"淥","渍":"漬","渎":"瀆","渐":"漸","渑":"澠","渔":"漁","渖":"瀋","渗":"滲","温":"溫","湾":"灣","湿":"濕","溃":"潰","溅":"濺","滗":"潷","滚":"滾","滞":"滯","滠":"灄","满":"滿","滢":"瀅","滤":"濾","滥":"濫","滦":"灤","滨":"濱","滩":"灘","潆":"瀠","潇":"瀟","潋":"瀲","潍":"濰","潜":"潛","澜":"瀾","濑":"瀨","濒":"瀕","灏":"灝","灭":"滅","灯":"燈","灵":"靈","灾":"災","灿":"燦","炀":"煬","炉":"爐","炖":"燉","炜":"煒","炝":"熗","点":"點","炼":"煉","炽":"熾","烁":"爍","烂":"爛","烃":"烴","烛":"燭","烟":"煙","烦":"煩","烧":"燒","烨":"燁","烩":"燴","烫":"燙","烬":"燼","热":"熱","焕":"煥","焖":"燜","焘":"燾","爱":"愛","爷":"爺","牍":"牘","牵":"牽","牺":"犧","犊":"犢","状":"狀","犷":"獷","犹":"猶","狈":"狽","狞":"獰","独":"獨","狭":"狹","狮":"獅","狯":"獪","狰":"猙","狱":"獄","狲":"猻","狸":"貍","猃":"獫","猎":"獵","猕":"獼","猡":"玀","猪":"豬","猫":"貓","献":"獻","獭":"獺","玑":"璣","玛":"瑪","玮":"瑋","环":"環","现":"現","玺":"璽","珏":"玨","珐":"琺","珑":"瓏","珲":"琿","琅":"瑯","琏":"璉","琐":"瑣","琼":"瓊","瑶":"瑤","瑷":"璦","璎":"瓔","瓒":"瓚","瓮":"甕","瓯":"甌","电":"電","画":"畫","畅":"暢","畲":"畬","畴":"疇","疖":"癤","疗":"療","疟":"瘧","疠":"癘","疡":"瘍","疮":"瘡","疯":"瘋","疱":"皰","症":"癥","痈":"癰","痉":"痙","痒":"癢","痨":"癆","痪":"瘓","痫":"癇","痴":"癡","瘅":"癉","瘗":"瘞","瘘":"瘺","瘪":"癟","瘫":"癱","瘾":"癮","瘿":"癭","癞":"癩","癣":"癬","癫":"癲","皑":"皚","皱":"皺","皲":"皸","盏":"盞","盐":"鹽","监":"監","盖":"蓋","盗":"盜","盘":"盤","眦":"眥","眯":"瞇","着":"著","睁":"睜","睃":"脧","睐":"睞","睑":"瞼","睾":"睪","瞒":"瞞","瞩":"矚","矫":"矯","矶":"磯","矾":"礬","矿":"礦","砀":"碭","码":"碼","砖":"磚","砗":"硨","砚":"硯","砺":"礪","砻":"礱","砾":"礫","础":"礎","硕":"碩","硖":"硤","硗":"磽","确":"確","硷":"鹼","碍":"礙","碛":"磧","碜":"磣","碱":"堿","礼":"禮","祢":"禰","祯":"禎","祷":"禱","祸":"禍","禀":"稟","禄":"祿","禅":"禪","离":"離","秃":"禿","秆":"稈","种":"種","积":"積","称":"稱","秽":"穢","税":"稅","稣":"穌","稳":"穩","穑":"穡","穷":"窮","窃":"竊","窍":"竅","窑":"窯","窜":"竄","窝":"窩","窥":"窺","窦":"竇","窭":"窶","竖":"豎","竞":"競","笃":"篤","笋":"筍","笔":"筆","笕":"筧","笺":"箋","笼":"籠","笾":"籩","筚":"篳","筛":"篩","筝":"箏","筹":"籌","签":"簽","简":"簡","箦":"簀","箧":"篋","箨":"籜","箩":"籮","箪":"簞","箫":"簫","篑":"簣","篓":"簍","篮":"籃","篱":"籬","簖":"籪","籁":"籟","籴":"糴","类":"類","籼":"秈","粜":"糶","粝":"糲","粤":"粵","粪":"糞","粮":"糧","糁":"糝","紧":"緊","絷":"縶","纠":"糾","纡":"紆","红":"紅","纣":"紂","纤":"纖","纥":"紇","约":"約","级":"級","纨":"紈","纩":"纊","纪":"紀","纫":"紉","纬":"緯","纭":"紜","纯":"純","纰":"紕","纱":"紗","纲":"綱","纳":"納","纵":"縱","纶":"綸","纷":"紛","纸":"紙","纹":"紋","纺":"紡","纽":"紐","纾":"紓","线":"線","绀":"紺","绁":"紲","绂":"紱","练":"練","组":"組","绅":"紳","细":"細","织":"織","终":"終","绉":"縐","绊":"絆","绋":"紼","绌":"絀","绍":"紹","绎":"繹","经":"經","绐":"紿","绑":"綁","绒":"絨","结":"結","绕":"繞","绗":"絎","绘":"繪","给":"給","绚":"絢","绛":"絳","络":"絡","绝":"絕","绞":"絞","统":"統","绠":"綆","绡":"綃","绢":"絹","绣":"繡","绥":"綏","绦":"絳","继":"繼","绨":"綈","绩":"績","绪":"緒","绫":"綾","续":"續","绮":"綺","绯":"緋","绰":"綽","绲":"緄","绳":"繩","维":"維","绵":"綿","绶":"綬","绷":"繃","绸":"綢","绺":"綹","绻":"綣","综":"綜","绽":"綻","绾":"綰","绿":"綠","缀":"綴","缁":"緇","缂":"緙","缃":"緗","缄":"緘","缅":"緬","缆":"纜","缇":"緹","缈":"緲","缉":"緝","缋":"繢","缌":"緦","缍":"綞","缎":"緞","缏":"緶","缑":"緱","缒":"縋","缓":"緩","缔":"締","缕":"縷","编":"編","缗":"緡","缘":"緣","缙":"縉","缚":"縛","缛":"縟","缜":"縝","缝":"縫","缟":"縞","缠":"纏","缡":"縭","缢":"縊","缣":"縑","缤":"繽","缥":"縹","缦":"縵","缧":"縲","缨":"纓","缩":"縮","缪":"繆","缫":"繅","缬":"纈","缭":"繚","缮":"繕","缯":"繒","缰":"韁","缱":"繾","缲":"繰","缳":"繯","缴":"繳","缵":"纘","罂":"罌","网":"網","罗":"羅","罚":"罰","罢":"罷","罴":"羆","羁":"羈","羟":"羥","羡":"羨","翘":"翹","耧":"耬","耸":"聳","耻":"恥","聂":"聶","聋":"聾","职":"職","聍":"聹","联":"聯","聩":"聵","聪":"聰","肃":"肅","肠":"腸","肤":"膚","肮":"骯","肾":"腎","肿":"腫","胀":"脹","胁":"脅","胆":"膽","胜":"勝","胧":"朧","胪":"臚","胫":"脛","胶":"膠","脉":"脈","脍":"膾","脏":"臟","脐":"臍","脑":"腦","脓":"膿","脔":"臠","脚":"腳","脱":"脫","脶":"腡","脸":"臉","腊":"臘","腻":"膩","腼":"靦","腽":"膃","腾":"騰","膑":"臏","舆":"輿","舣":"艤","舰":"艦","舱":"艙","舻":"艫","艰":"艱","艳":"艷","艹":"艸","艺":"藝","节":"節","芈":"羋","芗":"薌","芜":"蕪","芦":"蘆","芸":"蕓","苁":"蓯","苄":"芐","苇":"葦","苈":"藶","苋":"莧","苌":"萇","苍":"蒼","苎":"苧","苏":"蘇","苟":"茍","苹":"蘋","茎":"莖","茏":"蘢","茑":"蔦","茔":"塋","茕":"煢","茧":"繭","荆":"荊","荐":"薦","荚":"莢","荛":"蕘","荜":"蓽","荞":"蕎","荟":"薈","荠":"薺","荡":"蕩","荣":"榮","荤":"葷","荥":"滎","荦":"犖","荧":"熒","荨":"蕁","荩":"藎","荪":"蓀","荫":"蔭","荭":"葒","药":"藥","莅":"蒞","莱":"萊","莲":"蓮","莳":"蒔","莴":"萵","莶":"薟","获":"獲","莸":"蕕","莹":"瑩","莺":"鶯","萝":"蘿","萤":"螢","营":"營","萦":"縈","萧":"蕭","萨":"薩","葱":"蔥","蒇":"蕆","蒉":"蕢","蒋":"蔣","蒌":"蔞","蓝":"藍","蓟":"薊","蓠":"蘺","蓣":"蕷","蓥":"鎣","蓦":"驀","蔷":"薔","蔹":"蘞","蔺":"藺","蔼":"藹","蕲":"蘄","蕴":"蘊","薮":"藪","藓":"蘚","蘖":"蘗","虏":"虜","虑":"慮","虚":"虛","虫":"蟲","虮":"蟣","虽":"雖","虾":"蝦","虿":"蠆","蚀":"蝕","蚁":"蟻","蚂":"螞","蚕":"蠶","蚝":"蠔","蚬":"蜆","蛊":"蠱","蛎":"蠣","蛏":"蟶","蛮":"蠻","蛰":"蟄","蛱":"蛺","蛲":"蟯","蛳":"螄","蛴":"蠐","蜕":"蛻","蜗":"蝸","蜡":"蠟","蝇":"蠅","蝈":"蟈","蝉":"蟬","蝼":"螻","蝾":"蠑","衅":"釁","衔":"銜","补":"補","衬":"襯","衮":"袞","袄":"襖","袅":"裊","袜":"襪","袭":"襲","装":"裝","裆":"襠","裢":"褳","裣":"襝","裤":"褲","褛":"褸","褴":"襤","见":"見","观":"觀","规":"規","觅":"覓","视":"視","觇":"覘","览":"覽","觉":"覺","觊":"覬","觋":"覡","觌":"覿","觎":"覦","觏":"覯","觐":"覲","觑":"覷","觞":"觴","触":"觸","觯":"觶","誉":"譽","誊":"謄","计":"計","订":"訂","讣":"訃","认":"認","讥":"譏","讦":"訐","讧":"訌","讨":"討","让":"讓","讪":"訕","讫":"訖","训":"訓","议":"議","讯":"訊","记":"記","讲":"講","讳":"諱","讴":"謳","讵":"詎","讶":"訝","讷":"訥","许":"許","讹":"訛","论":"論","讼":"訟","讽":"諷","设":"設","访":"訪","诀":"訣","证":"證","诂":"詁","诃":"訶","评":"評","诅":"詛","识":"識","诈":"詐","诉":"訴","诊":"診","诋":"詆","诌":"謅","词":"詞","诎":"詘","诏":"詔","译":"譯","诒":"詒","诓":"誆","诔":"誄","试":"試","诖":"詿","诗":"詩","诘":"詰","诙":"詼","诚":"誠","诛":"誅","诜":"詵","话":"話","诞":"誕","诟":"詬","诠":"詮","诡":"詭","询":"詢","诣":"詣","诤":"諍","该":"該","详":"詳","诧":"詫","诨":"諢","诩":"詡","诫":"誡","诬":"誣","语":"語","诮":"誚","误":"誤","诰":"誥","诱":"誘","诲":"誨","诳":"誑","说":"說","诵":"誦","诶":"誒","请":"請","诸":"諸","诹":"諏","诺":"諾","读":"讀","诼":"諑","诽":"誹","课":"課","诿":"諉","谀":"諛","谁":"誰","谂":"諗","调":"調","谄":"諂","谅":"諒","谆":"諄","谇":"誶","谈":"談","谊":"誼","谋":"謀","谌":"諶","谍":"諜","谎":"謊","谏":"諫","谐":"諧","谑":"謔","谒":"謁","谓":"謂","谔":"諤","谕":"諭","谖":"諼","谗":"讒","谘":"諮","谙":"諳","谚":"諺","谛":"諦","谜":"謎","谝":"諞","谟":"謨","谠":"讜","谡":"謖","谢":"謝","谣":"謠","谤":"謗","谥":"謚","谦":"謙","谧":"謐","谨":"謹","谩":"謾","谪":"謫","谬":"謬","谭":"譚","谮":"譖","谯":"譙","谰":"讕","谱":"譜","谲":"譎","谳":"讞","谴":"譴","谵":"譫","谶":"讖","贝":"貝","贞":"貞","负":"負","贡":"貢","财":"財","责":"責","贤":"賢","败":"敗","账":"賬","货":"貨","质":"質","贩":"販","贪":"貪","贫":"貧","贬":"貶","购":"購","贮":"貯","贯":"貫","贰":"貳","贱":"賤","贲":"賁","贳":"貰","贴":"貼","贵":"貴","贶":"貺","贷":"貸","贸":"貿","费":"費","贺":"賀","贻":"貽","贼":"賊","贽":"贄","贾":"賈","贿":"賄","赀":"貲","赁":"賃","赂":"賂","赃":"贓","资":"資","赅":"賅","赆":"贐","赇":"賕","赈":"賑","赉":"賚","赊":"賒","赋":"賦","赌":"賭","赎":"贖","赏":"賞","赐":"賜","赓":"賡","赔":"賠","赕":"賧","赖":"賴","赘":"贅","赙":"賻","赚":"賺","赛":"賽","赜":"賾","赝":"贗","赞":"贊","赠":"贈","赡":"贍","赢":"贏","赣":"贛","赵":"趙","赶":"趕","趋":"趨","趱":"趲","趸":"躉","跃":"躍","跄":"蹌","跞":"躒","践":"踐","跷":"蹺","跸":"蹕","跹":"躚","跻":"躋","踊":"踴","踌":"躊","踪":"蹤","踬":"躓","踯":"躑","蹑":"躡","蹒":"蹣","蹰":"躕","蹿":"躥","躏":"躪","躜":"躦","躯":"軀","车":"車","轧":"軋","轨":"軌","轩":"軒","轫":"軔","转":"轉","轭":"軛","轮":"輪","软":"軟","轰":"轟","轲":"軻","轳":"轤","轴":"軸","轵":"軹","轶":"軼","轸":"軫","轹":"轢","轺":"軺","轻":"輕","轼":"軾","载":"載","轾":"輊","轿":"轎","辁":"輇","辂":"輅","较":"較","辄":"輒","辅":"輔","辆":"輛","辇":"輦","辈":"輩","辉":"輝","辊":"輥","辋":"輞","辍":"輟","辎":"輜","辏":"輳","辐":"輻","辑":"輯","输":"輸","辔":"轡","辕":"轅","辖":"轄","辗":"輾","辘":"轆","辙":"轍","辚":"轔","辞":"辭","辩":"辯","辫":"辮","边":"邊","辽":"遼","达":"達","迁":"遷","过":"過","迈":"邁","运":"運","还":"還","这":"這","进":"進","远":"遠","违":"違","连":"連","迟":"遲","迩":"邇","迳":"逕","迹":"跡","适":"適","选":"選","逊":"遜","递":"遞","逦":"邐","逻":"邏","遗":"遺","遥":"遙","邓":"鄧","邝":"鄺","邬":"鄔","邮":"郵","邹":"鄒","邺":"鄴","邻":"鄰","郏":"郟","郐":"鄶","郑":"鄭","郓":"鄆","郦":"酈","郧":"鄖","郸":"鄲","酝":"醞","酱":"醬","酽":"釅","酾":"釃","酿":"釀","释":"釋","鉴":"鑒","銮":"鑾","錾":"鏨","钆":"釓","钇":"釔","针":"針","钉":"釘","钊":"釗","钋":"釙","钌":"釕","钍":"釷","钎":"釬","钏":"釧","钐":"釤","钒":"釩","钓":"釣","钔":"鍆","钕":"釹","钗":"釵","钙":"鈣","钛":"鈦","钜":"鉅","钝":"鈍","钞":"鈔","钟":"鐘","钠":"鈉","钡":"鋇","钢":"鋼","钣":"鈑","钤":"鈐","钥":"鑰","钦":"欽","钧":"鈞","钨":"鎢","钩":"鉤","钪":"鈧","钫":"鈁","钬":"鈥","钭":"鈄","钮":"鈕","钯":"鈀","钰":"鈺","钱":"錢","钲":"鉦","钳":"鉗","钴":"鈷","钵":"缽","钶":"鈳","钸":"鈽","钹":"鈸","钺":"鉞","钻":"鉆","钼":"鉬","钽":"鉭","钾":"鉀","钿":"鈿","铀":"鈾","铁":"鐵","铂":"鉑","铃":"鈴","铄":"鑠","铅":"鉛","铆":"鉚","铈":"鈰","铉":"鉉","铊":"鉈","铋":"鉍","铌":"鈮","铍":"鈹","铎":"鐸","铐":"銬","铑":"銠","铒":"鉺","铕":"銪","铖":"鋮","铗":"鋏","铙":"鐃","铛":"鐺","铜":"銅","铝":"鋁","铟":"銦","铠":"鎧","铡":"鍘","铢":"銖","铣":"銑","铤":"鋌","铥":"銩","铧":"鏵","铨":"銓","铩":"鎩","铪":"鉿","铫":"銚","铬":"鉻","铭":"銘","铮":"錚","铯":"銫","铰":"鉸","铱":"銥","铲":"鏟","铳":"銃","铴":"鐋","铵":"銨","银":"銀","铷":"銣","铸":"鑄","铹":"鐒","铺":"鋪","铼":"錸","铽":"鋱","链":"鏈","铿":"鏗","销":"銷","锁":"鎖","锂":"鋰","锄":"鋤","锅":"鍋","锆":"鋯","锇":"鋨","锈":"銹","锉":"銼","锊":"鋝","锋":"鋒","锌":"鋅","锐":"銳","锑":"銻","锒":"鋃","锓":"鋟","锔":"鋦","锕":"錒","锖":"錆","锗":"鍺","错":"錯","锚":"錨","锛":"錛","锞":"錁","锟":"錕","锡":"錫","锢":"錮","锣":"鑼","锤":"錘","锥":"錐","锦":"錦","锩":"錈","锬":"錟","锭":"錠","键":"鍵","锯":"鋸","锰":"錳","锱":"錙","锲":"鍥","锴":"鍇","锵":"鏘","锶":"鍶","锷":"鍔","锸":"鍤","锹":"鍬","锺":"鍾","锻":"鍛","锼":"鎪","锾":"鍰","镀":"鍍","镁":"鎂","镂":"鏤","镄":"鐨","镆":"鏌","镇":"鎮","镉":"鎘","镊":"鑷","镌":"鐫","镍":"鎳","镏":"鎦","镐":"鎬","镑":"鎊","镒":"鎰","镓":"鎵","镔":"鑌","镖":"鏢","镗":"鏜","镘":"鏝","镙":"鏍","镛":"鏞","镜":"鏡","镝":"鏑","镞":"鏃","镟":"鏇","镡":"鐔","镣":"鐐","镤":"鏷","镦":"鐓","镧":"鑭","镨":"鐠","镪":"鏹","镫":"鐙","镬":"鑊","镭":"鐳","镯":"鐲","镰":"鐮","镱":"鐿","镳":"鑣","镶":"鑲","长":"長","门":"門","闩":"閂","闪":"閃","闫":"閆","闭":"閉","问":"問","闯":"闖","闰":"閏","闱":"闈","闲":"閑","闳":"閎","间":"間","闵":"閔","闶":"閌","闷":"悶","闸":"閘","闹":"鬧","闺":"閨","闻":"聞","闼":"闥","闽":"閩","闾":"閭","阀":"閥","阁":"閣","阂":"閡","阃":"閫","阄":"鬮","阅":"閱","阆":"閬","阈":"閾","阉":"閹","阊":"閶","阋":"鬩","阌":"閿","阍":"閽","阎":"閻","阏":"閼","阐":"闡","阑":"闌","阒":"闃","阔":"闊","阕":"闋","阖":"闔","阗":"闐","阙":"闕","阚":"闞","队":"隊","阳":"陽","阴":"陰","阵":"陣","阶":"階","际":"際","陆":"陸","陇":"隴","陈":"陳","陉":"陘","陕":"陜","陧":"隉","陨":"隕","险":"險","随":"隨","隐":"隱","隶":"隸","隽":"雋","难":"難","雏":"雛","雠":"讎","雳":"靂","雾":"霧","霁":"霽","霭":"靄","靓":"靚","静":"靜","靥":"靨","鞑":"韃","鞯":"韉","韦":"韋","韧":"韌","韩":"韓","韪":"韙","韫":"韞","韬":"韜","韵":"韻","页":"頁","顶":"頂","顷":"頃","顸":"頇","项":"項","顺":"順","须":"須","顼":"頊","顽":"頑","顾":"顧","顿":"頓","颀":"頎","颁":"頒","颂":"頌","颃":"頏","预":"預","颅":"顱","领":"領","颇":"頗","颈":"頸","颉":"頡","颊":"頰","颌":"頜","颍":"潁","颏":"頦","颐":"頤","频":"頻","颓":"頹","颔":"頷","颖":"穎","颗":"顆","题":"題","颚":"顎","颛":"顓","颜":"顏","额":"額","颞":"顳","颟":"顢","颠":"顛","颡":"顙","颢":"顥","颤":"顫","颦":"顰","颧":"顴","风":"風","飑":"颮","飒":"颯","飓":"颶","飕":"颼","飘":"飄","飙":"飆","飞":"飛","飨":"饗","餍":"饜","饥":"饑","饧":"餳","饨":"飩","饩":"餼","饪":"飪","饫":"飫","饬":"飭","饭":"飯","饮":"飲","饯":"餞","饰":"飾","饱":"飽","饲":"飼","饴":"飴","饵":"餌","饶":"饒","饷":"餉","饺":"餃","饼":"餅","饽":"餑","饿":"餓","馁":"餒","馄":"餛","馅":"餡","馆":"館","馈":"饋","馊":"餿","馋":"饞","馍":"饃","馏":"餾","馐":"饈","馑":"饉","馒":"饅","馔":"饌","马":"馬","驭":"馭","驮":"馱","驯":"馴","驰":"馳","驱":"驅","驳":"駁","驴":"驢","驵":"駔","驶":"駛","驷":"駟","驸":"駙","驹":"駒","驺":"騶","驻":"駐","驼":"駝","驽":"駑","驾":"駕","驿":"驛","骀":"駘","骁":"驍","骂":"罵","骄":"驕","骅":"驊","骆":"駱","骇":"駭","骈":"駢","骊":"驪","骋":"騁","验":"驗","骏":"駿","骐":"騏","骑":"騎","骒":"騍","骓":"騅","骖":"驂","骗":"騙","骘":"騭","骚":"騷","骛":"騖","骜":"驁","骝":"騮","骞":"騫","骟":"騸","骠":"驃","骡":"騾","骢":"驄","骣":"驏","骤":"驟","骥":"驥","骧":"驤","髅":"髏","髋":"髖","髌":"髕","鬓":"鬢","魇":"魘","魉":"魎","鱼":"魚","鱿":"魷","鲁":"魯","鲂":"魴","鲈":"鱸","鲋":"鮒","鲍":"鮑","鲎":"鱟","鲐":"鮐","鲑":"鮭","鲒":"鮚","鲔":"鮪","鲕":"鮞","鲚":"鱭","鲛":"鮫","鲜":"鮮","鲟":"鱘","鲠":"鯁","鲡":"鱺","鲢":"鰱","鲣":"鰹","鲤":"鯉","鲥":"鰣","鲦":"鰷","鲧":"鯀","鲨":"鯊","鲩":"鯇","鲫":"鯽","鲭":"鯖","鲮":"鯪","鲰":"鯫","鲱":"鯡","鲲":"鯤","鲳":"鯧","鲵":"鯢","鲶":"鯰","鲷":"鯛","鲸":"鯨","鲻":"鯔","鲽":"鰈","鳃":"鰓","鳄":"鱷","鳅":"鰍","鳆":"鰒","鳇":"鰉","鳌":"鰲","鳍":"鰭","鳎":"鰨","鳏":"鰥","鳐":"鰩","鳓":"鰳","鳔":"鰾","鳕":"鱈","鳖":"鱉","鳗":"鰻","鳜":"鱖","鳝":"鱔","鳞":"鱗","鳟":"鱒","鳢":"鱧","鸟":"鳥","鸠":"鳩","鸡":"雞","鸢":"鳶","鸣":"鳴","鸥":"鷗","鸦":"鴉","鸨":"鴇","鸩":"鴆","鸪":"鴣","鸫":"鶇","鸬":"鸕","鸭":"鴨","鸯":"鴦","鸱":"鴟","鸲":"鴝","鸳":"鴛","鸵":"鴕","鸶":"鷥","鸷":"鷙","鸸":"鴯","鸹":"鴰","鸺":"鵂","鸽":"鴿","鸾":"鸞","鸿":"鴻","鹁":"鵓","鹂":"鸝","鹃":"鵑","鹄":"鵠","鹅":"鵝","鹆":"鵒","鹇":"鷴","鹈":"鵜","鹉":"鵡","鹊":"鵲","鹌":"鵪","鹎":"鵯","鹏":"鵬","鹑":"鶉","鹕":"鶘","鹗":"鶚","鹘":"鶻","鹚":"鶿","鹜":"鶩","鹞":"鷂","鹣":"鶼","鹤":"鶴","鹦":"鸚","鹧":"鷓","鹨":"鷚","鹩":"鷯","鹪":"鷦","鹫":"鷲","鹬":"鷸","鹭":"鷺","鹰":"鷹","鹳":"鸛","鹾":"鹺","麦":"麥","麸":"麩","麽":"麼","黄":"黃","黉":"黌","黩":"黷","黪":"黲","黾":"黽","鼋":"黿","鼍":"鼉","鼹":"鼴","齐":"齊","齑":"齏","齿":"齒","龀":"齔","龃":"齟","龄":"齡","龅":"齙","龆":"齠","龇":"齜","龈":"齦","龉":"齬","龊":"齪","龋":"齲","龌":"齷","龙":"龍","龚":"龔","龛":"龕","龟":"龜"};
Object.assign(traditional,{'后':'後','并':'並','范':'範','里':'裡'});
Object.assign(dictionary,{'读取摄像头画面失败：':'Camera frame error: ','识别失败：':'Tracking failed: ','启动失败：':'Startup failed: ','无法播放：':'Playback failed: ','MIDI 发送失败：':'MIDI send failed: ','未连接：':'Not connected: ','已连接 ':'Connected: '});
Object.assign(dictionary,{'切换回视频模式会自动关闭摄像头。': 'Switching to video mode turns the camera off.', '使用说明': 'Usage', '网页的“活跃度”表示变化像素占比，不代表真实物理速度或冲击力。主撞击每轮最多触发一次。玻璃碎裂视频默认使用大碎片跟踪，分析全画面并排除边缘水印。透明、重叠或反光消失时可能丢失或更换编号；虚线框表示暂时丢失，此时不触发新音符。循环或拖动进度会重置检测历史。单帧最多触发 3 个旋律音。轨迹速度以画面宽度/秒估算。': 'Activity measures changing pixels, not physical force or speed. The impact accent fires once per video loop. The glass video uses Large fragments tracking across the full frame, excluding edge watermarks. Transparent, overlapping or fading reflections may lose or change track IDs. Dashed boxes indicate lost tracks and do not trigger notes. Looping or seeking resets tracking. Up to three melody notes play per frame. Speed is measured relative to image width.'});
Object.assign(dictionary,{"跟随碎片与烟花光点，让每个目标的位置与速度驱动声音。": "Follow glass fragments and firework sparks. Position and speed become sound.", "视频素材": "Video samples", "01 玻璃碎裂": "01 Glass fragments", "02 烟花光点": "02 Firework sparks", "素材2 · 烟花光点": "Sample 2 · Firework sparks", "白色闪烁 = 此目标正在发声": "White flash = this target is sounding", "等待可分离的烟花光点…": "Waiting for distinct firework sparks…", "光点运动中": "Sparks moving", "● 烟花爆发": "● Firework burst", "烟花爆发": "Firework bursts", "爆发重音": "Burst accent", "最小光点像素数": "Minimum spark pixels", "已恢复烟花光点预设": "Firework preset restored", "运动亮点 + 光尾前端定位": "Moving bright points + spark head localization", "亮轮廓连接 + 尺寸过滤 · 优先保留较大碎片": "Bright contours + size filtering · Prioritize larger fragments", "逐帧提取明亮且运动的烟花光点，优先定位光尾前方的新亮点，过滤静态文字与大面积爆发中心。跨帧预测位置保持编号；高度控制音高，速度控制力度，左右控制声像。光点发声时圆环闪白。": "Detect bright moving sparks frame by frame, favoring newly illuminated spark heads over fading tails. Filter static lettering and merged burst cores. Position prediction preserves IDs. Height sets pitch, speed sets velocity, and horizontal position sets pan. Rings flash white when notes play.", "网页的“活跃度”表示变化像素占比，不代表真实物理速度或冲击力。主撞击每轮最多触发一次。切换视频素材时自动使用对应的跟踪预设：玻璃跟踪大碎片，烟花跟踪运动光点，篮球视频跟踪球体并默认使用号音色。玻璃保留一次主撞击；烟花在明显爆发时触发重音。透明、重叠或反光消失时可能丢失或更换编号；虚线框表示暂时丢失，此时不触发新音符。循环或拖动进度会重置检测历史。单帧最多触发 3 个旋律音。轨迹速度以画面宽度/秒估算。": "Activity measures changing pixels, not physical force. Each sample automatically uses its own preset: large fragments for glass, moving sparks for fireworks, and the ball with Horn audio for basketball. Glass has one main impact per loop; fireworks trigger accents on distinct bursts. Overlapping or fading targets may lose or change IDs. Dashed markers indicate lost targets and do not trigger new notes. Looping or seeking resets tracking. Up to three melody notes play per frame. Speed is relative to image width."});
Object.assign(dictionary,{"跟随碎片、烟花与篮球，让每个目标的位置与速度驱动声音。": "Follow fragments, firework sparks and the basketball. Position and speed become sound.", "03 篮球跟踪": "03 Basketball", "素材3 · 篮球": "Sample 3 · Basketball", "等待篮球进入画面…": "Waiting for the basketball…", "橙色匹配阈值": "Orange color threshold", "最小篮球像素数": "Minimum ball pixels", "运动重音": "Motion accent", "● 运动重音": "● Motion accent", "篮球运动中": "Basketball moving", "已恢复篮球预设 · 号音色": "Basketball preset restored · Horn", "橙色球体 + 圆形轮廓 + 运动匹配": "Orange ball + circular shape + motion matching", "结合篮球的橙色、圆形轮廓和连续运动定位球体，并针对片段的镜头变化校准搜索位置。篮球的高度、速度与左右位置驱动号音色；发声时球体圆环闪白。篮球离开画面或无法确认时停止触发。": "Locate the basketball using orange color, circular shape and continuous motion, with search positions calibrated to this clip's camera shots. Height, speed and horizontal position drive the Horn preset. The ball marker flashes white when notes play. No new notes are triggered when the ball leaves the frame or cannot be confirmed."});
Object.assign(dictionary,{"竖琴": "Harp", "04 海浪浪花": "04 Ocean foam", "素材4 · 海浪浪花": "Sample 4 · Ocean foam", "等待运动的浪花团块…": "Waiting for moving foam patches…", "浪花运动中": "Foam moving", "浪花亮度阈值": "Foam brightness threshold", "最小运动浪花像素数": "Minimum moving foam pixels", "已恢复海浪预设 · 竖琴音色": "Ocean preset restored · Harp", "运动白色浪花 + 局部团块分离": "Moving white foam + separated local patches", "跟随碎片、烟花、篮球与浪花，让运动成为声音。": "Follow fragments, sparks, basketball and foam. Turn motion into sound.", "跟踪局部明亮且运动的浪花团块，默认同时选择16个，最多24个。高度、速度和左右位置驱动声音；每秒最多18个音符，轮流让不同团块发声，避免持续堆叠。浪花分裂或消散后编号可能更换。": "Track local bright moving foam patches: 16 by default, up to 24. Height, speed and horizontal position drive sound. Up to 18 notes per second, with turns shared across patches. Splitting or fading foam may change IDs."});
let locale='en';try{locale=localStorage.getItem('motionScoreLanguage')||'en';}catch{}if(!['en','zh-CN','zh-TW'].includes(locale))locale='en';
const records=new WeakMap(),attributes=new WeakMap(),keys=Object.keys(dictionary).sort((a,b)=>b.length-a.length);
function translate(source){if(locale==='zh-CN')return source;if(locale==='zh-TW')return source.replace(/[\u4e00-\u9fff]/g,c=>traditional[c]||c);
 const trimmed=source.trim();if(dictionary[trimmed])return source.replace(trimmed,dictionary[trimmed]);
 let result=source;for(const key of keys)if(result.includes(key))result=result.split(key).join(dictionary[key]);
 return result.replace(/手\s*(\d+)/g,'Hand $1').replace(/摄像头\s*(\d+)/g,'Camera $1').replace(/速度\s*/g,'Speed ').replace(/%画?宽\/s/g,'% width/s').replace(/(\d+)\s*个/g,'$1').replace(/读取摄像头画面失败：/g,'Camera frame error: ').replace(/识别失败：/g,'Tracking failed: ').replace(/启动失败：/g,'Startup failed: ').replace(/无法播放：/g,'Playback failed: ').replace(/MIDI 发送失败：/g,'MIDI send failed: ').replace(/未连接：/g,'Not connected: ').replace(/已连接\s*/g,'Connected: ').replace(/ · 通道 1 音符 \/ 通道 10 撞击 \/ CC 20、21/g,' · Notes ch 1 / impact ch 10 / CC20,21');
}
function apply(root=document.body){
 const nodes=[];if(root.nodeType===3)nodes.push(root);else{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode())nodes.push(walker.currentNode);}
 for(const node of nodes){if(!node.parentElement||node.parentElement.closest('script,style,[data-no-i18n],#cameraDeviceName'))continue;const old=records.get(node),source=old&&node.nodeValue===old.rendered?old.source:node.nodeValue;const rendered=translate(source);records.set(node,{source,rendered});if(node.nodeValue!==rendered)node.nodeValue=rendered;}
 const elements=root.nodeType===1?[root,...root.querySelectorAll('[title],[aria-label]')]:[];
 for(const el of elements){if(el.closest('[data-no-i18n]'))continue;const old=attributes.get(el)||{};for(const key of ['title','aria-label']){const value=el.getAttribute(key);if(value===null)continue;const src=old[key]&&value===old[key].rendered?old[key].source:value,rendered=translate(src);old[key]={source:src,rendered};if(value!==rendered)el.setAttribute(key,rendered);}attributes.set(el,old);}
}
const observer=new MutationObserver(changes=>{for(const change of changes){if(change.type==='characterData')apply(change.target);else if(change.type==='childList')for(const node of change.addedNodes)apply(node);}});
window.i18n={text:translate,get locale(){return locale;},setLanguage(value){if(!['en','zh-CN','zh-TW'].includes(value))return;locale=value;try{localStorage.setItem('motionScoreLanguage',locale);}catch{}document.documentElement.lang=locale;document.title=translate('动势谱 · 视频声音实验室');apply();document.dispatchEvent(new Event('languagechange'));}};
document.documentElement.lang=locale;document.title=translate('动势谱 · 视频声音实验室');apply();observer.observe(document.body,{childList:true,subtree:true,characterData:true});
const select=document.getElementById('languageSelect');select.value=locale;select.onchange=()=>window.i18n.setLanguage(select.value);
})();
