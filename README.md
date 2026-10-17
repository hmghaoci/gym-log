# 健身记录

离线安卓应用：选动作、记重量和次数、组间休息、查看历史。

动作名称、部位和中文步骤来自 [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)。记录只存在手机本地。

远程更新读取本仓库的 `release/latest.json`。版本号更高且带有 `url` 与 `checksum` 时，已安装的应用会下载网页更新包，不用重装。训练记录不会被清掉。

```bash
npm install
npx cap add android
npm run android
npm run apk
```
