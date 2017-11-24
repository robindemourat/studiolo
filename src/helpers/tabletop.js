
import Tabletop from 'tabletop';

/**
 * @param {string} key - url or key to feed tabletop with
 * @param {boolean} simpleSheet - whether to parse several tabs
 * @return {Promise} promise
 */
export default function get(publicSpreadsheetUrl, simpleSheet) {

  return new Promise((resolve, reject) => {
    try {
      Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: data => {
          resolve(data);
        },
        simpleSheet
      });
    }
 catch (err) {
      reject(err);
    }
  });
}
