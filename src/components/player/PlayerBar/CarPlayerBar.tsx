import { useCallback, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from '@/components/common/Text'
import Progress, { ProgressPlain } from '@/components/player/Progress'
import { usePlayerMusicInfo, useProgress, useStatusText } from '@/store/player/hook'
import { useTheme } from '@/store/theme/hook'
import { useSettingValue } from '@/store/setting/hook'
import { usePageVisible } from '@/store/common/hook'
import { useLayout } from '@/utils/hooks'
import { getCarTheme } from '@/theme/car'
import { CAR_LAYOUT, getCarPlayerLayout } from '@/utils/carLayout'
import { COMPONENT_IDS } from '@/config/constant'
import { navigations } from '@/navigation'
import commonState from '@/store/common/state'
import { setNavActiveId } from '@/core/common'
import { useBufferProgress } from '@/plugins/player'
import Pic from './components/Pic'
import ControlBtn from './components/ControlBtn'

export default ({ isHome }: { isHome: boolean }) => {
  const theme = useTheme()
  const colors = getCarTheme(theme.isDark)
  const music = usePlayerMusicInfo()
  const status = useStatusText()
  const { onLayout, width } = useLayout()
  const layout = getCarPlayerLayout(width)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const { nowPlayTimeStr, maxPlayTimeStr, progress, maxPlayTime } = useProgress(autoUpdate)
  const buffered = useBufferProgress()
  const allowSeek = useSettingValue('common.allowProgressBarSeek')
  usePageVisible([COMPONENT_IDS.home], useCallback((visible) => {
    if (isHome) setAutoUpdate(visible)
  }, [isHome]))

  const openPlayer = () => {
    if (music.id) navigations.pushPlayDetailScreen(commonState.componentIds.home!)
    else setNavActiveId('nav_love')
  }

  return (
    <View onLayout={onLayout} style={[styles.container, { minHeight: layout.minHeight, backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <View style={[styles.body, layout.stacked ? styles.stacked : null]}>
        <View style={[styles.track, layout.stacked ? styles.stackedTrack : null]}>
          <Pic isHome={isHome} size={CAR_LAYOUT.playerCover} />
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={music.id ? '打开播放详情' : '前往我的列表选择歌曲'} activeOpacity={0.72} onPress={openPlayer} style={styles.trackInfo}>
            <Text size={22} style={styles.title} color={colors.text} numberOfLines={1}>{music.id ? music.name : '选择歌曲开始播放'}</Text>
            <Text size={16} color={colors.textMuted} numberOfLines={1}>{music.id ? (music.singer || music.album || '未知歌手') : '前往「我的列表」选择歌单'}</Text>
            <Text size={14} style={styles.status} color={colors.textMuted} numberOfLines={1}>{music.id ? (status || '准备播放') : '支持手机在线遥控'}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.controls, layout.stacked ? styles.stackedControls : null]}>
          <View style={styles.buttons}><ControlBtn /></View>
          <Text size={14} style={styles.time} color={colors.textMuted}>{nowPlayTimeStr} / {maxPlayTimeStr}</Text>
        </View>
      </View>
      <View style={styles.progress}>
        {allowSeek
          ? <Progress progress={progress} duration={maxPlayTime} buffered={buffered} paddingTop={16} />
          : <ProgressPlain progress={progress} duration={maxPlayTime} buffered={buffered} paddingTop={16} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexShrink: 0, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 20, borderTopWidth: 1 },
  body: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stacked: { flexDirection: 'column', alignItems: 'stretch', gap: 8 },
  track: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center' },
  stackedTrack: { flex: 0, minHeight: CAR_LAYOUT.playerCover },
  trackInfo: { flex: 1, minWidth: 0, minHeight: 76, paddingLeft: 12, justifyContent: 'center' },
  title: { fontWeight: '600', marginBottom: 4 },
  status: { marginTop: 4 },
  controls: { flexShrink: 0, alignItems: 'center' },
  stackedControls: { alignSelf: 'center' },
  buttons: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  time: { marginTop: 4, fontVariant: ['tabular-nums'] },
  progress: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 20 },
})
