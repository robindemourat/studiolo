const fs = require('fs-extra');
const colors = require('colors');
const genId = require('uuid').v4;
const get = require('axios').get;
const Tabletop = require('tabletop');
const url= require('./config').dataKey;
const getImageUri = require('./src/helpers/image-uri');
const dataFolder = 'data';
const basePath = require('./package.json').homepage;

function getSpreadsheet(publicSpreadsheetUrl, simpleSheet) {
  return new Promise((resolve, reject) => {
    console.log('getting spreadsheet'.bgBlue);
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
  return new Promise((res, rej) => {
    get(uri, {
        responseType: 'arraybuffer',
        timeout: 10000
      })
      .then(response => res(new Buffer(response.data, 'binary')))
      .catch(e => {
        console.log(colors.red('error with %s'), uri, e.message);
        rej(e);
      })
  })
    
}

function saveImage(url, filePath, index, number) {
  console.info(colors.cyan('%s/%s - saving image %s from %s'), index, number, filePath, url);
  return new Promise((res, rej) => {
    fetchImage(url)
      .then(buffer => {
      console.log('done, writing image to %s'.green, filePath);
      return fs.writeFile(filePath, buffer)
    })
    .then(res)
    .catch(rej);
  }) 
}

function saveImages (data) {
  console.log('save images'.bgBlue);
  return new Promise((resolve, reject) => {
    const imagesToDownload = [];
    const newData = Object.keys(data).reduce((res, key) => ({
      ...res,
      [key]: data[key].map((element, elementIndex) => {
        if (typeof element.images === 'string' && element.images.trim().length > 0) {
          const images = element.images.trim().split(',').map(s => s.trim());
          const localImages = [];
          images.forEach((url, imageIndex) => {
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
              collection: key,
              elementIndex,
              imageIndex,
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
    }), {});

    console.log(colors.blue(imagesToDownload.length + 'images to download'));

    imagesToDownload.reduce((cur, image, index) => {
      return cur
        .then(() => {
          return new Promise((res, rej) => {
            saveImage(image.url, image.filePath, index, imagesToDownload.length)
            .then(res)
            .catch(() => {
              console.log('roll back to online image'.bgYellow);
              newData[image.collection][image.elementIndex].images[image.imageIndex] = image.url;
              res();
            })
          })
            
        })
    }, Promise.resolve())
    .then(() => resolve(newData))
    .catch(e => {
      console.log(colors.red('oups', e));
      reject();
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
  console.log('detabletopify'.bgBlue);
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
  .then(d => console.info('data written'.bgGreen))
  .catch(error => console.error(error))