import { TouchableOpacity } from 'react-native'
import { Icon } from '@/components/common/Icon'
import { useIsPlay, usePlayerMusicInfo } from '@/store/player/hook'
import { useTheme } from '@/store/theme/hook'
import { playNext, playPrev, togglePlay } from '@/core/player/player'
import { createStyle } from '@/utils/tools'
import { useHorizontalMode } from '@/utils/hooks'
import { isCarEdition } from '@/utils/nativeModules/utils'
import { getCarTheme } from '@/theme/car'
import { CAR_LAYOUT } from '@/utils/carLayout'

const BTN_SIZE = isCarEdition ? 34 : 24
const TOUCH_SIZE = isCarEdition ? CAR_LAYOUT.touchSize : 46
const handlePlayPrev = () => {
  void playPrev()
}
const handlePlayNext = () => {
  void playNext()
}

const PlayPrevBtn = ({ disabled }: { disabled: boolean }) => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)

  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="上一首" accessibilityState={{ disabled }} disabled={disabled} style={[styles.cotrolBtn, { opacity: disabled ? 0.45 : 1 }]} activeOpacity={0.5} onPress={handlePlayPrev}>
      <Icon name='prevMusic' color={isCarEdition ? carTheme.accent : theme['c-button-font']} size={BTN_SIZE} />
    </TouchableOpacity>
  )
}

const PlayNextBtn = ({ disabled }: { disabled: boolean }) => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)

  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="下一首" accessibilityState={{ disabled }} disabled={disabled} style={[styles.cotrolBtn, { opacity: disabled ? 0.45 : 1 }]} activeOpacity={0.5} onPress={handlePlayNext}>
      <Icon name='nextMusic' color={isCarEdition ? carTheme.accent : theme['c-button-font']} size={BTN_SIZE} />
    </TouchableOpacity>
  )
}

const TogglePlayBtn = ({ disabled }: { disabled: boolean }) => {
  const isPlay = useIsPlay()
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)

  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={isPlay ? '暂停' : '播放'} accessibilityState={{ disabled }} disabled={disabled} style={[styles.cotrolBtn, isCarEdition ? { borderRadius: 38, backgroundColor: carTheme.accent } : null, { opacity: disabled ? 0.45 : 1 }]} activeOpacity={0.5} onPress={togglePlay}>
      <Icon name={isPlay ? 'pause' : 'play'} color={isCarEdition ? carTheme.onAccent : theme['c-button-font']} size={isCarEdition ? 40 : BTN_SIZE} />
    </TouchableOpacity>
  )
}

export default () => {
  const isHorizontalMode = useHorizontalMode()
  const musicInfo = usePlayerMusicInfo()
  const disabled = isCarEdition && !musicInfo.id
  return (
    <>
      {/* <TouchableOpacity activeOpacity={0.5} onPress={toggleNextPlayMode}>
        <Text style={{ ...styles.cotrolBtn }}>
          <Icon name={playModeIcon} style={{ color: theme.secondary10 }} size={18} />
        </Text>
      </TouchableOpacity>
    */}
      {/* {btnPrev} */}
      { isHorizontalMode || isCarEdition ? <PlayPrevBtn disabled={disabled} /> : null }
      <TogglePlayBtn disabled={disabled} />
      <PlayNextBtn disabled={disabled} />
    </>
  )
}


const styles = createStyle({
  cotrolBtn: {
    width: TOUCH_SIZE,
    height: TOUCH_SIZE,
    justifyContent: 'center',
    alignItems: 'center',

    // backgroundColor: '#ccc',
    shadowOpacity: 1,
    textShadowRadius: 1,
  },
})
