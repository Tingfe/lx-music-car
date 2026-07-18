import { storageDataPrefix } from '@/config/constant'
import { getData, saveData } from '@/plugins/storage'

const maxPinnedLists = 4

export const getDrivePinnedListIds = async() => {
  return (await getData<string[]>(storageDataPrefix.drivePinnedLists)) ?? []
}

export const toggleDrivePinnedList = async(id: string) => {
  const current = await getDrivePinnedListIds()
  const next = current.includes(id)
    ? current.filter(item => item !== id)
    : [...current, id].slice(-maxPinnedLists)
  await saveData(storageDataPrefix.drivePinnedLists, next)
  global.app_event.drivePinnedListsUpdated(next)
  return next
}
