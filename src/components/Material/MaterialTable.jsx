import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';
import _ from 'underscore';

// Local Redux action imports
import { removeMaterial } from '../../actions/actionTypes';

// Local data object imports
import { Item, Material } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  actionColumn: {
    width: 130,
  },
  buttonSpacer: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
}));

const MaterialTable = ({ onEdit, materials, items, dispatch }) => {
  const classes = useStyles();

  const handleDelete = id => () => {
    dispatch(removeMaterial(id));
  };

  const handleEdit = material => () => {
    onEdit(material);
  };

  const checkMaterialIsUsed = material => {
    return items.filter(i => i.material === material.id).length;
  };

  return (
    <Table className={classes.table} size="small">
      <TableHead>
        <TableRow>
          <TableCell>
            <I18n i18nKey="MaterialDataCard.MaterialTable.name" />
          </TableCell>
          <TableCell align="right">
            <I18n i18nKey="MaterialDataCard.MaterialTable.width" />
          </TableCell>
          <TableCell align="right">
            <I18n i18nKey="MaterialDataCard.MaterialTable.height" />
          </TableCell>
          <TableCell align="right">
            <I18n i18nKey="MaterialDataCard.MaterialTable.thickness" />
          </TableCell>
          <TableCell align="center">
            <I18n i18nKey="MaterialDataCard.MaterialTable.grain" />
          </TableCell>
          <TableCell className={classes.actionColumn} />
        </TableRow>
      </TableHead>
      <TableBody>
        {materials.map(material => (
          <TableRow key={material.id}>
            <TableCell component="th" scope="row">
              {material.name}
            </TableCell>
            <TableCell align="right">
              {material.width}
              <I18n i18nKey="global.unit.mm" />
            </TableCell>
            <TableCell align="right">
              {material.height}
              <I18n i18nKey="global.unit.mm" />
            </TableCell>
            <TableCell align="right">
              {material.thickness}
              <I18n i18nKey="global.unit.mm" />
            </TableCell>
            <TableCell align="center">
              <Icon>{`${material.hasGrain ? 'check' : 'close'}`}</Icon>
            </TableCell>
            <TableCell align="right" className={classes.actionColumn}>
              <IconButton onClick={handleEdit(material)}>
                <Icon>edit</Icon>
              </IconButton>
              {checkMaterialIsUsed(material) ? (
                <div className={classes.buttonSpacer} />
              ) : (
                <IconButton onClick={handleDelete(material.id)}>
                  <Icon>delete</Icon>
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Component property types
MaterialTable.propTypes = {
  onEdit: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  materials: PropTypes.arrayOf(PropTypes.instanceOf(Material)),
  items: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
};

// Default property values
MaterialTable.defaultProps = {
  materials: [],
  items: [],
};

/**
 * Mapping function to extract the required properties from the Redux store.
 *
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => ({
  items: state.itemReducer.items,
  materials: state.materialReducer.materials,
});

export default connect(mapStateToProps)(MaterialTable);
