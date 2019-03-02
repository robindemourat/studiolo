const fs = require('fs-extra');
const genId = require('uuid').v4;
const get = require('axios').get;
const Tabletop = require('tabletop');
const url= require('./config').dataKey;
const getImageUri = require('./src/helpers/image-uri');
const dataFolder = 'data';
const basePath = require('./package.json').homepage;

function getSpreadsheet(publicSpreadsheetUrl, simpleSheet) {
  return new Promise((resolve, reject) => {
    console.log('getting spreadsheet');
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
  const uri = getImageUri(url, 'original');
  return get(uri, {
      responseType: 'arraybuffer',
      timeout: 10000
    })
    .then(response => new Buffer(response.data, 'binary'))
    .catch(e => {
      console.log('error with %s', uri, e.message);
    })
}

function saveImage(url, filePath) {
  console.info('saving image %s from %s', filePath, url);
  return fetchImage(url)
            .then(buffer => {
              console.log('done, writing');
              return fs.writeFile(filePath, buffer)
            })
}

function saveImages (data) {
  console.log('save images');
  return new Promise((resolve, reject) => {
    const imagesToDownload = [];
    const newData = Object.keys(data).reduce((res, key) => ({
      ...res,
      [key]: data[key].map(element => {
        if (typeof element.images === 'string' && element.images.trim().length > 0) {
          const images = element.images.trim().split(',').map(s => s.trim());
          const localImages = [];
          images.forEach(url => {
            const id = genId();
            let end = url.split('/').reverse()[0];
            const ext = end.indexOf('.') > -1 ? end.split('.').pop() : 'png';
            const fileName = `${id}.${ext}`
            // if (fileName.indexOf('.') === -1) {
            //   fileName += '.png';
            // }
            // console.log('filename', fileName);
            const filePath = `${dataFolder}/${fileName}`;
            imagesToDownload.push({
              url,
              fileName,
              filePath,
            });
            localImages.push(filePath)
          })
            // console.log('local images', localImages);
          return {
            ...element,
            images: localImages.map(path => `${basePath}${path}`)
          }
        } else {
          return element;
        }
      })
    }), {})

    imagesToDownload.reduce((cur, image, index) => {
      return cur
        .then(() => {
          
          return saveImage(image.url, image.filePath)
        })
    }, Promise.resolve())
    .then(() => resolve(newData))
    .catch(e => {
      console.log('oups', e);
    })

  //   Promise.all(imagesToDownload.map(i => saveImage(i.url, i.filePath)))
  //     .then(() => resolve(newData))
  //     .catch(e => {
  //       console.log('error while fetching image');
  //       console.error(e);
  //     })
  });
}

function detabletopify(data) {
  console.log('detabletopify');
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
  .remove('data')
  .then(() => fs.ensureDir('data'))
  .then(() => getSpreadsheet(url, false))
  .then(data => detabletopify(data))
  .then(data => saveImages(data))
  .then(data => fs.writeFile(`${dataFolder}/data.json`, JSON.stringify(data)))
  .then(d => console.info('data written'))
  .catch(error => console.error(error))