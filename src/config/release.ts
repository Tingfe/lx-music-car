export const RELEASE_REPOSITORY = 'Tingfe/lx-music-car'
export const RELEASES_URL = `https://github.com/${RELEASE_REPOSITORY}/releases`
export const LATEST_RELEASE_API_URL = `https://api.github.com/repos/${RELEASE_REPOSITORY}/releases/latest`
export const RELEASES_API_URL = `https://api.github.com/repos/${RELEASE_REPOSITORY}/releases`
export const RELEASE_MANIFEST_URLS = [
  `https://fastly.jsdelivr.net/gh/${RELEASE_REPOSITORY}@release-info/car.json`,
  `https://gcore.jsdelivr.net/gh/${RELEASE_REPOSITORY}@release-info/car.json`,
  `https://cdn.jsdelivr.net/gh/${RELEASE_REPOSITORY}@release-info/car.json`,
  `https://raw.githubusercontent.com/${RELEASE_REPOSITORY}/release-info/car.json`,
]
