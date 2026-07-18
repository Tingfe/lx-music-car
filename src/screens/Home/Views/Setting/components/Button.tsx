import { memo } from 'react'

import Button, { type BtnProps } from '@/components/common/Button'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { isCarEdition } from '@/utils/nativeModules/utils'

type ButtonProps = BtnProps

export default memo(({ disabled, onPress, children }: ButtonProps) => {
  const theme = useTheme()

  return (
    <Button style={{ ...styles.button, backgroundColor: theme['c-button-background'] }} onPress={onPress} disabled={disabled}>
      <Text size={isCarEdition ? 17 : 14} color={theme['c-button-font']}>{children}</Text>
    </Button>
  )
})

const styles = createStyle({
  button: {
    paddingLeft: isCarEdition ? 18 : 10,
    paddingRight: isCarEdition ? 18 : 10,
    paddingTop: isCarEdition ? 12 : 5,
    paddingBottom: isCarEdition ? 12 : 5,
    minHeight: isCarEdition ? 52 : undefined,
    borderRadius: 4,
    marginRight: 10,
  },
})
