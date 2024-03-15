import restApi from "./strapi-rest-api"

let cachedSettings = null

const getSettings = async () => {
  if (cachedSettings) {
    return cachedSettings
  }

  cachedSettings = await restApi.getByType('setting')

  return cachedSettings
}

const getLinksToOpenNewTab = async () => {
  if (process.env.PROJECT !== 'noho') {
    return []
  }
  
  const settings = await getSettings()

  const usList = settings[0].external_links || ''
  const nzList = settings[1].external_links || ''

  return [...usList.split('\n'), ...nzList.split('\n')].filter((element) => element !== '');
}

export {
  getSettings,
  getLinksToOpenNewTab
}