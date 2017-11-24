/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the item container
 * @module inventaire/features/Items
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import ItemsLayout from './ItemsLayout';
import * as duck from '../duck';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.items),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class ItemsContainer extends Component {

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
    const query = this.props.router.location.query;
    if (query && query.focus) {
      this.props.actions.setActiveItemId(query.focus);
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  itemIsUnHovered = id => {
    setTimeout(() => {
      if (id === this.props.hoveredItemId) {

        this.props.actions.itemIsUnHovered();
      }
    }, 100);
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    return (
      <ItemsLayout
        itemIsUnHovered={this.itemIsUnHovered}
        {...this.props} />
    );
  }
}

export default ItemsContainer;
