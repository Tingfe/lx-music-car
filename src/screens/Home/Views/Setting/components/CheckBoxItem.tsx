import { memo } from 'react'

import { View } from 'react-native'

import CheckBox, { type CheckBoxProps } from '@/components/common/CheckBox'
import { createStyle } from '@/utils/tools'
import { isCarEdition } from '@/utils/nativeModules/utils'


export default memo((props: CheckBoxProps) => {
  return (
    <View style={styles.container}>
      <CheckBox {...props} />
    </View>
  )
})

const styles = createStyle({
  container: {
    paddingLeft: isCarEdition ? 0 : 25,
    // marginTop: -10,
    // marginBottom: 0,
  },
})
