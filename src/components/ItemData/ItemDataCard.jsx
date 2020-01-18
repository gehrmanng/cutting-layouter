// Library imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardContent, CardHeader, Icon, IconButton, makeStyles } from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Local component imports
import ItemTable from './ItemTable';
import ItemDialog from './ItemDialog';

// Local Redux action imports
import { addItem, updateItem } from '../../actions/itemActions';

// Styling definitions
const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
});

/**
 * A functional component that renders a card showing the layout item data.
 *
 * @param {function} dispatch - The Redux dispatch function
 * @returns {JSX} The component markup
 */
const ItemDataCard = ({ dispatch }) => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  /**
   * Click handler that is called when the edit button of a single item is clicked.
   *
   * @param {Item} item - The item to be edited
   */
  const handleEditClick = item => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  /**
   * Callback function that is called when the item dialog has been closed.
   *
   * @param {Item} item - The created or updated layout item or undefined
   *                      if the dialog has been canceled
   */
  const handleCloseDialog = item => {
    if (item) {
      dispatch(selectedItem && item.id === selectedItem.id ? updateItem(item) : addItem(item));
    }
    setDialogOpen(false);
    setSelectedItem(undefined);
  };

  /**
   * Click handler that opens the item dialog.
   */
  const handleOpenDialog = () => {
    setDialogOpen(true);
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
          title={<I18n i18nKey="ItemDataCard.title" />}
          titleTypographyProps={{
            variant: 'h6',
          }}
        />

        <CardContent>
          <ItemTable onEdit={handleEditClick} />
        </CardContent>
      </Card>
      <ItemDialog onClose={handleCloseDialog} open={dialogOpen} item={selectedItem} />
    </>
  );
};

// Component property types
ItemDataCard.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

// Export the component as default and connect it to the Redux store
export default connect()(ItemDataCard);
