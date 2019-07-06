/**
 * inventaire Application
 * =======================================
 * Root component of the application.
 * @module inventaire
 */
import React from 'react';

import {Router, Route} from 'react-router';

import './core.scss';
import './Application.scss';

import Layout from './features/Layout/components/LayoutContainer.js';

import Items from './features/Items/components/ItemsContainer.js';
import Editor from './features/Editor/components/EditorContainer.js';
import Methodology from './components/Methodology';


/**
 * Renders the whole inventaire application
 * @return {ReactComponent} component
 */
const Application = ({history}) => (
  <Router history={history}>
    <Route path="/" component={Layout}>
      <Route path="/cabinet" exact component={Items} />
      <Route path="/editeur" exact component={Editor} />
      <Route path="/methodologie" component={Methodology} />
    </Route>
  </Router>
);

export default Application;
