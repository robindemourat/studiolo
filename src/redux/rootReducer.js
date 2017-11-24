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

export default combineReducers({
  items,

  i18nState,
  routing: routerReducer,
});
