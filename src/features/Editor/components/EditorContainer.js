/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the item container
 * @module inventaire/features/Editor
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import EditorLayout from './EditorLayout';
import * as duck from '../duck';
import {downloadJSONCollectionAsTSV} from '../../../helpers/download';
import config from '../../../../config';

const {fieldsMetadata} = config;

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.editor),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class EditorContainer extends Component {

  /**
   * Context data used by the component
   */
  static contextTypes = {

    /**
     * Un-namespaced translate function
     */
    t: PropTypes.func.isRequired,

    /**
     * Redux store
     */
    store: PropTypes.object.isRequired
  }

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.getItems();
  }

  componentWillReceiveProps(nextProps) {
    if (!Object.keys(this.props.collections).length && Object.keys(nextProps.collections).length) {
      let firstIndex = 0;

      const pieces = nextProps.collections['pièces'];
      pieces.some((piece, index) => {
        if (piece.cacher === 'oui') {
          return false;
        }
 else if (!piece.materiaux.length || !piece.mediums.length) {
            firstIndex = index;
            return true;
        }
 else if (
          piece.materiaux.filter(m => !fieldsMetadata.materiaux.enum.find(option => option === m)).length
          ||
          piece.mediums.filter(m => !fieldsMetadata.mediums.enum.find(option => option === m)).length
        ) {
          firstIndex = index;
          return true;
        }
      });
      this.props.actions.setCurrentPieceIndex(firstIndex);

    }
  }

  shouldComponentUpdate() {
    return true;
  }

  onDownload = (onlyModified) => {

    let pieces = this.props.collections && this.props.collections['pièces'];
    if (pieces) {
      if (onlyModified) {
        pieces = pieces.filter(p => p.traite === 'oui').map(p => {
          const newP = Object.assign({}, p);
          delete p.traite;
          return newP;
        });
      }
      downloadJSONCollectionAsTSV(pieces);
    }
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const pieces = this.props.collections && this.props.collections['pièces'];
    return (
      <EditorLayout
        pieces={pieces}
        onDownload={this.onDownload}
        {...this.props} />
    );
  }
}

export default EditorContainer;
