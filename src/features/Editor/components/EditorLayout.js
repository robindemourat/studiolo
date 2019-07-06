/* eslint react/jsx-no-bind : 0 */
/* eslint no-nested-ternary : 0 */
/**
 * This module exports a stateless component rendering the layout of the Editor view
 * @module inventaire/features/Editor
 */
import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config';


import './EditorLayout.scss';


const {fieldsMetadata} = config;

const computeListPieceStyle = piece => {
  if (piece.cacher === 'oui') {
    return {
      display: 'none'
    };
  }
  if (!piece.materiaux.length || !piece.mediums.length) {
    return {
      color: 'red'
    };
  }
 else {
    if (
      piece.materiaux.filter(m => !fieldsMetadata.materiaux.enum.find(option => option === m)).length
      ||
      piece.mediums.filter(m => !fieldsMetadata.mediums.enum.find(option => option === m)).length
    ) {
      return {
        color: 'blue'
      };
    }
 else {
      return {
        color: 'green'
      };
    }
  }
};

const EditorLayout = ({
  pieces = [],
  currentPieceIndex = 0,
  actions: {
    setCurrentPieceIndex,
    updatePiece,
  },
  onDownload,
}) => {
  if (pieces.length) {
    const currentPiece = pieces[currentPieceIndex];
    const onPrev = () => {
      if (currentPieceIndex > 0) {
        setCurrentPieceIndex(currentPieceIndex - 1);
      }
    };
    const onNext = () => {
      if (currentPieceIndex < pieces.length - 2) {
        setCurrentPieceIndex(currentPieceIndex + 1);
      }
    };


    const updateCurrentPiece = (key, val) => {
      const newPiece = Object.assign({}, currentPiece);
      newPiece[key] = val;
      newPiece.traite = 'oui';
      updatePiece(newPiece, currentPieceIndex);
    };

    return (
      <section style={{overflow: 'auto'}} className="inventaire-Editor">
        <div>
          <div>
            {/* <button onClick={onDownload}>
              télécharger toutes les pièces
            </button> */}
            <button className="dl-btn" onClick={() => onDownload(true)}>
              télécharger les pièces modifiées
            </button>
            <p>
              Vert : OK<br />
              Bleu : médiums ou matériaux incorrects<br />
              Rouge: médiums ou matériaux manquants<br />
            </p>
          </div>
          <ul className="pieces-list">
            {
              pieces.map((piece, index) => {
                const handleClick = () => {
                  setCurrentPieceIndex(index);
                };
                return (
                  <li
                    key={index} className={index === currentPieceIndex ? 'active' : ''} style={computeListPieceStyle(piece)}
                    onClick={handleClick}>
                    <button>{piece.titre}</button>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div style={{flex: 1, minWidth: '70vw'}}>
          <ul className="tags-list">
            <li><button onClick={onPrev}>Précédent</button></li>
            <li><button onClick={onNext}>Suivant</button></li>
          </ul>
          <h1>{currentPiece.titre}</h1>
          <iframe style={{background: 'white', height: '50vh', width: '100%'}} src={currentPiece.url} />
          <p><a target="blank" rel="noopener" href={currentPiece.url}>Aller sur le site</a></p>

          <div>
            <h2>Matériaux</h2>
            <h3>Matériaux déjà entrés</h3>
            <ul className="tags-list">
              {currentPiece.materiaux.map(materiau => {
                const onRemove = () => {
                  updateCurrentPiece('materiaux',
                  currentPiece.materiaux.filter(m => {
                    return m !== materiau;
                  })
                  );
                };
                return (
                  <li onClick={onRemove} key={materiau}>
                    {materiau} <button>x</button>
                  </li>
                );
              })}
            </ul>
            <h3>Matériaux possibles</h3>
            <ul className="tags-list">
              {
                fieldsMetadata.materiaux.enum
                .filter(m => !currentPiece.materiaux.find(thatM => thatM === m))
                .map(option => {
                  const handleClick = () => {
                    updateCurrentPiece('materiaux',
                    [...currentPiece.materiaux, option]
                    );
                  };
                  return (
                    <li onClick={handleClick} key={option}>
                      <button>{option} +</button>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div>
            <h2>Médiums</h2>
            <h3>Médiums déjà entrés</h3>
            <ul className="tags-list">
              {currentPiece.mediums.map(medium => {
                const onRemove = () => {
                  updateCurrentPiece('mediums',
                  currentPiece.mediums.filter(m => {
                    return m !== medium;
                  })
                  );
                };
                return (
                  <li onClick={onRemove} key={medium}>
                    {medium} <button >x</button>
                  </li>
                );
              })}
            </ul>
            <h3>Médiums possibles</h3>
            <ul className="tags-list">
              {
                fieldsMetadata.mediums.enum
                .filter(m => !currentPiece.mediums.find(thatM => thatM === m))
                .map(option => {
                  const handleClick = () => {
                    updateCurrentPiece('mediums',
                    [...currentPiece.mediums, option]
                    );
                  };
                  return (
                    <li onClick={handleClick} key={option}>
                      <button>{option} +</button>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </section>
    );
  }
  return null;
};

/**
 * Context data used by the component
 */
EditorLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default EditorLayout;
