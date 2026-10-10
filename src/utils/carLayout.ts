/** Car dimensions are density-independent pixels, not phone design ratios. */
export const CAR_LAYOUT = {
  songHeight: 84,
  touchSize: 76,
  titleSize: 22,
  subtitleSize: 16,
  gutter: 16,
  gap: 16,
  playlistMinWidth: 300,
  playlistRowHeight: 76,
  playlistHeight: 112,
  playlistCover: 96,
  playerHeight: 124,
  playerCover: 76,
} as const

export const getCarMusicRows = (contentWidth: number) => {
  const columns = contentWidth >= 1080 ? 2 : 1
  return { rowNum: columns, rowWidth: columns == 2 ? '50%' as const : '100%' as const }
}

export const getCarPlaylistGrid = (contentWidth: number) => {
  const innerWidth = Math.max(0, contentWidth - CAR_LAYOUT.gutter * 2)
  const columns = Math.max(1, Math.min(3, Math.floor((innerWidth + CAR_LAYOUT.gap) / (CAR_LAYOUT.playlistMinWidth + CAR_LAYOUT.gap))))
  return { num: columns, width: Math.max(0, (innerWidth - (columns - 1) * CAR_LAYOUT.gap) / columns) }
}

export const getCarPlayerLayout = (contentWidth: number) => {
  const stacked = contentWidth > 0 && contentWidth < 560
  return { stacked, minHeight: stacked ? 212 : CAR_LAYOUT.playerHeight }
}
