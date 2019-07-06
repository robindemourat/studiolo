/**
 * inventaire Application
 * =======================================
 * Combining the app's reducers
 * @module inventaire
 */
import {combineReducers} from 'redux';

import {i18nState} from 'redux-i18n';
import {routerReducer} from 'react-router-redux';

import items from './../features/Items/duck';
import editor from './../features/Editor/duck';

export default combineReducers({
  items,
  editor,

  i18nState,
  routing: routerReducer,
});
