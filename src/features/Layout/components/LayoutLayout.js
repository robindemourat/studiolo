/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module inventaire/features/Layout
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';


import './LayoutLayout.scss';


const LayoutLayout = ({
  children,
  // loadingStatus = '',
  colorGradientStart,
  colorGradientEnd,
  gradientDirection,
  actions: {
    // setActiveItemId,
    unsetActiveItemId,
    itemIsUnhovered,
  }
}) => [
  <div
    key={0}
    className="background"
    style={{
        background: `linear-gradient( ${gradientDirection}, ${colorGradientStart} 0%, ${colorGradientEnd} 100%)`
      }} />,
  <div key={1} className="inventaire-Layout">
    {children &&
    <nav className="nav">
      <h1>
        <Link
          onClick={() => {
          // setActiveItemId(undefined);
          unsetActiveItemId(undefined);
          itemIsUnhovered(undefined);
        }} to="/cabinet">
          studiolo
        </Link> {/*loadingStatus && <span className="loading-status"> - {loadingStatus}</span>*/}</h1>
      <h3>
        <Link className="nav-link" to="/cabinet">Cabinet</Link>
        <Link
          className="nav-link" activeClassName="active" style={{marginLeft: '1rem'}}
          to="/methodologie">Méthodologie</Link>
        {/*un cabinet de curiosités sur les formats expérimentaux de publication des recherches en Arts, Lettres et Sciences Humaines et Sociales.*/}
      </h3>
    </nav>}
    <section className="container">
      {children ? children :
      <section className="landing">
        <div>
          <h1>Studiolo</h1>
          <h3>
            un cabinet de curiosités sur les formats expérimentaux de publication des recherches en Arts, Lettres et Sciences Humaines et Sociales.
          </h3>
          <p>
            <a href="#/cabinet">Cabinet</a>
            <a style={{marginLeft: '1rem'}} href="#/methodologie">Méthodologie</a>
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
