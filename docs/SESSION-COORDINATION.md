# 双会话协作说明（gym-log）

更新：2026-10-18  
目的：两个 Cursor 会话同时改本仓库时不抢同一块、不互相覆盖。

## 会话分工

| 会话 | ID（短） | 负责 | 不要动 |
|------|----------|------|--------|
| **本会话 · UI 风格** | `d1b54be0` | 可切换界面风格（主题）：CSS 变量、主题切换控件、`localStorage` 主题键 | 新功能业务逻辑（备份、震动、进步曲线等） |
| **另一会话 · 功能** | `fa919d7f` | 功能优化（当前在问：A 导出导入 / B 休息提示 / C 动作进步） | 大范围改视觉体系、重做配色与布局皮肤 |

## 文件边界（硬约定）

| 文件 | UI 会话 | 功能会话 |
|------|---------|----------|
| `www/app.css` | **主改**（主题变量、`.theme-*`） | 尽量不改；若必须加类名，只追加、不改现有变量名 |
| `www/app.js` | 只改：主题读写、`home` 上风格切换一小块、`boot` 时应用主题 | 主改：训练/模板/历史/备份/提醒/进步等逻辑 |
| `www/index.html` | 可改 `theme-color`（随主题） | 一般不动 |
| `package.json` / `release/` / Android | 不动（除非用户明确要求发版） | 按原计划；发版前先合 UI |
| `.cursor/rules/` | 可补「主题相关」短规则 | 可补「功能/远程更新」规则（已有 remote-update） |

## 存储键（避免撞名）

- 已有：`gymlog.v1`（训练数据）、`gymlog.rest`、`gymlog.lang`
- **新增（仅 UI 会话）**：`gymlog.theme`（字符串，如 `default` / `dark` / `gym`）
- 功能会话新增键请用 `gymlog.` 前缀，**不要**占用 `gymlog.theme`

## 合并顺序建议

1. UI 会话先落地主题切换（改 CSS + 少量 JS）。
2. 功能会话在挑 A/B/C 后实现；改 `homeView` 时**保留**主题切换那一块 DOM/`data-theme` 绑定。
3. 若两边都改了 `app.js` 同一段，以「功能会话保留逻辑、UI 会话保留主题块」手工合并。

## 给另一会话的一句话（可粘贴）

> 另一会话 `d1b54be0` 正在给 gym-log 加**可切换 UI 风格**，主改 `www/app.css` + `app.js` 里主题切换；键名 `gymlog.theme`。请你继续做功能（备份/休息提醒/进步），不要重做配色；改首页时保留主题切换控件。协作说明：`docs/SESSION-COORDINATION.md`。

## 已确认主题

| 键 | 名称 | 图前缀 |
|----|------|--------|
| `ember` | 余烬 | `ember-*` |
| `mist` | 薄雾 | `mist-*` |
| `pulse` | 脉冲 | `pulse-*` |
| `forge` | 锻火 | `forge-*` |

资源：`www/theme-assets/` · 规格：`docs/superpowers/specs/2026-10-18-ui-themes-design.md`

## 状态

- [x] UI 会话：预览确认；已写入 `theme.css` / `theme.js` / `theme-assets`（未动 `homeView`）
- [x] 功能会话：1.3.0 备份 / 休息提醒 / 进步 + 主题芯片骨架
- [ ] 功能会话：读 MAILBOX「配色可以发」，打更高版本并把 `theme-assets` 打进包
- [ ] 两边一起验证首页（主题 + 备份/进步入口都不丢）
