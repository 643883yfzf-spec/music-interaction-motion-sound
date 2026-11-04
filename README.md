# 动势谱 / Motion Score

四视频声音交互与摄像头指尖演奏原型。

## 在线部署

仓库名建议：music-interaction-motion-sound。
代码上传至 main 后，在 Settings → Pages → Build and deployment → Source 中选择 GitHub Actions。
然后在 Actions 中运行 Deploy GitHub Pages；成功后，Pages 和运行记录会显示在线网址。
工作流发布 dist 目录，不需要 Node.js 或 npm 构建。

## 本地预览

安装 Python 3 后运行：python serve.py，然后访问 http://localhost:8765。

## 文件

- dist/：网站 HTML、CSS、JavaScript、四段视频、音色及本地手部识别模型。
- serve.py：本地静态服务器。
- .github/workflows/pages.yml：GitHub Pages 自动部署。

摄像头需要 HTTPS 或 localhost，并由访客在浏览器允许权限。音频需要点击开始按钮。
原包未包含 package.json 或单独的 src 工程，本仓库保留原包提供的应用代码。
第三方许可见 dist/vendor/mediapipe/LICENSE.txt；发布者需具有所用视频及音色素材的发布权。
