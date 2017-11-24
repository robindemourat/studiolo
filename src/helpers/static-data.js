

export default () =>
  new Promise((resolve, reject) => {
    resolve(require('../../data/data.json'))
      .catch(e => reject(e));
  });
