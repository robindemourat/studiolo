/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module inventaire/features/Layout
 */
import React from 'react';
import PropTypes from 'prop-types';

import './LayoutLayout.scss';


const LoginLayout = ({
  children,
  loadingStatus = '',
}) => (
  <div className="inventaire-Layout">
    <nav>
      <h1>inventaire {loadingStatus && <span className="loading-status"> - {loadingStatus}</span>}</h1>
    </nav>
    <section className="container">
      {children ? children :
      <section>
        <p>
            Ce site présente un inventaire de stratégies de publication universitaire multimodales.
        </p>
        <p>
          <a href="/inventaire">Accéder à l'inventaire</a>
        </p>
      </section>
      }
    </section>
  </div>
);

/**
 * Context data used by the component
 */
LoginLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default LoginLayout;
