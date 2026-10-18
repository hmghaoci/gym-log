# 健身记录

离线安卓应用：选动作、记重量和次数、组间休息、查看历史。

动作名称、部位、中文步骤和动作 GIF 来自 [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)。动画媒体 © [Gym visual](https://gymvisual.com/)，联网后按需加载。记录只存在手机本地。

支持上次成绩自动带入、训练模板、训练中删组/删动作、历史删除。远程更新读取本仓库的 `release/latest.json`；版本更高且带有 `url` 与 `checksum` 时下载网页更新包，不用重装。

```bash
npm install
npx cap add android
npm run android
npm run apk
```
