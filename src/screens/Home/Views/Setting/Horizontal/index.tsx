import { useRef } from 'react'
import { ScrollView, View } from 'react-native'
import NavList from './NavList'
import Main, { type MainType } from '../Main'
import { createStyle } from '@/utils/tools'
import { BorderWidths } from '@/theme'
import { useTheme } from '@/store/theme/hook'
import { isCarEdition } from '@/utils/nativeModules/utils'
import { getCarTheme } from '@/theme/car'

const styles = createStyle({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: BorderWidths.normal,
  },
  nav: {
    height: '100%',
    width: isCarEdition ? '23%' : '22%',
    minWidth: isCarEdition ? 160 : undefined,
    maxWidth: isCarEdition ? 216 : undefined,
    borderRightWidth: BorderWidths.normal,
  },
  main: {
    paddingLeft: isCarEdition ? 20 : 15,
    paddingRight: isCarEdition ? 20 : 15,
    paddingTop: isCarEdition ? 20 : 15,
    paddingBottom: isCarEdition ? 20 : 15,
    flex: 0,
  },
})

export default () => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)
  const mainRef = useRef<MainType>(null)

  return (
    <View style={{ ...styles.container, backgroundColor: isCarEdition ? carTheme.page : undefined, borderTopColor: isCarEdition ? carTheme.border : theme['c-border-background'] }}>
      <View style={{ ...styles.nav, backgroundColor: isCarEdition ? carTheme.surface : undefined, borderRightColor: isCarEdition ? carTheme.border : theme['c-border-background'] }}>
        <NavList onChangeId={(id) => mainRef.current?.setActiveId(id)} />
      </View>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'always'}>
        <View style={styles.main}>
          <Main ref={mainRef} />
        </View>
      </ScrollView>
    </View>
  )
}
