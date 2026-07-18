import { memo } from 'react'

import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import { isCarEdition } from '@/utils/nativeModules/utils'

export default memo(({ title, children }: {
  title: string
  children: React.ReactNode | React.ReactNode[]
}) => {
  return (
    <View style={{ ...styles.container, paddingLeft: isCarEdition ? 0 : 25, marginBottom: isCarEdition ? 24 : 18 }}>
      <Text style={styles.title} size={isCarEdition ? 17 : undefined}>{title}</Text>
      {children}
    </View>
  )
})


const styles = createStyle({
  container: {
    paddingLeft: 25,
    marginBottom: 18,
  },
  title: {
    marginLeft: -10,
    marginBottom: 10,
    // lineHeight: 16,
  },
})
