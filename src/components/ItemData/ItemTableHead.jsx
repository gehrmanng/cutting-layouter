// Library imports
import React from 'react';
import PropTypes from 'prop-types';
import { TableHead, TableRow, TableCell, TableSortLabel, makeStyles } from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Styling definitions
const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  actionColumn: {
    width: 130,
  },
}));

// Table head cell definition
const headCells = [
  { id: 'name', align: 'left' },
  { id: 'width', align: 'right' },
  { id: 'height', align: 'right' },
  { id: 'quantity', align: 'center' },
  { id: 'material', align: 'left' },
  { id: 'sheet', align: 'left' },
  { id: 'action', align: 'left', sortable: false, skipLabel: true, className: 'actionColumn' },
];

/**
 * A functional component that renders the item table header.
 *
 * @param {string} order Column sort direction
 * @param {string} orderBy Column id used for data sorting
 * @param {func} onRequestSort Sort request handler
 * @return {JSX} The component markup
 */
const ItemTableHead = ({ order, orderBy, onRequestSort }) => {
  const classes = useStyles();

  /**
   * Create a sort handler function.
   *
   * @param {string} property The property to sort by
   * @return {func} The sort handler function
   */
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const renderSortLabel = (headCell) => {
    if (typeof headCell.sortable !== 'undefined' && !headCell.sortable) {
      return !headCell.skipLabel ? (
        <I18n i18nKey={`ItemDataCard.ItemTable.${headCell.id}`} />
      ) : null;
    }

    return (
      <TableSortLabel
        active={orderBy === headCell.id}
        direction={orderBy === headCell.id ? order : 'asc'}
        onClick={createSortHandler(headCell.id)}
      >
        {!headCell.skipLabel ? <I18n i18nKey={`ItemDataCard.ItemTable.${headCell.id}`} /> : null}
        {orderBy === headCell.id ? (
          <span className={classes.visuallyHidden}>
            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </span>
        ) : null}
      </TableSortLabel>
    );
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes[headCell.className]}
          >
            {renderSortLabel(headCell)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

// Component property types
ItemTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func.isRequired,
};

// Default property values
ItemTableHead.defaultProps = {
  order: '',
  orderBy: '',
};

// Export component as default
export default ItemTableHead;
