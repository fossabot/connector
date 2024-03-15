import restApi from "./strapi-rest-api"
import crypto from "crypto"
import edjsHTML from "editorjs-html"
import { getLinksToOpenNewTab, getSettings } from "./strapi-settings"
const edjsParser = edjsHTML()

const getProducts = async () => {
  try {
    return (await replaceUploads(await restApi.getProducts()))
  } catch (error) {
    /** @todo It should be logged */
  }

  return []
}

const getCollections = async () => {
  try {
    return (await replaceUploads(await restApi.getCollections()))
  } catch (error) {
    /** @todo It should be logged */
  }

  return []
}

const getByType = async (collectionName) => {
  return (await replaceUploads(await restApi.getByType(collectionName)))
}

const replaceUploads = async (obj) => {
  var jsonString = JSON.stringify(obj);
  var modifiedJsonString = jsonString.replace(/\/uploads\//g, `${process.env.STRAPI_URL}/uploads/`);
  var modifiedObject = JSON.parse(modifiedJsonString);

  return (await parseJSONProperties(modifiedObject));
}

const parseJSONProperties = async (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    const parsedObjects = await Promise.all(obj.map(parseJSONProperties));

    return parsedObjects;
  }

  const linksToOpenNewTab = await getLinksToOpenNewTab()

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        try {

          const parsedValue = JSON.parse(value);

          function rawParser(block) {
            return `<div> ${block.data.html.replace(/\\"/g, '"').replace(/\\n/g, '')} </div>`;
          }

          const formattedEditor = edjsHTML({ raw: rawParser }).parse(parsedValue);
          obj[key] = await parseJSONProperties(parsedValue);

          const modifiedHtmlString = formattedEditor.join('').replace(/<a\s+[^>]*href="([^"]+)"[^>]*>/gi, (match, href) => {
            const shouldAddTarget = linksToOpenNewTab.some(domain => href.includes(domain));
            return shouldAddTarget ? match.replace('<a', '<a target="_blank"') : match;
          });

          obj[`${key}_parsed`] = modifiedHtmlString;

        } catch (error) {
          console.error(`Unable to parse object:`)
          console.error(obj[key])
          console.error(error)
        }
      } else if (key === 'id') {
        obj[key] = await parseJSONProperties(value);
        obj['uuid'] = 'a' + crypto.createHash('md5').update(String(value)).digest('hex').substring(0, 10);
      } else {
        obj[key] = await parseJSONProperties(value);
      }
    }
  }

  return obj;
}

const getLocalePrefixByCode = (code) => {
  if (code === 'en-NZ') {
    return 'nz'
  }
  
  if (code === 'en-GB') {
    return 'uk'
  }

  return 'us'
}

export {
  getProducts,
  getCollections,
  getByType,
  getLocalePrefixByCode
}