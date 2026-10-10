// Component-tree checks with native boundaries mocked; not an Android renderer.
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const root = path.join(__dirname, '../..')

const createRenderer = ({ dark = true, width = 800, hasMusic = true, fontSize = 1 } = {}) => {
  const calls = []
  const cache = new Map()
  const jsx = (type, props) => ({ type, props: props || {} })
  const noop = () => {}
  const hooks = {
    memo: fn => fn,
    useMemo: fn => fn(),
    useCallback: fn => fn,
    useEffect: noop,
    useImperativeHandle: noop,
    forwardRef: fn => fn,
    useRef: value => ({ current: value }),
    useState: value => [typeof value === 'function' ? value() : value, noop],
  }
  const music = { id: hasMusic ? 'fixture-track' : '', name: '长歌名测试：沿着海岸一直向前，直到看见远方的灯塔', singer: '示例歌手', album: '示例专辑', pic: null }
  const modules = {
    react: hooks,
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    'react-native': {
      View: 'View',
      Text: 'Text',
      TouchableOpacity: 'TouchableOpacity',
      ScrollView: 'ScrollView',
      StatusBar: Object.assign(() => null, { currentHeight: 24, setBarStyle: noop }),
      StyleSheet: { create: value => value, absoluteFill: { position: 'absolute', inset: 0 } },
      Platform: { select: value => value.android },
    },
    '@/components/common/Text': 'Text',
    '@/components/common/Image': 'Image',
    '@/components/common/Icon': { Icon: 'Icon' },
    '@/components/common/Badge': 'Badge',
    '@/components/common/Loading': 'Loading',
    '@/store/list/hook': { useListFetching: () => false, useMyList: () => [], useActiveListId: () => '' },
    '@/utils/data': { getListPosition: async() => 0, saveListPosition: async() => {} },
    '@/core/list': { setActiveList: noop },
    '@/store/theme/hook': { useTheme: () => ({ isDark: dark }) },
    '@/store/common/hook': { usePageVisible: noop, useNavActiveId: () => 'nav_love', useStatusbarHeight: () => 0, useAssertApiSupport: () => true },
    '@/store/player/hook': { usePlayerMusicInfo: () => music, useIsPlay: () => true, useStatusText: () => '正在播放', useProgress: () => ({ nowPlayTimeStr: '01:28', maxPlayTimeStr: '04:32', progress: 0.32, maxPlayTime: 272 }) },
    '@/store/setting/hook': { useSettingValue: () => true },
    '@/store/common/state': { componentIds: { home: 'fixture-home' } },
    '@/core/common': { setNavActiveId: id => calls.push(id), exitApp: noop },
    '@/core/player/player': { playPrev: () => calls.push('prev'), playNext: () => calls.push('next'), togglePlay: () => calls.push('toggle') },
    '@/utils/nativeModules/utils': { isCarEdition: true },
    '@/utils/hooks': { useLayout: () => ({ onLayout: noop, width }), useHorizontalMode: () => true },
    '@/utils/tools': { createStyle: value => value, confirmDialog: noop, exitApp: noop },
    '@/utils/pixelRatio': { scaleSizeH: value => value, scaleSizeW: value => value },
    '@/plugins/player': { useBufferProgress: () => 0.5 },
    '@/navigation': { navigations: { pushPlayDetailScreen: () => calls.push('detail') } },
    '@/lang': { useI18n: () => id => ({ nav_search: '搜索', nav_songlist: '歌单', nav_love: '我的列表', nav_setting: '设置', nav_exit: '退出应用' }[id] || id) },
    '@/theme': { BorderWidths: { normal: 1 } },
    '@/config/constant': {
      COMPONENT_IDS: { home: 'home' },
      LIST_ITEM_HEIGHT: 72,
      NAV_SHEAR_NATIVE_IDS: { songlistDetail_pic: 'cover' },
      NAV_MENUS: [{ id: 'nav_search', icon: 'search' }, { id: 'nav_songlist', icon: 'songlist' }, { id: 'nav_love', icon: 'heart' }, { id: 'nav_setting', icon: 'setting' }],
    },
  }
  const load = file => {
    if (cache.has(file)) return cache.get(file)
    const module = { exports: {} }
    cache.set(file, module.exports)
    const { outputText } = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    })
    vm.runInNewContext(outputText, {
      module,
      exports: module.exports,
      global: { lx: { fontSize } },
      require(name) {
        if (name in modules) return modules[name]
        if (name === './components/Pic') return 'Pic'
        if (name === '@/components/player/Progress') return { __esModule: true, default: 'Progress', ProgressPlain: 'Progress' }
        const target = name.startsWith('@/') ? 'src/' + name.slice(2) : path.join(path.dirname(file), name)
        for (const extension of ['.ts', '.tsx']) if (fs.existsSync(path.join(root, target + extension))) return load(target + extension)
        throw new Error('Unexpected native boundary: ' + name)
      },
    }, { filename: file })
    cache.set(file, module.exports)
    return module.exports
  }
  const expand = node => {
    if (node == null || typeof node !== 'object') return node
    if (Array.isArray(node)) return node.map(expand)
    if (typeof node.type === 'function') return expand(node.type(node.props))
    return { type: node.type, props: { ...node.props, children: expand(node.props.children) } }
  }
  const render = (file, props = {}, exportName = 'default') => expand(jsx(load(file)[exportName], props))
  return { render, load, calls, music }
}

const flattenStyle = style => Object.assign({}, ...[style].flat(Infinity).filter(Boolean))
const nodes = tree => {
  if (!tree || typeof tree !== 'object') return []
  if (Array.isArray(tree)) return tree.flatMap(nodes)
  return [tree, ...nodes(tree.props?.children)]
}
module.exports = { createRenderer, flattenStyle, nodes }
