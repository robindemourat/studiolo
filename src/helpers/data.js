/* eslint  no-console : 0 */
/* eslint no-confusing-arrow : 0*/
import {uniq, flatten} from 'lodash';
import getSpreadsheet from './tabletop';
import getStatic from './static-data';


export const detabletopify = (data) =>
  new Promise((resolve) => {
    resolve(
      Object.keys(data).reduce((res, key) => ({
        ...res,
        [key]: data[key].elements
        .filter(e => e.cacher !== 'oui')
        .map(element => ({
          ...element,
          collection: key
        })),
      }), {})
    );
  });

export const fetchData = (dataKey, forceDynamic) =>
  process.env.NODE_ENV === 'production' && !forceDynamic ?
    getStatic() :
    getSpreadsheet(dataKey)
        .then(result => detabletopify(result));

/**
 * Cleaning data-idiomatic stuff
 */
export const cleanIdioms = (collections, {collectionsToRemove = [], nameFields = []}) =>
  new Promise((resolve) => {
    collectionsToRemove.forEach(colName => {
      delete collections[colName];
    });
    const clean = Object.keys(collections).reduce((res, key) => ({
      ...res,
      [key]: collections[key]
                // verify object has a name
                .filter(data => {
                  return nameFields.some(field => {
                    return typeof data[field] === 'string' && data[field].trim().length > 0;
                  });
                })
                // split images
                .map(data => ({
                  ...data,
                  images: typeof data.images === 'string' && data.images.trim().length ?
                            data.images.trim().split(',')
                            : data.images
                }))
    }), {});
    resolve(clean);
  });


export const makeConnections = (collections) =>
  new Promise((resolve) => {
    const connectionsNames = Object.keys(collections);
    const result = Object.keys(collections).reduce((res, key) => ({
      ...res,
      [key]: collections[key].map(data =>
                connectionsNames.reduce((obj, colKey) => ({
                  ...obj,
                  [colKey]: typeof data[colKey] === 'string' ?
                              data[colKey].split(',').map(d => d.trim())
                               : data[colKey]
                }), data)
              )
    }), {});
    resolve(result);
  });

export const makeNetwork = (collections) =>
  new Promise((resolve) => {
    const nodes = [];
    const links = [];
    // nodes
    Object.keys(collections).forEach(collectionKey => {
      const collection = collections[collectionKey];
      collection.forEach(obj => {
        nodes.push(obj);
      });
    });

    // links
    Object.keys(collections).forEach(collectionKey => {
      const collection = collections[collectionKey];
      collection.forEach(obj => {
        if (obj.id && obj.id.length) {
          Object.keys(obj).forEach(key => {
            const val = obj[key];
            if (Array.isArray(val)) {
              val.filter(id => id.length).forEach(id => {
                links.push({
                  source: obj.id,
                  target: id
                });
              });
            }
          });
        }
      });
    });

    resolve({collections, nodes, links});
  });
export const verifyIds = (collections) =>
  new Promise((resolve) => {
    console.group('Data:ids verification');
    const ids = [];
    const connectionsNames = Object.keys(collections);
    connectionsNames.forEach(collectionKey => {
      const collection = collections[collectionKey];
      collection.forEach(obj => {
        if (!obj.id || !obj.id.length) {
          console.error('No id found for object: ', obj);
        }
 else if (ids.indexOf(obj.id) > -1) {
          console.error('Found a duplicate id : %s', obj.id);
        }
 else {
          ids.push(obj.id);
        }
      });
    });
    console.info('All data ids verified!');
    console.groupEnd('Data:ids verification');
    resolve(collections);
  });

export const verifyConnections = (collections) =>
  new Promise((resolve) => {
    console.group('Data:connections verification');
    const connectionsNames = Object.keys(collections);
    connectionsNames.forEach(collectionKey => {
      const collection = collections[collectionKey];
      collection.forEach(obj => {
        Object.keys(obj).forEach(objKey => {
          const val = obj[objKey];
          if (Array.isArray(val)) {
            val.filter(s => s.length).forEach(pointer => {
              let targets;
              if (collections[objKey]) {
                targets = collections[objKey]
                          .filter(t =>
                            t.id ? t.id === pointer
                            : false
                          );
                if (targets.length > 1) {
                  console.error('found %s objects with id %s in %s collection', targets.length, pointer, objKey);
                }
 else if (targets.length === 0) {
                  console.error('could not find %s object in %s collection', pointer, objKey);
                }
              }
            });
          }
        });
      });
    });
    console.info('All data connections verified!');
    console.groupEnd('Data:connections verification');
    resolve(collections);
  });

export const extractEntities = (collections, fieldKey = 'tags') =>
  new Promise((resolve) => {
    const result = Object.keys(collections).reduce((res, key) => ({
      ...res,
      [key]: collections[key].map(data => ({
        ...data,
        [fieldKey]: data[fieldKey] ?
                    data[fieldKey].split(',').map(tag => tag.trim())
                    : []
      }))
    }), {});

    let entities = uniq(
      flatten(
        Object.keys(result).reduce((res, key) =>
          res.concat(result[key].map(data => data[fieldKey]))
        , [])
      )
    ).sort((a, b) => {
      if (a > b) {
        return 1;
      }
 else return -1;
    });
    entities = entities.map(tag => ({
      id: tag,
      nom: tag,
      collection: fieldKey
    }));
    result[fieldKey] = entities;
    resolve(result);
  });

const findRel = (id, links) => {
  return links.filter(link => {
    if (link.source === id || link.target === id) {
      return true;
    }
  })
  .map(link => {
    const vals = [link.source, link.target];
    return vals.filter(v => v !== id)[0];
  });
};

/**
 * Finding relations on two levels
 */
export const findRelatedIds = (id, links) => {
  const firstLevel = findRel(id, links);
  const secondLevel = firstLevel.map(rel => findRel(rel, links));
  return flatten(
          firstLevel.concat(secondLevel)
        ).filter(thatId => thatId !== id);
};

