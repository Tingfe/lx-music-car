import { View } from 'react-native'

import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import { isCarEdition } from '@/utils/nativeModules/utils'
import { getCarTheme } from '@/theme/car'
import Text from '@/components/common/Text'


interface Props {
  title: string
  children: React.ReactNode | React.ReactNode[]
}

export default ({ title, children }: Props) => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.title, borderLeftColor: isCarEdition ? carTheme.accent : theme['c-primary'] }} size={isCarEdition ? 18 : 16} >{title}</Text>
      <View>
        {children}
      </View>
    </View>
  )
}


const styles = createStyle({
  container: {
    // paddingLeft: 10,
    marginBottom: isCarEdition ? 20 : 0,
  },
  title: {
    borderLeftWidth: 5,
    paddingLeft: 12,
    marginBottom: 10,
    // lineHeight: 16,
  },
})
