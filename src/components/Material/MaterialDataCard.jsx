// Library imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Icon, IconButton, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import I18n from '@gehrmanng/react-i18n';

// Local component imports
import MaterialTable from './MaterialTable';
import MaterialDialog from './MaterialDialog';

// Local Redux action imports
import { addMaterial, updateMaterial } from '../../actions/actionTypes';

// Styling definitions
const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
});

/**
 * A functional component that renders a card showing the layout material data.
 *
 * @param {function} dispatch - The Redux dispatch function
 * @returns {JSX} The component markup
 */
const MaterialDataCard = ({ dispatch }) => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState();

  /**
   * Click handler that opens the material dialog.
   */
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  /**
   * Click handler that is called when the edit button of a single material is clicked.
   *
   * @param {Material} material - The material to be edited
   */
  const handleEditClick = material => {
    setSelectedMaterial(material);
    setDialogOpen(true);
  };

  /**
   * Callback function that is called when the material dialog has been closed.
   *
   * @param {Material} material - The created or updated layout material or undefined
   *                              if the dialog has been canceled
   */
  const handleCloseDialog = material => {
    if (material) {
      dispatch(
        selectedMaterial && material.id === selectedMaterial.id
          ? updateMaterial(material)
          : addMaterial(material),
      );
    }
    setDialogOpen(false);
    setSelectedMaterial(undefined);
  };

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={handleOpenDialog}>
              <Icon>add</Icon>
            </IconButton>
          }
          title={<I18n i18nKey="MaterialDataCard.title" />}
          titleTypographyProps={{
            variant: 'h6',
          }}
        />

        <CardContent>
          <MaterialTable onEdit={handleEditClick} />
        </CardContent>
      </Card>
      <MaterialDialog onClose={handleCloseDialog} open={dialogOpen} material={selectedMaterial} />
    </>
  );
};

// Component property types
MaterialDataCard.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

// Export the component as default
export default connect()(MaterialDataCard);
