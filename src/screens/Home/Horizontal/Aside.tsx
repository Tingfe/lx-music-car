import { memo } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useTheme } from '@/store/theme/hook'
import { Icon } from '@/components/common/Icon'
import { confirmDialog, createStyle, exitApp as backHome } from '@/utils/tools'
import { NAV_MENUS } from '@/config/constant'
import type { InitState } from '@/store/common/state'
// import commonState from '@/store/common/state'
import { exitApp, setNavActiveId } from '@/core/common'
import { BorderWidths } from '@/theme'
import { useSettingValue } from '@/store/setting/hook'
import Text from '@/components/common/Text'
import { useI18n } from '@/lang'
import { isCarEdition } from '@/utils/nativeModules/utils'
import { getCarTheme } from '@/theme/car'

const NAV_WIDTH = isCarEdition ? 164 : 68
const MENU_HEIGHT = isCarEdition ? 76 : undefined

const styles = createStyle({
  container: {
    flexGrow: 0,
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 10,
    borderRightWidth: BorderWidths.normal,
    paddingBottom: 10,
    width: NAV_WIDTH,
  },
  header: {
    paddingTop: isCarEdition ? 18 : 15,
    paddingBottom: isCarEdition ? 18 : 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  menus: {
    flex: 1,
  },
  list: {
    paddingBottom: isCarEdition ? 8 : 15,
  },
  menuItem: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    // paddingLeft: 25,
    // paddingRight: 25,
    justifyContent: isCarEdition ? 'flex-start' : 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  carMenuItem: {
    minHeight: MENU_HEIGHT,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  iconContent: {
    // width: 24,
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
  },
  text: {
    paddingLeft: isCarEdition ? 18 : 15,
    // fontWeight: '500',
  },
})

const Header = () => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)
  const statusBarHeight = useStatusbarHeight()
  return (
    <View style={{ paddingTop: statusBarHeight }}>
      <View style={styles.header}>
        <Icon name="logo" color={isCarEdition ? carTheme.accent : theme['c-primary-dark-100-alpha-300']} size={isCarEdition ? 28 : 22} />
        {isCarEdition ? <Text style={styles.headerText} size={15} color={carTheme.text}>LX DRIVE</Text> : null}
      </View>
    </View>
  )
}

type IdType = InitState['navActiveId'] | 'nav_exit' | 'back_home'

const MenuItem = ({ id, icon, onPress }: {
  id: IdType
  icon: string
  onPress: (id: IdType) => void
}) => {
  const t = useI18n()
  const activeId = useNavActiveId()
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)

  const itemStyle = [styles.menuItem, isCarEdition ? styles.carMenuItem : null]
  const iconSize = isCarEdition ? 32 : 20
  const activeBackground = isCarEdition ? { backgroundColor: carTheme.active, borderLeftWidth: 4, borderLeftColor: carTheme.accent, paddingLeft: 16 } : null

  return activeId == id
    ? <View style={[itemStyle, activeBackground]}>
        <View style={styles.iconContent}>
          <Icon name={icon} size={iconSize} color={isCarEdition ? carTheme.accent : theme['c-primary-font-active']} />
        </View>
        {isCarEdition ? <Text style={styles.text} size={17} color={carTheme.text}>{t(id)}</Text> : null}
      </View>
    : <TouchableOpacity style={itemStyle} onPress={() => { onPress(id) }}>
        <View style={styles.iconContent}>
          <Icon name={icon} size={iconSize} color={isCarEdition ? carTheme.iconMuted : theme['c-font-label']} />
        </View>
        {isCarEdition ? <Text style={styles.text} size={17} color={carTheme.textMuted}>{t(id)}</Text> : null}
      </TouchableOpacity>
}

export default memo(() => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)
  // console.log('render drawer nav')
  const showBackBtn = useSettingValue('common.showBackBtn')
  const showExitBtn = useSettingValue('common.showExitBtn')
  const primaryMenus = isCarEdition ? NAV_MENUS.filter(menu => menu.id != 'nav_setting') : NAV_MENUS
  const settingMenu = isCarEdition ? NAV_MENUS.find(menu => menu.id == 'nav_setting') : null

  const handlePress = (id: IdType) => {
    switch (id) {
      case 'nav_exit':
        void confirmDialog({
          message: global.i18n.t('exit_app_tip'),
          confirmButtonText: global.i18n.t('list_remove_tip_button'),
        }).then(isExit => {
          if (!isExit) return
          exitApp('Exit Btn')
        })
        return
      case 'back_home':
        backHome()
        return
    }

    global.app_event.changeMenuVisible(false)
    setNavActiveId(id)
  }

  return (
    <View style={{ ...styles.container, backgroundColor: isCarEdition ? carTheme.nav : undefined, borderRightColor: isCarEdition ? carTheme.border : theme['c-border-background'] }}>
      <Header />
      <ScrollView style={styles.menus} scrollEnabled={!isCarEdition}>
        <View style={styles.list}>
          {primaryMenus.map(menu => <MenuItem key={menu.id} id={menu.id} icon={menu.icon} onPress={handlePress} />)}
        </View>
      </ScrollView>
      {settingMenu ? <MenuItem id={settingMenu.id} icon={settingMenu.icon} onPress={handlePress} /> : null}
      {
        showBackBtn ? <MenuItem id="back_home" icon="home" onPress={handlePress} /> : null
      }
      {
        showExitBtn ? <MenuItem id="nav_exit" icon="exit2" onPress={handlePress} /> : null
      }
    </View>
  )
})
