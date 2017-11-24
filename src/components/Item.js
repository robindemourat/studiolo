import React from 'react';
import ReactPlayer from 'react-player';
import ImageGallery from 'react-image-gallery';

import 'react-image-gallery/styles/scss/image-gallery.scss';

export default ({
  item = {},
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
    const search = `inventaire?focus=${id}`;
    router.push(search);
    onSelect(item.id);
  };
  const onUnFocus = () => {
    router.push('/inventaire');
    onDeselect(item.id);
  };
  return (
    <li className={'inventaire-Item ' + (status || '')}>
      <h3
        className="item-name"
        onMouseOver={onMouseEnter}
        onMouseMove={onMouseEnter}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}><a onClick={onFocus}>{titre}</a></h3>
      <div className="item-body">
        <p className="item-collection">{collection.replace(/s$/, '')}</p>
        <p className="item-back"><a onClick={onUnFocus}>Index →</a></p>
        {status === 'selected' && item.url &&
          <p>
            <a href={item.url} target="blank">Site web →</a>
          </p>
        }
        {status === 'selected' && item.description &&
          <p>
            {item.description}
          </p>
        }
        {
          status === 'selected' && Array.isArray(item.images) && item.images.length > 0 &&
          <ImageGallery items={item.images.map(i => ({original: i, thumbnail: i}))} />
        }
        {status === 'selected' && item.video && <div className="item-video-wrapper"><ReactPlayer url={item.video} playing /></div>}
      </div>
    </li>
  );
};
