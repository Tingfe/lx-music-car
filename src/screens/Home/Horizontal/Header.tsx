import { TouchableOpacity, View } from 'react-native'
// import Button from '@/components/common/Button'
// import { navigations } from '@/navigation'
// import { BorderWidths } from '@/theme'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import StatusBar from '@/components/common/StatusBar'
import { useSettingValue } from '@/store/setting/hook'
import { scaleSizeH } from '@/utils/pixelRatio'
import { HEADER_HEIGHT as _HEADER_HEIGHT } from '@/config/constant'
import { type InitState as CommonState } from '@/store/common/state'
import SearchTypeSelector from '@/screens/Home/Views/Search/SearchTypeSelector'
import { Icon } from '@/components/common/Icon'
import { useTheme } from '@/store/theme/hook'
import { setTheme } from '@/core/theme'
import { isCarEdition } from '@/utils/nativeModules/utils'

const headerComponents: Partial<Record<CommonState['navActiveId'], React.ReactNode>> = {
  nav_search: <SearchTypeSelector />,
}

const HEADER_HEIGHT = isCarEdition ? 72 : _HEADER_HEIGHT * 0.8

const ThemeToggle = () => {
  const theme = useTheme()
  const lightThemeId = useSettingValue('theme.lightId')
  const darkThemeId = useSettingValue('theme.darkId')

  return (
    <TouchableOpacity
      style={styles.themeToggle}
      activeOpacity={0.6}
      onPress={() => { setTheme(theme.isDark ? lightThemeId : darkThemeId) }}>
      <Icon name="setting" size={isCarEdition ? 26 : 18} color={theme['c-font']} />
      <Text size={isCarEdition ? 16 : 13} color={theme['c-font']}>{theme.isDark ? '日间' : '夜间'}</Text>
    </TouchableOpacity>
  )
}


// const LeftTitle = () => {
//   const id = useNavActiveId()
//   const t = useI18n()

//   return <Text style={styles.leftTitle} size={18}>{t(id)}</Text>
// }
const LeftHeader = () => {
  const id = useNavActiveId()
  const t = useI18n()
  const statusBarHeight = useStatusbarHeight()

  return (
    <View style={{
      ...styles.container,
      height: scaleSizeH(HEADER_HEIGHT) + statusBarHeight,
      paddingTop: statusBarHeight,
    }}>
      <View style={styles.left}>
        <Text style={styles.leftTitle} size={isCarEdition ? 24 : 18}>{t(id)}</Text>
      </View>
      {headerComponents[id] ?? null}
      {isCarEdition ? <DriveBadge /> : <ThemeToggle />}

      {/* <TouchableOpacity style={styles.btn} onPress={openSetting}>
        <Icon style={{ ...styles.btnText, color: theme['c-font'] }} name="setting" size={styles.btnText.fontSize} />
      </TouchableOpacity> */}
    </View>
  )
}


// const RightTitle = () => {
//   const id = useNavActiveId()
//   const t = useI18n()

//   return <Text style={styles.rightTitle} size={18}>{t(id)}</Text>
// }
const RightHeader = () => {
  const t = useI18n()
  const id = useNavActiveId()
  const statusBarHeight = useStatusbarHeight()

  return (
    <View style={{
      ...styles.container,
      height: scaleSizeH(HEADER_HEIGHT) + statusBarHeight,
      paddingTop: statusBarHeight,
    }}>
      <View style={styles.left}>
        <Text style={styles.rightTitle} size={isCarEdition ? 24 : 18}>{t(id)}</Text>
      </View>
      {headerComponents[id] ?? null}
      {isCarEdition ? <DriveBadge /> : <ThemeToggle />}
      {/* <TouchableOpacity style={styles.btn} onPress={openSetting}>
        <Icon style={{ ...styles.btnText, color: theme['c-font'] }} name="setting" size={styles.btnText.fontSize} />
      </TouchableOpacity> */}
    </View>
  )
}

const DriveBadge = () => {
  return (
    <View style={styles.driveBadge}>
      <Icon name="logo" size={22} color="#35D7C2" />
      <Text size={14} color="#B8C7D5">LX DRIVE</Text>
    </View>
  )
}

const Header = () => {
  const drawerLayoutPosition = useSettingValue('common.drawerLayoutPosition')

  return (
    <>
      <StatusBar />
      {
        drawerLayoutPosition == 'left'
          ? <LeftHeader />
          : <RightHeader />
      }

    </>
  )
}


const styles = createStyle({
  container: {
    // width: '100%',
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 10,
    backgroundColor: isCarEdition ? '#101923' : undefined,
    borderBottomWidth: isCarEdition ? 1 : 0,
    borderBottomColor: isCarEdition ? '#253443' : undefined,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 5,
    alignItems: 'center',
    height: '100%',
    // backgroundColor: 'rgba(0,0,0,0.1)',
  },
  btn: {
    // flex: 1,
    width: HEADER_HEIGHT,
    // backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  titleBtn: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.1)',
    height: '100%',
    justifyContent: 'center',
  },
  leftTitle: {
    paddingLeft: isCarEdition ? 24 : 10,
    paddingRight: 16,
  },
  rightTitle: {
    paddingLeft: isCarEdition ? 24 : 16,
    paddingRight: 16,
  },
  themeToggle: {
    height: '100%',
    minWidth: isCarEdition ? 112 : 66,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  driveBadge: {
    minWidth: 132,
    height: '100%',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
})

export default Header
