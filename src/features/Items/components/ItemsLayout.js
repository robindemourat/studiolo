/* eslint react/jsx-no-bind : 0 */
/* eslint no-nested-ternary : 0 */
/**
 * This module exports a stateless component rendering the layout of the items view
 * @module inventaire/features/Items
 */
import React from 'react';
import PropTypes from 'prop-types';
import {uniqBy} from 'lodash';
import Collection from '../../../components/Collection';
import config from '../../../../config';
import Tooltip from 'react-tooltip';

import './ItemsLayout.scss';

const {fieldsMetadata} = config;

const ItemsLayout = ({
  activeItemId,
  activeItemCollection,
  connectedItems = [],

  hoveredItemId,
  hoveredItemCollection,

  // collectionsNames = [],
  collections = {},
  relatedItemsIds = [],
  router,
  itemIsUnHovered,
  activeTag,
  actions: {
    itemIsHovered,
    setActiveItemId,
    unsetActiveItemId,
    setActiveTag,
  }
}) => (
  <section className="inventaire-Items">
    <section className={'works ' + (activeItemCollection ? activeItemCollection === 'pièces' ? 'active' : 'inactive' : '')}>
      <Collection
        title={'pièces'}
        description={fieldsMetadata['pièces'].description}
        items={collections['pièces']}
        showDates
        router={router}
        onItemEnter={itemIsHovered}
        onItemLeave={itemIsUnHovered}
        setActiveItemId={setActiveItemId}
        activeItemId={activeItemId}
        hoveredItemId={hoveredItemId}
        hoveredItemCollection={hoveredItemCollection}
        relatedItemsIds={relatedItemsIds}
        unsetActiveItemId={unsetActiveItemId}
        status={activeItemCollection ? activeItemCollection === 'pièces' ? 'active' : 'inactive' : undefined} />
    </section>
    <section className={'secondary ' + (activeItemCollection ? activeItemCollection === 'pièces' ? 'inactive' : 'active' : '')}>
      {
          config.collectionsToShow
          .filter(name => name !== 'pièces')
          // .sort((a, b) => {
          //   if (a === 'personnes') {
          //     return -1;
          //   }
          //   else if (!config.extractedFields.includes(a) && config.extractedFields.includes(b)) {
          //     return -1;
          //   }
          //    else if (a > b) {
          //     return 1;
          //   }
          //   return -1;
          // })
          .map((collectionName, index) => {
            return (
              <Collection
                key={index}
                title={fieldsMetadata[collectionName].title}
                description={fieldsMetadata[collectionName].description}
                items={collections[collectionName]}
                router={router}
                onItemEnter={itemIsHovered}
                onItemLeave={itemIsUnHovered}
                activeItemId={activeItemId}
                activeItemCollection={activeItemCollection}
                hoveredItemId={hoveredItemId}
                hoveredItemCollection={hoveredItemCollection}
                relatedItemsIds={relatedItemsIds}
                setActiveItemId={setActiveItemId}
                unsetActiveItemId={unsetActiveItemId}
                status={activeItemCollection ? activeItemCollection === collectionName ? 'active' : 'inactive' : undefined} />
            );
          })
        }
    </section>
    <aside className={'aside ' + (activeItemId ? 'active' : 'inactive')}>
      <h3>Éléments liés</h3>
      <div className="tags">
        {
          uniqBy(
            connectedItems,
            d => d.collection
          )
          .map((item, index) => {
            const handleClick = () => {
              if (item.collection === activeTag) {
                setActiveTag(undefined);
              }
              else {
                setActiveTag(item.collection);
              }
            };
            return (
              <span
                data-for="tooltip"
                data-tip={fieldsMetadata[item.collection].description}
                onClick={handleClick}
                className={`tag ${activeTag && activeTag === item.collection ? 'is-active' : ''}`}
                key={index}>
                {fieldsMetadata[item.collection].title}
              </span>
            );
          })
        }
      </div>
      <ul className="connected-items">
        {
            uniqBy(
              connectedItems,
              d => d.id
            )
            .sort((a, b) => {
              if (a.collection > b.collection) {
                return 1;
              }
              return -1;
            })
            .filter(item => {
              if (activeTag) {
                return item.collection === activeTag;
              }
              return true;
            })
            .map((item, index) => {
              const name = item.titre || item.nom;
              const move = () => {
                const search = `cabinet?focus=${item.id}`;
                router.push(search);
                setActiveItemId(item.id);
              };
              const relatedType = item.collection.replace(/s$/, '');
              return (
                <li className="connected-item" key={index}>
                  <h4 className="anchor"><a onClick={move}>→ {name}<span className="collection"> - {relatedType}</span></a></h4>
                </li>
              );
            })
          }
      </ul>
    </aside>
    <Tooltip effect="solid" place="bottom" id="tooltip" />
  </section>
);

/**
 * Context data used by the component
 */
ItemsLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default ItemsLayout;
