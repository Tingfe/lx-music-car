import { useTheme } from '@/store/theme/hook'
import { StatusBar as RNStatusBar } from 'react-native'
import { isCarEdition } from '@/utils/nativeModules/utils'

const StatusBar = function() {
  const theme = useTheme()
  const statusBarStyle = theme.isDark ? 'light-content' : 'dark-content'
  if (isCarEdition) return null
  return <RNStatusBar backgroundColor="rgba(0,0,0,0)" barStyle={statusBarStyle} translucent={true} />
}

StatusBar.currentHeight = RNStatusBar.currentHeight ?? 0
StatusBar.setBarStyle = RNStatusBar.setBarStyle

export default StatusBar
