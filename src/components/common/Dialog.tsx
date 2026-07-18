import { useImperativeHandle, forwardRef, useMemo, useRef } from 'react'
import { View, TouchableHighlight } from 'react-native'

import Modal, { type ModalType } from './Modal'
import { Icon } from '@/components/common/Icon'
import { useKeyboard } from '@/utils/hooks'
import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import Text from './Text'
import { scaleSizeH } from '@/utils/pixelRatio'
import { isCarEdition } from '@/utils/nativeModules/utils'
import { getCarTheme } from '@/theme/car'

const HEADER_HEIGHT = isCarEdition ? 56 : 20
const styles = createStyle({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    maxWidth: '90%',
    minWidth: '60%',
    maxHeight: '78%',
    // backgroundColor: 'white',
    borderRadius: isCarEdition ? 12 : 4,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'row',
    borderTopLeftRadius: isCarEdition ? 12 : 4,
    borderTopRightRadius: isCarEdition ? 12 : 4,
    height: HEADER_HEIGHT,
  },
  title: {
    paddingLeft: isCarEdition ? 20 : 5,
    paddingRight: isCarEdition ? 64 : 25,
    lineHeight: HEADER_HEIGHT,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    borderTopRightRadius: 4,
    flexGrow: 0,
    flexShrink: 0,
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export interface DialogProps {
  onHide?: () => void
  keyHide?: boolean
  bgHide?: boolean
  closeBtn?: boolean
  title?: string
  children: React.ReactNode | React.ReactNode[]
  height?: number | `${number}%`
}

export interface DialogType {
  setVisible: (visible: boolean) => void
}

export default forwardRef<DialogType, DialogProps>(({
  onHide,
  keyHide = true,
  bgHide = true,
  closeBtn = true,
  title = '',
  children,
  height,
}: DialogProps, ref) => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)
  const { keyboardShown, keyboardHeight } = useKeyboard()
  const modalRef = useRef<ModalType>(null)

  useImperativeHandle(ref, () => ({
    setVisible(visible: boolean) {
      modalRef.current?.setVisible(visible)
    },
  }))

  const closeBtnComponent = useMemo(() => {
    return closeBtn
      ? <TouchableHighlight style={{ ...styles.closeBtn, width: scaleSizeH(HEADER_HEIGHT) }} underlayColor={isCarEdition ? carTheme.active : theme['c-primary-dark-200-alpha-600']} onPress={() => modalRef.current?.setVisible(false)}>
          <Icon name="close" color={isCarEdition ? carTheme.textMuted : theme['c-primary-dark-500-alpha-500']} size={isCarEdition ? 20 : 10} />
        </TouchableHighlight>
      : null
  }, [carTheme.active, carTheme.textMuted, closeBtn, theme])

  return (
    <Modal onHide={onHide} keyHide={keyHide} bgHide={bgHide} bgColor="rgba(50,50,50,.3)" ref={modalRef}>
      <View style={{ ...styles.centeredView, paddingBottom: keyboardShown ? keyboardHeight : 0 }}>
        <View style={{ ...styles.modalView, height, backgroundColor: isCarEdition ? carTheme.surface : theme['c-content-background'] }} onStartShouldSetResponder={() => true}>
          <View style={{ ...styles.header, backgroundColor: isCarEdition ? carTheme.active : theme['c-primary-light-100-alpha-100'] }}>
            <Text style={styles.title} size={isCarEdition ? 19 : 13} color={isCarEdition ? carTheme.text : theme['c-primary-light-1000']} numberOfLines={1}>{title}</Text>
            {closeBtnComponent}
          </View>
          {children}
        </View>
      </View>
    </Modal>
  )
})
