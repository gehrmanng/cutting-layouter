// Library imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, makeStyles } from '@material-ui/core';

// Local component imports
import ItemTableHead from './ItemTableHead';
import ItemTableBody from './ItemTableBody';

// Local data object imports
import { Item } from '../../bin-packing';

// Local Redux action imports
import { removeItem } from '../../actions/itemActions';

// Styling definitions
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
}));

/**
 * A functional component that renders a table containing all available layout items.
 *
 * @param {function} onEdit A callback function that is called when the edit button of a single item
 *                          has been clicked
 * @param {Array.<Item>} items All available layout items
 * @param {function} dispatch The Redux dispatch function
 * @return {JSX} The component markup
 */
const ItemTable = ({ onEdit, items, dispatch }) => {
  const classes = useStyles();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState();

  /**
   * Click handler that is called when the delete button has been clicked.
   *
   * @param {string} itemId The id of the item that should be deleted
   */
  const handleDelete = (itemId) => () => {
    dispatch(removeItem(itemId));
  };

  /**
   * Click handler that is called when the edit button has been clicked.
   *
   * @param {Item} item The item to be edited
   */
  const handleEdit = (item) => () => {
    onEdit(item);
  };

  /**
   * Set the sort direction and property.
   *
   * @param {object} event The click event
   * @param {string} property The property to sort by
   */
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Table className={classes.table} size="small">
      <ItemTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
      <ItemTableBody
        items={items}
        order={order}
        orderBy={orderBy}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Table>
  );
};

// Component property types
ItemTable.propTypes = {
  onEdit: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
};

// Default property values
ItemTable.defaultProps = {
  items: [],
};

/**
 * Mapping function to extract the required properties from the Redux store.
 *
 * @param {object} state The Redux state
 */
const mapStateToProps = (state) => ({
  items: state.itemReducer.items,
});

// Export the component as default and connect it to the Redux store
export default connect(mapStateToProps)(ItemTable);
