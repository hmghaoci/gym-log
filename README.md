# 健身记录

离线优先的健身记录 App（Android / 浏览器）。按周计划开练、记重量与次数、组间休息，历史与进步都留在本机。

当前版本：**1.9.0**。远程更新清单见 [`release/latest.json`](release/latest.json)，Release：https://github.com/hmghaoci/gym-log/releases/tag/v1.9.0

界面源码在 `web/`（React + Vite + Tailwind），构建产物输出到 `www/`，由 Capacitor 打成安卓包。动作名称、部位、中文步骤与媒体来自 [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)；动画媒体 © [Gym visual](https://gymvisual.com/)，已打进安装包，**离线可看缩略图与动图**。

## 功能

| 模块 | 说明 |
|------|------|
| **训练** | 今天的计划、立即开练或自由空训练 |
| **计划** | 周一到周日安排模板；首页按今天自动带出 |
| **动作库** | 搜索、按部位 / 器械筛选，本地预览图与动图 |
| **历史** | 历次训练详情与容量 |
| **数据** | 近八周热力、动作重量进步 |
| **设置** | 主题、休息时长、提示音、备份、检查更新 |

其它：

- **四套界面风格**：日蚀熔岩、极光幻夜、极简净白（默认）、黑曜钛金
- **训练中**：上次成绩带入、删组 / 删动作、组间休息倒计时与提示音
- **工具**：杠铃片计算器、1RM 估算
- **备份**：导出 / 导入 JSON；换机不丢记录
- **离线**：训练记录与 1324 个动作的 JPG / GIF 都在本机
- **远程更新**：Capgo 自托管；有网时可下载网页包，不用重装 APK（1.8.0 更新包约 120MB，因含动作媒体）

旧版单文件 `gymlog.v1` 数据会在首次打开时自动迁入当前存储结构。

## 目录

```
gym-log/
├── web/                 # 界面源码（改这里）
│   ├── public/          # 构建时拷入 www（含 images/、videos/，约 130MB，不进 git）
│   └── src/
├── www/                 # Vite 构建产物（Capacitor 读取）
├── android/             # Capacitor 安卓工程
├── release/             # latest.json 与发版清单
├── scripts/
│   ├── sync-media.js    # 同步动作缩略图与 GIF 到 web/public
│   └── copy-apk.js      # 复制 debug APK 到桌面
└── docs/                # 设计说明、会话协作备忘
```

## 开发

需要 Node.js。界面在 `web/` 下改：

```bash
cd web
npm install
npm run dev
```

默认 http://localhost:3000 。要看动作预览，先同步媒体（任选其一）：

```bash
# 仓库旁已有 exercises-dataset 时会本地复制；否则从 jsDelivr 下载
node scripts/sync-media.js
```

改完后构建进 `www/`：

```bash
cd web
npm run build
```

`vite.config.ts` 已把 `outDir` 设为 `../www`，并会把 `web/public/images`、`videos` 一并拷入。

## 打安卓包

在仓库根目录（已配置 Capacitor，`webDir` 为 `www`）：

```bash
node scripts/sync-media.js   # 首次或媒体缺失时
cd web && npm run build && cd ..

npm install
npx cap sync android
npm run android              # sync + assembleDebug
npm run apk                  # 复制到桌面「健身记录-1.8.0.apk」
```

安卓编译建议使用 **JDK 21**（JDK 26 可能编不过）。首次若没有 `android/`：`npx cap add android`。

## 发远程更新（OTA）

手机检查更新会读：

1. `https://github.com/hmghaoci/gym-log/releases/latest/download/latest.json`
2. 回退：本仓库 `release/latest.json`（raw）

**只改版本号不够。** 必须同时有可下载的 zip、checksum，并挂到 GitHub Release。

推荐流程：

1. `node scripts/sync-media.js` → `cd web && npm run build`
2. 把 `www/` 打成 `release/gym-log-web.zip`
3. 计算 zip 的 SHA-256，写入 `release/latest.json`：

```json
{
  "version": "1.8.0",
  "url": "https://github.com/hmghaoci/gym-log/releases/download/v1.8.0/gym-log-web.zip",
  "checksum": "<sha256>",
  "apk": "https://github.com/hmghaoci/gym-log/releases/download/v1.8.0/gym-log-1.8.0.apk"
}
```

4. 同步抬高 `web/src/utils/update.ts` 里的 `APP_VERSION` 与根目录 `package.json` 的 `version`
5. `gh release create v1.8.0` 上传 `gym-log-web.zip`、`latest.json`（以及可选 APK）
6. 推送 `main` 上的 `release/latest.json`

| 提示 | 含义 |
|------|------|
| 已是最新版本 | 远程 version ≤ 手机 version，或清单未更新 |
| 更新包还没上传 | version 更高但 `url` / `checksum` 为空 |
| 检查更新失败 | 拉不到清单或网络问题 |

改原生插件、权限或包名时，仍需发新 APK；仅改网页层用 OTA 即可。含媒体的更新包体积大，首次下载会久一些。

## 本地存储（概要）

| 键 | 内容 |
|----|------|
| `gymlog.v1.sessions` | 训练记录 |
| `gymlog.v1.templates` | 模板 |
| `gymlog.v1.schedule` | 周计划 |
| `gymlog.v1.settings` | 语言、休息等 |
| `gymlog.themeStyle_v4` | 界面风格 |
| `gymlog.v1`（旧） | 首次打开时迁入上方键 |

详细迁移逻辑见 `web/src/utils/storage.ts`。

## 相关链接

- 仓库：https://github.com/hmghaoci/gym-log
- 最新安装包 / 更新包：https://github.com/hmghaoci/gym-log/releases/latest
- 更新清单：[`release/latest.json`](release/latest.json)
- 动作数据集：[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
- 界面结构参考：[hmghaoci/exer1](https://github.com/hmghaoci/exer1)（已并入本仓库 `web/`）
