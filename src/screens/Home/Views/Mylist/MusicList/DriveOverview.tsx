import { TouchableOpacity, View } from 'react-native'
import Text from '@/components/common/Text'
import { Icon } from '@/components/common/Icon'
import { useTheme } from '@/store/theme/hook'
import { useIsPlay, usePlayerMusicInfo } from '@/store/player/hook'
import { useStatus as useSyncStatus } from '@/store/sync/hook'
import { togglePlay } from '@/core/player/player'
import { setNavActiveId } from '@/core/common'
import { createStyle } from '@/utils/tools'
import { getCarTheme } from '@/theme/car'

const Action = ({ icon, label, onPress, accent = false }: {
  icon: string
  label: string
  onPress: () => void
  accent?: boolean
}) => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)

  return (
    <TouchableOpacity
      style={{ ...styles.action, backgroundColor: accent ? carTheme.active : carTheme.surface, borderColor: accent ? carTheme.accent : carTheme.border }}
      activeOpacity={0.72}
      onPress={onPress}
    >
      <Icon name={icon} size={accent ? 28 : 23} color={accent ? carTheme.accent : carTheme.textMuted} />
      <Text style={styles.actionText} size={14} color={accent ? carTheme.text : carTheme.textMuted}>{label}</Text>
    </TouchableOpacity>
  )
}

export default () => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)
  const musicInfo = usePlayerMusicInfo()
  const isPlay = useIsPlay()
  const syncStatus = useSyncStatus()
  const hasMusic = Boolean(musicInfo.id)

  const openMusicList = () => {
    global.app_event.changeLoveListVisible(true)
  }

  const toggle = () => {
    if (!hasMusic) {
      openMusicList()
      return
    }
    togglePlay()
  }

  return (
    <View style={{ ...styles.container, backgroundColor: carTheme.page, borderBottomColor: carTheme.border }}>
      <TouchableOpacity style={styles.nowPlaying} activeOpacity={0.75} onPress={toggle}>
        <View style={[styles.indicator, { backgroundColor: hasMusic && isPlay ? carTheme.accent : carTheme.iconMuted }]} />
        <View style={styles.trackInfo}>
          <Text style={styles.eyebrow} size={13} color={carTheme.textMuted}>当前播放</Text>
          <Text style={styles.trackTitle} size={20} color={carTheme.text} numberOfLines={1}>{hasMusic ? musicInfo.name : '选择一个歌单开始播放'}</Text>
          <Text size={14} color={carTheme.textMuted} numberOfLines={1}>{hasMusic ? (musicInfo.singer || musicInfo.album || '未知歌手') : '轻触此处打开歌单'}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <Action icon={isPlay ? 'pause' : 'play'} label={isPlay ? '暂停' : '播放'} onPress={toggle} accent />
        <Action icon="search-2" label="搜索" onPress={() => { setNavActiveId('nav_search') }} />
        <Action icon="album" label="歌单" onPress={openMusicList} />
      </View>
      <View style={styles.syncStatus}>
        <View style={[styles.syncDot, { backgroundColor: syncStatus.status ? carTheme.accent : carTheme.iconMuted }]} />
        <Text size={13} color={carTheme.textMuted}>{syncStatus.status ? '同步服务已连接' : (syncStatus.message || '同步服务未连接')}</Text>
      </View>
    </View>
  )
}

const styles = createStyle({
  container: {
    minHeight: 128,
    paddingLeft: 20,
    paddingRight: 18,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  nowPlaying: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingRight: 236,
  },
  indicator: {
    width: 5,
    height: 44,
    borderRadius: 3,
    marginRight: 14,
  },
  trackInfo: {
    flex: 1,
    flexShrink: 1,
  },
  eyebrow: {
    marginBottom: 2,
  },
  trackTitle: {
    marginBottom: 3,
  },
  actions: {
    position: 'absolute',
    right: 18,
    top: 18,
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    width: 72,
    height: 72,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    marginTop: 4,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingLeft: 19,
  },
  syncDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
})
