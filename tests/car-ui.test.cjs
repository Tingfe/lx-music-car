const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const { createRenderer, flattenStyle, nodes } = require('./helpers/car-render.cjs')
const root = path.join(__dirname, '..')
const { load } = createRenderer()
const { CAR_LAYOUT, getCarMusicRows, getCarPlaylistGrid, getCarPlayerLayout } = load('src/utils/carLayout.ts')
const { getCarTheme } = load('src/theme/car.ts')

test('car dimensions stay in dp across density, window size and text preferences', () => {
  const source = fs.readFileSync(path.join(root, 'src/utils/pixelRatio.ts'), 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  for (const [width, height, density] of [[375, 667, 1], [960, 480, 1.5], [1280, 720, 2], [1920, 720, 3]]) {
    const module = { exports: {} }
    vm.runInNewContext(compiled, {
      module,
      exports: module.exports,
      global: { lx: { fontSize: 1.5 } },
      require: name => name === './nativeModules/utils' ? { isCarEdition: true } : name === './windowSizeTools'
        ? { windowSizeTools: { getSize: () => ({ width, height }) } }
        : { PixelRatio: { get: () => density, getFontScale: () => 1.2, getPixelSizeForLayoutSize: value => value * density } },
    })
    assert.equal(module.exports.scaleSizeH(76), 76)
    assert.equal(module.exports.scaleSizeW(76), 76)
    assert.equal(module.exports.getTextSize(22), 22)
    assert.equal(module.exports.setSpText(22), 33)
  }
})

test('music columns use measured content width, not physical display aspect ratio', () => {
  for (const width of [320, 560, 720, 960, 1079]) assert.equal(getCarMusicRows(width).rowNum, 1)
  assert.equal(getCarMusicRows(1080).rowNum, 2)
  for (const file of ['src/components/OnlineList/List.tsx', 'src/screens/Home/Views/Mylist/MusicList/List.tsx']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8')
    assert.match(source, /getCarMusicRows\(width\)/)
    assert.match(source, /onLayout=\{isCarEdition \? onLayout/)
    assert.match(source, /key=\{rowInfo\.current\.rowNum/)
  }
})

test('playlist cards fit narrow and wide content without horizontal overflow', () => {
  for (let width = 280; width <= 1600; width++) {
    const grid = getCarPlaylistGrid(width)
    assert.ok(grid.num >= 1 && grid.num <= 3)
    assert.ok(grid.width * grid.num + (grid.num - 1) * CAR_LAYOUT.gap + CAR_LAYOUT.gutter * 2 <= width + 0.01)
    if (grid.num > 1) assert.ok(grid.width >= CAR_LAYOUT.playlistMinWidth)
  }
})

const luminance = hex => {
  const rgb = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
}

test('actual song row keeps playback and more actions in separate large targets', () => {
  for (const dark of [false, true]) {
    const renderer = createRenderer({ dark })
    const item = { id: 'fixture', name: '长歌名保持单行且不挤占操作区', singer: '示例歌手', source: 'tx', interval: '04:32', meta: { albumName: '示例专辑' } }
    const tree = renderer.render('src/screens/Home/Views/Mylist/MusicList/ListItem.tsx', {
      item,
      index: 0,
      activeIndex: 0,
      selectedList: [],
      rowInfo: { rowNum: 1, rowWidth: '100%' },
      isShowAlbumName: true,
      isShowInterval: true,
      onPress: () => {},
      onShowMenu: () => {},
      onLongPress: () => {},
    })
    assert.equal(flattenStyle(tree.props.style).height, 84)
    const buttons = nodes(tree).filter(node => node.type === 'TouchableOpacity')
    assert.equal(buttons.length, 2)
    assert.equal(flattenStyle(buttons[1].props.style).width, 76)
    assert.equal(flattenStyle(buttons[0].props.style).height, '100%')
    const title = nodes(tree).find(node => node.props.children === item.name)
    assert.equal(title.props.size, 22)
    assert.equal(title.props.numberOfLines, 1)
  }
})
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05)

test('local playlist selector shares large targets and selected theme feedback', () => {
  for (const dark of [false, true]) {
    const renderer = createRenderer({ dark })
    const item = { id: 'fixture', name: '我的收藏与自建歌单' }
    const tree = renderer.render('src/screens/Home/Views/Mylist/MyList/List.tsx', {
      item, index: 0, activeId: item.id, onPress: () => {}, onShowMenu: () => {},
    }, 'ListItem')
    assert.equal(flattenStyle(tree.props.style).height, 76)
    assert.equal(flattenStyle(tree.props.style).backgroundColor, getCarTheme(dark).active)
    const buttons = nodes(tree).filter(node => node.type === 'TouchableOpacity')
    assert.equal(flattenStyle(buttons[1].props.style).width, 76)
    assert.equal(buttons[0].props.accessibilityState.selected, true)
    assert.equal(nodes(tree).find(node => node.props.children === item.name).props.size, 20)
  }
})
test('day and night text and primary playback control retain readable contrast', () => {
  for (const dark of [false, true]) {
    const colors = getCarTheme(dark)
    for (const surface of ['page', 'surface', 'active']) {
      assert.ok(contrast(colors.text, colors[surface]) >= 4.5)
      assert.ok(contrast(colors.textMuted, colors[surface]) >= 4.5)
    }
    assert.ok(contrast(colors.onAccent, colors.accent) >= 4.5)
  }
})

test('actual playback component keeps controls separate from long metadata in both themes', () => {
  for (const dark of [false, true]) {
    for (const width of [360, 560, 800, 1200]) {
      const renderer = createRenderer({ dark, width })
      const tree = renderer.render('src/components/player/PlayerBar/CarPlayerBar.tsx', { isHome: true })
      const all = nodes(tree)
      const buttons = all.filter(node => ['上一首', '暂停', '下一首'].includes(node.props.accessibilityLabel))
      assert.equal(buttons.length, 3)
      for (const button of buttons) {
        const style = flattenStyle(button.props.style)
        assert.equal(style.width, 76)
        assert.equal(style.height, 76)
        assert.equal(button.props.disabled, false)
      }
      buttons.forEach(button => button.props.onPress())
      assert.equal(renderer.calls.join(','), 'prev,toggle,next')
      assert.equal(flattenStyle(tree.props.style).backgroundColor, getCarTheme(dark).surface)
      assert.equal(getCarPlayerLayout(width).stacked, width < 560)
      const title = all.find(node => node.props.children === renderer.music.name)
      assert.equal(title.props.numberOfLines, 1)
    }
  }
})

test('empty playback shows a useful entry and cannot send empty playback actions', () => {
  const renderer = createRenderer({ hasMusic: false })
  const all = nodes(renderer.render('src/components/player/PlayerBar/CarPlayerBar.tsx', { isHome: true }))
  const buttons = all.filter(node => ['上一首', '暂停', '下一首'].includes(node.props.accessibilityLabel))
  assert.ok(buttons.every(node => node.props.disabled))
  all.find(node => node.props.accessibilityLabel === '前往我的列表选择歌曲').props.onPress()
  assert.equal(renderer.calls.join(','), 'nav_love')
})

test('actual playlist card has a single large target and themed readable title', () => {
  for (const dark of [false, true]) {
    const renderer = createRenderer({ dark })
    const tree = renderer.render('src/screens/Home/Views/SongList/components/Songlist/ListItem.tsx', {
      item: { id: 'fixture-list', source: 'kw', name: '长歌单名称：晴天出发，沿途都是喜欢的音乐', author: '示例作者' }, width: 304, index: 0, showSource: false, onPress() {},
    })
    assert.equal(tree.type, 'TouchableOpacity')
    assert.equal(flattenStyle(tree.props.style).width, 304)
    assert.equal(flattenStyle(tree.props.style).backgroundColor, getCarTheme(dark).surface)
    const title = nodes(tree).find(node => node.props.size === 20)
    assert.equal(title.props.numberOfLines, 2)
  }
})

test('car never renders an Android status bar or requests extra window space', () => {
  assert.equal(createRenderer().render('src/components/common/StatusBar.tsx'), null)
  const source = fs.readFileSync(path.join(root, 'src/components/player/PlayerBar/CarPlayerBar.tsx'), 'utf8')
  assert.doesNotMatch(source, /Dimensions\.get|setSystemUi|FLAG_FULLSCREEN|StatusBar/)
})
