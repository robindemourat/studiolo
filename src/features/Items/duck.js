/**
 * This module exports logic-related elements for the items feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module inventaire/features/Items
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {
  dataKey,
  collectionsToRemove,
  extractedFields,
  nameFields
} from '../../../config';
// import getSpreadsheet from '../../helpers/tabletop';
import {
  fetchData,
  cleanIdioms,
  extractEntities,
  makeConnections,
  verifyConnections,
  verifyIds,
  makeNetwork,
  findRelatedIds,
} from '../../helpers/data';

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Action names
 * ===========
 * ===========
 * ===========
 * ===========
 */
export const GET_ITEMS = 'GET_ITEMS';
export const SET_ACTIVE_ITEM_ID = 'SET_ACTIVE_ITEM_ID';
export const UNSET_ACTIVE_ITEM_ID = 'UNSET_ACTIVE_ITEM_ID';
export const ITEM_IS_HOVERED = 'ITEM_IS_HOVERED';
export const ITEM_IS_UNHOVERED = 'ITEM_IS_UNHOVERED';


/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Action creators
 * ===========
 * ===========
 * ===========
 * ===========
 */
export const getItems = () => ({
  type: GET_ITEMS,
  promise: () =>
    fetchData(dataKey)
      .then(result => 
        cleanIdioms(result, {
          collectionsToRemove,
          nameFields
        })
      )
      .then(result => makeConnections(result))
      .then(result => verifyConnections(result))
      .then(result => verifyIds(result))
      .then(result => {
        return extractedFields.reduce((p, fieldName) => {
          return p.then(data => extractEntities(data || result, fieldName));
        }, Promise.resolve())
      })
      .then(result => makeNetwork(result))
});

export const setActiveItemId = id => ({
  type: SET_ACTIVE_ITEM_ID,
  id
});

export const unsetActiveItemId = id => ({
  type: UNSET_ACTIVE_ITEM_ID,
  id
});

export const itemIsHovered = (id, collection) => ({
  type: ITEM_IS_HOVERED,
  id,
  collection,
});

export const itemIsUnHovered = id => ({
  type: ITEM_IS_UNHOVERED,
  id
});

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Reducers
 * ===========
 * ===========
 * ===========
 * ===========
 */

/**
 * Default/fallback state of the items ui state
 */
const UI_DEFAULT_STATE = {
  loadingStatus: '',
  activeItemId: undefined,
  activeItemCollection: undefined,

  hoveredItemCollection: undefined,
  hoveredItemId: undefined,

  relatedItemsIds: [],

  connectedItems: [],

  links: [],
  nodes: [],
  collections: []
};
/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 * @todo automate status messages management in all ui reducers
 */
function ui(state = UI_DEFAULT_STATE, action) {
  let loadingStatus;
  let activeItemCollection;
  let connectedItems;
  switch (action.type) {

    case SET_ACTIVE_ITEM_ID:
        const active = state.nodes.find(n => n.id === action.id);
        activeItemCollection = active && active.collection;
        if (state.nodes.length) {
         connectedItems = findRelatedIds(action.id, state.links)
          .map(thatId => state.nodes.find(n => n.id === thatId))
          .filter(d => d);
        }
        return {
          ...state,
          activeItemId: action.id,
          activeItemCollection,
          connectedItems,
        };
    case UNSET_ACTIVE_ITEM_ID:
        return {
          ...state,
          activeItemId: undefined,
          activeItemCollection: undefined,
          connectedItems: undefined,
        };
    case ITEM_IS_HOVERED:
      const relatedItemsIds = findRelatedIds(action.id, state.links);
      return {
        ...state,
        hoveredItemId: action.id,
        hoveredItemCollection: action.collection,
        relatedItemsIds,
      };
    case ITEM_IS_UNHOVERED:
      return {
        ...state,
        hoveredItemId: undefined,
        hoveredItemCollection: undefined,
      };
    case GET_ITEMS:
      loadingStatus = 'chargement';
      return {...state, loadingStatus};
    case GET_ITEMS + '_SUCCESS':
      loadingStatus = 'succès';
      if (state.activeItemId) {
        activeItemCollection = action.result.nodes.find(n => n.id === state.activeItemId).collection;
      }
      if (action.result.nodes.length) {
       connectedItems = findRelatedIds(state.activeItemId, action.result.links)
        .map(thatId => action.result.nodes.find(n => n.id === thatId))
        .filter(d => d);
      }
      return {
        ...state,
        ...action.result,
        loadingStatus,
        activeItemCollection,
        connectedItems,
      };
    case GET_ITEMS + '_FAIL':
      loadingStatus = 'erreur';
      return {...state, loadingStatus};
    case GET_ITEMS + '_RESET':
      loadingStatus = '';
      return {...state, loadingStatus};
    default:
      return state;
  }
}

const DATA_DEFAULT_STATE = {
  collections: {},
  nodes: [],
  links: []
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_ITEMS + '_SUCCESS':
      return {
        ...state,
        ...action.result,
      };
    case GET_ITEMS + '_FAIL':
      return state;
    default:
      return state;
  }
}

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Exported reducer
 * ===========
 * ===========
 * ===========
 * ===========
 */

/**
 * The module exports a reducer
 */
export default combineReducers({
  ui,
  data
});


/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Selectors
 * ===========
 * ===========
 * ===========
 * ===========
 */
/**
 * Selectors related to global ui
 */

const loadingStatus = state => state.ui.loadingStatus;

const activeItemId = state => state.ui.activeItemId;
const activeItemCollection = state => state.ui.activeItemCollection;
const connectedItems = state => state.ui.connectedItems;
const hoveredItemCollection = state => state.ui.hoveredItemCollection;
const relatedItemsIds = state => state.ui.relatedItemsIds;
const hoveredItemId = state => state.ui.hoveredItemId;
const collections = state => state.data.collections;
const collectionsNames = state => Object.keys(state.data.collections);
const nodes = state => state.data.nodes;
const links = state => state.data.links;
/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  activeItemId,
  activeItemCollection,
  connectedItems,

  hoveredItemId,
  hoveredItemCollection,

  relatedItemsIds,
  loadingStatus,
  collections,
  collectionsNames,
  nodes,
  links,
});
