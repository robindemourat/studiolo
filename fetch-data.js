const fs = require('fs-extra');
const get = require('axios').get;
const Tabletop = require('tabletop');
const url= require('./config').dataKey;
const dataFolder = 'data';

function getSpreadsheet(publicSpreadsheetUrl, simpleSheet) {
  return new Promise((resolve, reject) => {
    try{
      Tabletop.init({ 
        key: publicSpreadsheetUrl,
        callback: (data, tabletop) => {
          resolve(data);
        } ,
        simpleSheet 
      })
    } catch(err) {
      reject(err);
    }
  });
}

function fetchImage(url) {
  return get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => new Buffer(response.data, 'binary'))
}

function saveImage(url, filePath) {
  console.log('saving image %s from %s', filePath, url);
  return fetchImage(url)
            .then(buffer => fs.writeFile(filePath, buffer))
}

function saveImages (data) {
  return new Promise((resolve, reject) => {
    const imagesToDownload = [];
    const newData = Object.keys(data).reduce((res, key) => ({
      ...res,
      [key]: data[key].map(element => {
        if (typeof element.images === 'string' && element.images.trim().length > 0) {
          const images = element.images.trim().split(',').map(s => s.trim());
          const localImages = [];
          images.forEach(url => {
            const fileName = url.split('/').reverse()[0];
            const filePath = `${dataFolder}/${fileName}`;
            imagesToDownload.push({
              url,
              fileName,
              filePath,
            });
            localImages.push(filePath)
          })
          return {
            ...element,
            images: localImages
          }
        } else {
          return element;
        }
      })
    }), {})

    Promise.all(imagesToDownload.map(i => saveImage(i.url, i.filePath)))
      .then(() => resolve(newData))
  });
}

function detabletopify(data) {
  return new Promise((resolve, reject) => {
    resolve(
      Object.keys(data).reduce((res, key) => ({
        ...res,
        [key]: data[key].elements.map(element => ({
          ...element,
          collection: key
        })),
      }), {})
    )
  });
}

fs
  .ensureDir('data')
  .then(() => getSpreadsheet(url, false))
  .then(data => detabletopify(data))
  .then(data => saveImages(data))
  .then(data => fs.writeFile(`${dataFolder}/data.json`, JSON.stringify(data)))
  .then(d => console.info('data written'))
  .catch(error => console.error(error))