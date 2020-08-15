// Library imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, IconButton, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Local data object imports
import { Item, Material } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles((theme) => ({
  actionColumn: {
    width: 130,
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
  error: {
    color: theme.palette.error.dark,
  },
}));

/**
 * A functional component that renders the item table body.
 *
 * @param {Array.<Item>} items The array of items
 * @param {string} order The sort direction
 * @param {string} orderBy The property to sort by
 * @param {func} onEdit Edit handler function
 * @param {func} onDelete Delete handler function
 * @param {Array.<Material>} materials Array of available materials
 * @return {JSX} The component markup
 */
const ItemTableBody = ({ items, order, orderBy, onEdit, onDelete, materials }) => {
  const classes = useStyles();

  /**
   * Get the material name and dimensions of the given item.
   *
   * @param {Item} item The item to get the material data of
   * @return {string} The material name and dimensions
   */
  const getMaterial = (item) => {
    if (!item || !item.material) {
      return '';
    }

    const material = materials.filter((m) => m.id === item.material).pop();
    return `${material.name} (${material.width} x ${material.height} x ${material.thickness}mm)`;
  };

  /**
   * Render the sheet numbers the item is placed to.
   *
   * @param {Item} item The item to get the sheet number of
   * @return {string} The joined sheet numbers
   */
  const renderSheetNumber = (item) => {
    if (!item.sheet.length) {
      return '--';
    }

    return (
      <I18n
        i18nKey="ItemDataCard.ItemTable.sheetNumber"
        vars={{ sheet: item.sheet.map((s) => s + 1).join(', ') }}
      />
    );
  };

  /**
   * Comparator that sorts two given items by the given property.
   *
   * @param {Item} item1 The left item
   * @param {Item} item2 The right item
   * @param {string} orderByProp The property to sort by
   * @return {number} The compare result (-1, 0, 1)
   */
  const descendingComparator = (item1, item2, orderByProp) => {
    if (item2[orderByProp] < item1[orderByProp]) {
      return -1;
    }
    if (item2[orderByProp] > item1[orderByProp]) {
      return 1;
    }
    return 0;
  };

  /**
   * Get the matching comparator for the given direction and property.
   *
   * @param {string} orderDirection The sort direction
   * @param {string} orderByProp The property to sort by
   * @return {func} A comparator function
   */
  const getComparator = (orderDirection, orderByProp) => {
    return orderDirection === 'desc'
      ? (a, b) => descendingComparator(a, b, orderByProp)
      : (a, b) => -descendingComparator(a, b, orderByProp);
  };

  /**
   * Sort the given items with the given comparator.
   *
   * @param {Array.<Item>} array The array of items to be sorted
   * @param {func} comparator The comparator function
   * @return {Array.<Item>} The sorted item array
   */
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderDirection = comparator(a[0], b[0]);
      if (orderDirection !== 0) return orderDirection;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  return (
    <TableBody>
      {stableSort(items, getComparator(order, orderBy)).map((item) => (
        <TableRow key={item._name}>
          <TableCell
            scope="row"
            classes={{ root: item.placed < item.quantity ? classes.error : '' }}
          >
            {item._name}
          </TableCell>
          <TableCell
            align="right"
            className={classes.noWrap}
            classes={{ root: item.placed < item.quantity ? classes.error : '' }}
          >
            {item.width}
            <I18n i18nKey="global.unit.mm" />
          </TableCell>
          <TableCell
            align="right"
            className={classes.noWrap}
            classes={{ root: item.placed < item.quantity ? classes.error : '' }}
          >
            {item.height}
            <I18n i18nKey="global.unit.mm" />
          </TableCell>
          <TableCell
            align="center"
            classes={{ root: item.placed < item.quantity ? classes.error : '' }}
          >
            {item.quantity}
          </TableCell>
          <TableCell classes={{ root: item.placed < item.quantity ? classes.error : '' }}>
            {getMaterial(item)}
          </TableCell>
          <TableCell classes={{ root: item.placed < item.quantity ? classes.error : '' }}>
            {renderSheetNumber(item)}
          </TableCell>
          <TableCell align="right" className={classes.actionColumn}>
            <IconButton onClick={onEdit(item)}>
              <Icon>edit</Icon>
            </IconButton>
            <IconButton onClick={onDelete(item.id)}>
              <Icon>delete</Icon>
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

// Component property types
ItemTableBody.propTypes = {
  items: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  materials: PropTypes.arrayOf(PropTypes.instanceOf(Material)),
};

// Default property values
ItemTableBody.defaultProps = {
  order: '',
  orderBy: '',
  items: [],
  materials: [],
};

/**
 * Mapping function to extract the required properties from the Redux store.
 *
 * @param {object} state The Redux state
 */
const mapStateToProps = (state) => ({
  materials: state.materialReducer.materials,
});

// Export the component as default and connect it to the Redux store
export default connect(mapStateToProps)(ItemTableBody);
