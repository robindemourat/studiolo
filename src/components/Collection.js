import React from 'react';

import Item from './Item';

export default ({
  title = '',
  items = [],
  router,

  activeItemId,

  hoveredItemId,
  hoveredItemCollection,

  relatedItemsIds = [],

  setActiveItemId,
  unsetActiveItemId,
  status,

  onItemEnter,
  onItemLeave,
}) => {
  return (
    <div className={'inventaire-Collection ' + (status || '')}>
      <h2>{title}</h2>
      <ul className="items-list">
        {
            items
            .sort((a, b) => {
              if (a.id > b.id) {
                return 1;
              }
                else {
                return -1;
              }
            })
            .map((item, index) => {
              const onMouseEnter = () => {
                onItemEnter(item.id, title);
              };
              const onMouseLeave = () => {
                onItemLeave(item.id);
              };
              const getStatus = () => {
                if (hoveredItemId || activeItemId) {
                  if (activeItemId === item.id) {
                    return 'selected';
                  }
                  else if (!activeItemId && hoveredItemId === item.id) {
                    return 'active';
                  }
                  else if (!activeItemId && relatedItemsIds.indexOf(item.id) > -1) {
                    return 'related';
                  }
                  else if (!activeItemId && hoveredItemCollection === title) {
                    return 'inactive same-collection';
                  }
                  else {
                    return 'inactive';
                  }
                }
                  else {
                  return undefined;
                }
              };

              return (
                <Item
                  key={index}
                  item={item}
                  router={router}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onSelect={setActiveItemId}
                  onDeselect={unsetActiveItemId}
                  status={getStatus()} 
                />
              );
            })
          }
      </ul>
    </div>
  );
};
