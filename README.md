# LX Music 车机版 · Tingfe

独立维护的 Android 车机版 LX Music。它以横屏、全屏和驾驶场景的大尺寸触控为优先，并可作为 Tingfe 私有同步体系中的受控播放终端。

- 下载测试包：[Releases](https://github.com/Tingfe/lx-music-car/releases)
- 同步服务：[Tingfe/lx-music-sync-server](https://github.com/Tingfe/lx-music-sync-server)
- 当前版本：`v1.8.12`
- 包名：`cn.toside.music.mobile.car`
- 发布包仅提供一个 `universal.apk`。

## 车机版设计

- 强制横屏、沉浸式全屏，主页保持常亮；系统栏在恢复焦点或页面跳转后会再次隐藏。
- 允许车机系统重设应用任务尺寸，避免部分 Android 8.1 Launcher 将不可重设窗口固定在兼容窗格中。
- 声明车机 Launcher 常见的 `systemUIStatusBarStyle=Hide` 元数据；不请求或伪造系统签名权限。
- 车机专属驾驶舱布局：172dp 文字侧边导航、72dp 顶栏、112dp 播放栏、68dp 播放控制和放大的可读文字。
- 固定的深色驾驶舱底色，移除图片背景与浅色面板，降低夜间眩光与视觉干扰。
- `main` 分支推送自动构建内置 JavaScript bundle 的测试 APK，并作为 GitHub Pre-release 发布；无需 Metro，也不依赖正式签名密钥。
- 应用内更新仅读取本仓库的正式 Release。
- 默认只检查正式版；在「设置 → 关于」开启“接收测试版更新”后，可直接检测和安装最新 Pre-release 的 universal APK。

完整安装、兼容性、升级与车机交互边界见：[车机版说明](docs/CAR_EDITION.md)。

## 同步与手机遥控

- 同步歌单、收藏、不喜欢列表、可信自定义音源脚本，以及跨端语义一致的播放、搜索、歌词和列表设置。
- 语言、主题、下载路径、缓存、音频设备和同步凭据保留在车机本地，避免手机或桌面端设置错误覆盖。
- 车机连接同一同步账号并在线后，手机端会出现“车机”快捷入口；可切歌、播放/暂停，或让车机播放手机当前歌曲。
- 指令仅在车机在线时传递，不会写入同步数据或影响普通手机版的播放功能。

先将服务端升级到 [`v2.1.11` 及以上](https://github.com/Tingfe/lx-music-sync-server/releases)，再在车机「设置 → 数据同步」连接相同账号。完整的音源与同步验证步骤见：[同步升级说明](docs/CUSTOM_SOURCE_SYNC_UPGRADE.md)。

## 相关项目

- 手机端：[Tingfe/lx-music-mobile](https://github.com/Tingfe/lx-music-mobile)
- 桌面端：[Tingfe/lx-music-desktop](https://github.com/Tingfe/lx-music-desktop)
- 同步服务：[Tingfe/lx-music-sync-server](https://github.com/Tingfe/lx-music-sync-server)

自定义音源是可执行 JavaScript，只应在你信任的设备、账号和私有服务之间同步。

## 上游项目与许可证

本项目基于 [lyswhut/lx-music-mobile](https://github.com/lyswhut/lx-music-mobile) 维护；原始移动端完整功能、FAQ、源码开发方式和使用限制请参阅上游 [README](https://github.com/lyswhut/lx-music-mobile#readme) 与 [官方文档](https://lyswhut.github.io/lx-music-doc/mobile/)。

本项目遵循仓库中的 [Apache-2.0 License](LICENSE) 及其适用说明。
