/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module inventaire/features/Layout
 */
import React from 'react';
import PropTypes from 'prop-types';

import './LayoutLayout.scss';


const LayoutLayout = ({
  children,
  loadingStatus = '',
  colorGradientStart,
  colorGradientEnd,
  gradientDirection,
  actions: {
    setActiveItemId
  }
}) => [
  <div
    key={0}
    className="background"
    style={{
        background: `linear-gradient( ${gradientDirection}, ${colorGradientStart} 0%, ${colorGradientEnd} 100%)`
      }} />,
  <div key={1} className="inventaire-Layout">
    {children && <nav className="nav">
      <h1><a onClick={() => setActiveItemId(undefined)} href="#/inventaire">panorama</a> {/*loadingStatus && <span className="loading-status"> - {loadingStatus}</span>*/}</h1>
      <h3>
        un cabinet de curiosité sur les expériences en formats de publication universitaire dans le champ des Arts, Lettres et Sciences Humaines et Sociales.
      </h3>
    </nav>}
    <section className="container">
      {children ? children :
      <section className="landing">
        <div>
          <h1>Panorama</h1>
          <h3>
            un cabinet de curiosité sur les expériences en formats de publication universitaire dans le champ des Arts, Lettres et Sciences Humaines et Sociales.
          </h3>
          <p>
            <a href="#/inventaire">Accéder au panorama</a>
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
LayoutLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default LayoutLayout;
