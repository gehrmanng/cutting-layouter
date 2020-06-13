// Library imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Icon,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
} from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Local data object imports
import { Item, Material } from '../../bin-packing';

// Local Redux action imports
import { removeItem } from '../../actions/itemActions';

// Styling definitions
const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  actionColumn: {
    width: 130,
  },
  table: {},
});

/**
 * A functional component that renders a table containing all available layout items.
 *
 * @param {function} onEdit A callback function that is called when the edit button of a single item
 *                          has been clicked
 * @param {Array.<Item>} items All available layout items
 * @param {function} dispatch The Redux dispatch function
 * @return {JSX} The component markup
 */
const ItemTable = ({ onEdit, items, materials, dispatch }) => {
  const classes = useStyles();

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

  const getMaterial = (item) => {
    if (!item || !item.material) {
      return '';
    }

    const material = materials.filter((m) => m.id === item.material).pop();
    return `${material.name} (${material.width} x ${material.height} x ${material.thickness}mm)`;
  };

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

  return (
    <Table className={classes.table} size="small">
      <TableHead>
        <TableRow>
          <TableCell>
            <I18n i18nKey="ItemDataCard.ItemTable.name" />
          </TableCell>
          <TableCell align="right">
            <I18n i18nKey="ItemDataCard.ItemTable.width" />
          </TableCell>
          <TableCell align="right">
            <I18n i18nKey="ItemDataCard.ItemTable.height" />
          </TableCell>
          <TableCell align="center">
            <I18n i18nKey="ItemDataCard.ItemTable.quantity" />
          </TableCell>
          <TableCell>
            <I18n i18nKey="ItemDataCard.ItemTable.material" />
          </TableCell>
          <TableCell>
            <I18n i18nKey="ItemDataCard.ItemTable.sheet" />
          </TableCell>
          <TableCell className={classes.actionColumn} />
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item._name}>
            <TableCell component="th" scope="row">
              {item._name}
            </TableCell>
            <TableCell align="right">
              {item.width}
              <I18n i18nKey="global.unit.mm" />
            </TableCell>
            <TableCell align="right">
              {item.height}
              <I18n i18nKey="global.unit.mm" />
            </TableCell>
            <TableCell align="center">{item.quantity}</TableCell>
            <TableCell>{getMaterial(item)}</TableCell>
            <TableCell>{renderSheetNumber(item)}</TableCell>
            <TableCell align="right" className={classes.actionColumn}>
              <IconButton onClick={handleEdit(item)}>
                <Icon>edit</Icon>
              </IconButton>
              <IconButton onClick={handleDelete(item.id)}>
                <Icon>delete</Icon>
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Component property types
ItemTable.propTypes = {
  onEdit: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
  materials: PropTypes.arrayOf(PropTypes.instanceOf(Material)),
};

// Default property values
ItemTable.defaultProps = {
  items: [],
  materials: [],
};

/**
 * Mapping function to extract the required properties from the Redux store.
 *
 * @param {object} state The Redux state
 */
const mapStateToProps = (state) => ({
  items: state.itemReducer.items,
  materials: state.materialReducer.materials,
});

// Export the component as default and connect it to the Redux store
export default connect(mapStateToProps)(ItemTable);
