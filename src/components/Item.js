import React from 'react';
import ImageGallery from 'react-image-gallery';

import getImageUri from '../helpers/image-uri';
import Player from './Player';

import 'react-image-gallery/styles/scss/image-gallery.scss';

export default ({
  item = {},
  showDates = false,
  router,
  onMouseEnter,
  onMouseLeave,
  status,
  onSelect,
  onDeselect,
}) => {
  const titre = item.nom || item.titre;
  const {
    collection,
    id,
  } = item;
  const onFocus = () => {
    // console.log('on focus, status', status);
    // if (status === 'active') {
      const search = `cabinet?focus=${id}`;
      router.push(search);
      onSelect(item.id);
    // } else {
    //   onMouseEnter();
    // }
  };
  const onToggleLinkedElements = () => {
    if (status === 'active') {
      onMouseLeave();
    }
 else {
      onMouseEnter();
    }
  };
  const onUnFocus = () => {
    router.push('/cabinet');
    onDeselect(item.id);
    onMouseLeave();
  };
  return (
    <li className={'inventaire-Item ' + (status || '') + (item.cacher === 'oui' ? 'is-hidden' : '')}>
      <h3
        className="item-name">
        <a>
          <span className="item-title" onClick={onFocus}>{titre}{showDates && item.date ? ` (${item.date})` : ''}</span>
          <button
            data-tip={`afficher les éléments liés à "${titre}"`} data-for="tooltip" className="linked-button"
            onClick={onToggleLinkedElements}>🔗</button>
        </a>
      </h3>
      <div className="item-body">
        <p className="item-collection">{collection.replace(/s$/, '')}</p>
        <p className="item-back"><a onClick={onUnFocus}>Index ←</a></p>
        {status === 'selected' && item.url &&
          <p>
            <a href={item.url} target="blank">Site web →</a>
          </p>
        }
        {
          status === 'selected' &&
          Array.isArray(item.images) &&
          item.images.length > 0 &&
          (
            item.images.length > 1 ?
              <ImageGallery items={item.images.map(i => ({
              original: getImageUri(i, 'original'),
              thumbnail: getImageUri(i, 'thumbnail')
            }))} />
            :
              <div className="single-image">
                <img src={getImageUri(item.images[0], 'original')} />
              </div>
          )
        }
        {
          status === 'selected' &&
          item.video &&
          <div className="item-video-wrapper">
            <Player url={item.video} />
          </div>
        }
        {status === 'selected' && item.citation &&
          <div className="citation-container">
            <blockquote
              className="citation"
              dangerouslySetInnerHTML={{/* eslint react/no-danger : 0 */
                __html: item.citation.replace(/\\./g, '<br/>')
              }} />
            <div>
              <a
                target="blank" rel="noopener"
                href={item.citation_source_url}>
                {item.citation_source_nom}
              </a>
            </div>
          </div>
        }

      </div>
    </li>
  );
};
