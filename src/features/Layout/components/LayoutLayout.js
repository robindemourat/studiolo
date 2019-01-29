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
  colorGradientStart,
  colorGradientEnd,
  gradientDirection
}) => [
  <div
    key={0}
    className="background"
    style={{
        background: `linear-gradient( ${gradientDirection}, ${colorGradientStart} 0%, ${colorGradientEnd} 100%)`
      }} />,
  <div key={1} className="inventaire-Layout">
    {children && <nav className="nav">
      <h1><a href="#/inventaire">inventaire</a> {loadingStatus && <span className="loading-status"> - {loadingStatus}</span>}</h1>
      <h3>
        expérimentations de formats de publication universitaire en Arts, Lettres et Sciences Humaines et Sociales.
      </h3>
    </nav>}
    <section className="container">
      {children ? children :
      <section className="landing">
        <div>
          <h1>Inventaire</h1>
          <h3>
            expérimentations de formats de publication universitaire en Arts, Lettres et Sciences Humaines et Sociales.
          </h3>
          <p>
            <a href="#/inventaire">Accéder à l'inventaire</a>
          </p>
        </div>
      </section>
      }
    </section>
  </div>
];

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
