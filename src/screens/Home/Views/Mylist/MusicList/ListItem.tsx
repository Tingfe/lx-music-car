import { memo, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { LIST_ITEM_HEIGHT } from '@/config/constant'
// import { BorderWidths } from '@/theme'
import { Icon } from '@/components/common/Icon'
import { createStyle, type RowInfo } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import { useAssertApiSupport } from '@/store/common/hook'
import { scaleSizeH } from '@/utils/pixelRatio'
import Text from '@/components/common/Text'
import Badge from '@/components/common/Badge'
import { isCarEdition } from '@/utils/nativeModules/utils'
import { getCarTheme } from '@/theme/car'
import { CAR_LAYOUT } from '@/utils/carLayout'

export const ITEM_HEIGHT = isCarEdition ? CAR_LAYOUT.songHeight : scaleSizeH(LIST_ITEM_HEIGHT)


export default memo(({ item, index, activeIndex, onPress, onShowMenu, onLongPress, selectedList, rowInfo, isShowAlbumName, isShowInterval }: {
  item: LX.Music.MusicInfo
  index: number
  activeIndex: number
  onPress: (item: LX.Music.MusicInfo, index: number) => void
  onLongPress: (item: LX.Music.MusicInfo, index: number) => void
  onShowMenu: (item: LX.Music.MusicInfo, index: number, position: { x: number, y: number, w: number, h: number }) => void
  selectedList: LX.Music.MusicInfo[]
  rowInfo: RowInfo
  isShowAlbumName: boolean
  isShowInterval: boolean
}) => {
  const theme = useTheme()
  const carTheme = getCarTheme(theme.isDark)

  const isSelected = selectedList.includes(item)
  // console.log(item.name, selectedList, selectedList.includes(item))
  const isSupported = useAssertApiSupport(item.source)
  const moreButtonRef = useRef<TouchableOpacity>(null)
  const handleShowMenu = () => {
    if (moreButtonRef.current?.measure) {
      moreButtonRef.current.measure((fx, fy, width, height, px, py) => {
        // console.log(fx, fy, width, height, px, py)
        onShowMenu(item, index, { x: Math.ceil(px), y: Math.ceil(py), w: Math.ceil(width), h: Math.ceil(height) })
      })
    }
  }
  const active = activeIndex == index

  const singer = `${item.singer}${isShowAlbumName && item.meta.albumName ? ` · ${item.meta.albumName}` : ''}`

  return (
    <View style={{ ...styles.listItem, width: rowInfo.rowWidth, height: ITEM_HEIGHT, backgroundColor: isCarEdition ? (isSelected || active ? carTheme.active : carTheme.page) : (isSelected ? theme['c-primary-background-hover'] : 'rgba(0,0,0,0)'), borderBottomColor: isCarEdition ? carTheme.border : 'transparent', opacity: isCarEdition || isSupported ? 1 : 0.5 }}>
      <TouchableOpacity style={styles.listItemLeft} accessibilityRole="button" accessibilityLabel={`${item.name}，${item.singer}，播放`} onPress={() => { onPress(item, index) }} onLongPress={() => { onLongPress(item, index) }}>
        {
          active
            ? <Icon style={styles.sn} name="play-outline" size={isCarEdition ? 19 : 13} color={isCarEdition ? carTheme.accent : theme['c-primary-font']} />
            : <Text style={styles.sn} size={isCarEdition ? 15 : 13} color={isCarEdition ? carTheme.iconMuted : theme['c-300']}>{index + 1}</Text>
        }
        <View style={styles.itemInfo}>
          {/* <View style={styles.listItemTitle}> */}
          <Text size={isCarEdition ? CAR_LAYOUT.titleSize : undefined} style={isCarEdition ? { fontWeight: '500' } : undefined} color={active ? (isCarEdition ? carTheme.accent : theme['c-primary-font']) : (isCarEdition ? carTheme.text : theme['c-font'])} numberOfLines={1}>{item.name}</Text>
          {/* </View> */}
          <View style={styles.listItemSingle}>
            {!isCarEdition ? <Badge>{item.source.toUpperCase()}</Badge> : null}
            <Text style={styles.listItemSingleText} size={isCarEdition ? CAR_LAYOUT.subtitleSize : 11} color={isCarEdition ? carTheme.textMuted : (active ? theme['c-primary-alpha-200'] : theme['c-500'])} numberOfLines={1}>
              {isCarEdition && !isSupported ? `音源不可用 · ${singer}` : singer}
            </Text>
          </View>
        </View>
        {
          isShowInterval ? (
            <Text style={isCarEdition ? { paddingLeft: 8, flexShrink: 0 } : undefined} size={isCarEdition ? 16 : 12} color={active ? (isCarEdition ? carTheme.accent : theme['c-primary-alpha-400']) : (isCarEdition ? carTheme.iconMuted : theme['c-250'])} numberOfLines={1}>{item.interval}</Text>
          ) : null
        }
      </TouchableOpacity>
      {/* <View style={styles.listItemRight}> */}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${item.name}，更多操作`} onPress={handleShowMenu} ref={moreButtonRef} style={styles.moreButton}>
        <Icon name="dots-vertical" style={{ color: isCarEdition ? carTheme.iconMuted : theme['c-350'] }} size={isCarEdition ? 18 : 12} />
      </TouchableOpacity>
      {/* </View> */}
    </View>
  )
}, (prevProps, nextProps) => {
  return !!(prevProps.item === nextProps.item &&
    prevProps.index === nextProps.index &&
    prevProps.isShowAlbumName === nextProps.isShowAlbumName &&
    prevProps.isShowInterval === nextProps.isShowInterval &&
    prevProps.rowInfo.rowWidth === nextProps.rowInfo.rowWidth &&
    prevProps.activeIndex != nextProps.index &&
    nextProps.activeIndex != nextProps.index &&
    nextProps.selectedList.includes(nextProps.item) == prevProps.selectedList.includes(nextProps.item)
  )
})


const styles = createStyle({
  listItem: {
    // width: '50%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    // paddingLeft: 10,
    paddingRight: 2,
    alignItems: 'center',
    borderBottomWidth: isCarEdition ? 1 : 0,
  },
  listItemLeft: {
    height: isCarEdition ? '100%' : undefined,
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sn: {
    width: 38,
    // fontSize: 12,
    textAlign: 'center',
    // backgroundColor: 'rgba(0,0,0,0.2)',
    paddingLeft: 3,
    paddingRight: 3,
  },
  itemInfo: {
    minWidth: isCarEdition ? 0 : undefined,
    flexGrow: 1,
    flexShrink: 1,
    // paddingTop: 10,
    // paddingBottom: 10,
    paddingRight: 2,
  },
  // listItemTitle: {
  //   flexGrow: 0,
  //   flexShrink: 1,
  // },
  listItemSingle: {
    paddingTop: 3,
    flexDirection: 'row',
    // alignItems: 'flex-end',
  },
  listItemSingleText: {
    // backgroundColor: 'rgba(0,0,0,0.2)',
    flexGrow: 0,
    flexShrink: 1,
    fontWeight: isCarEdition ? '400' : '300',
    // fontSize: 15,
  },
  // listItemBadge: {
  //   // fontSize: 10,
  //   paddingLeft: 5,
  //   paddingTop: 2,
  //   alignSelf: 'flex-start',
  // },
  listItemRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    justifyContent: 'center',
  },

  moreButton: {
    width: isCarEdition ? CAR_LAYOUT.touchSize : undefined,
    alignItems: 'center',
    height: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    // paddingTop: 10,
    // paddingBottom: 10,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
  },
})
