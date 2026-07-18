# LX Music 车机版 · Tingfe

独立维护的 Android 车机版 LX Music。它以横屏、驾驶场景的大尺寸触控和左侧主应用区可读性为优先，并可作为 Tingfe 私有同步体系中的受控播放终端。

- 下载测试包：[Releases](https://github.com/Tingfe/lx-music-car/releases)
- 同步服务：[Tingfe/lx-music-sync-server](https://github.com/Tingfe/lx-music-sync-server)
- 当前版本：`v1.8.15`
- 包名：`cn.toside.music.mobile.car`
- 发布包仅提供一个 `universal.apk`。

## 车机版设计

- 强制横屏，主页保持常亮；系统允许时会隐藏系统栏，恢复焦点或页面跳转后会再次请求沉浸模式。
- 允许车机系统重设应用任务尺寸，避免部分 Android 8.1 Launcher 将不可重设窗口固定在兼容窗格中。
- 声明车机 Launcher 常见的 `systemUIStatusBarStyle=Hide` 元数据；不请求或伪造系统签名权限。
- 车机专属驾驶舱布局：以“我的音乐”为新安装默认入口，侧栏将主功能与设置分组；72dp 歌曲行、60dp 歌单切换、124dp 播放栏和 76dp 播放控制均以驾驶场景触控为目标。
- 在线歌单、榜单和设置也使用同一尺度：72dp 筛选栏、64dp 榜单与设置导航、56dp 输入/开关/滑块，避免在不同页面切换时出现手机式密集控件。
- 专属深色 / 浅色驾驶主题：夜间为低眩光深灰蓝，白天为高对比浅灰白；顶部可一键切换，且不会同步到手机或桌面端。
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
