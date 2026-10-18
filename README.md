# 健身记录

离线安卓应用：选动作、记重量和次数、组间休息、查看历史。

动作名称、部位、中文步骤和动作 GIF 来自 [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)。动画媒体 © [Gym visual](https://gymvisual.com/)，联网后按需加载。记录只存在手机本地。

支持上次成绩自动带入、训练模板、训练中删组/删动作、历史删除。

## 远程更新（必读）

手机里的「检查更新」会拉取本仓库的 `release/latest.json`（并优先尝试 GitHub Release 上的同名文件）。只有同时满足下面三条，已安装的 App 才会下载网页包并热更新，**训练记录不会被清掉**：

1. `version` 比手机里的 `APP_VERSION` **更高**
2. `url` 指向可下载的 **zip 网页包**（不能是空字符串）
3. `checksum` 是该 zip 的 **SHA-256**（不能是空字符串）

正确示例：

```json
{
  "version": "1.2.0",
  "url": "https://github.com/hmghaoci/gym-log/releases/download/v1.2.0/gym-log-web.zip",
  "checksum": "<zip 的 sha256>",
  "apk": "https://github.com/hmghaoci/gym-log/releases/download/v1.2.0/gym-log-1.2.0.apk"
}
```

### 曾经踩过的坑

只改版本号、不上传包，检查更新会失败或看起来像“没法更新”：

| 手机看到的提示 | 实际原因 |
| --- | --- |
| 已是最新版本 | 远程 `version` 和手机里一样，或远程还没推上去 |
| 发现新版本，更新包还没上传 | 远程 `version` 更高了，但 `url` / `checksum` 仍是空的 |
| 检查更新失败 | 拉不到 `latest.json`，或网络不通 |

对照 [MICU-OmniProbe](https://github.com/zuoliangyu/MICU-OmniProbe) 的做法：更新清单和安装包都挂在 **GitHub Releases** 上，联网后才能真正下载。本仓库同样需要：

1. 打包 `www/` 为 `release/gym-log-web.zip`
2. 算 zip 的 SHA-256，写进 `release/latest.json`
3. 创建 Release（如 `v1.2.0`），上传 `gym-log-web.zip`、`latest.json`、可选 APK
4. 把带完整 `url` / `checksum` 的 `latest.json` 推到 `main`

只改 `www/app.js` 里的 `APP_VERSION` 或只改仓库里的 `latest.json` 版本字段，**不够**；没有 Release 上的 zip，旧手机永远下不来新界面。

### 发布一轮更新时

```bash
# 1. 改 www/ 后打 zip，并更新 release/latest.json 的 version / url / checksum
# 2. 构建 APK（可选）
npm run android
npm run apk

# 3. 推代码
git add -A && git commit -m "..." && git push origin main

# 4. 建 Release 并上传产物（与 latest.json 里的 url 一致）
gh release create vX.Y.Z --title "X.Y.Z" --notes "..." \
  release/gym-log-web.zip release/latest.json release/gym-log-X.Y.Z.apk
```

已装旧版的手机：连上网 → 点「检查更新」→ 应出现「正在下载更新」。若首页版本号已经等于远程版本，提示「已是最新」是正常的。

## 本地构建

```bash
npm install
npx cap add android
npm run android
npm run apk
```
