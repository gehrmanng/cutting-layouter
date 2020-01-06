// Library imports
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
} from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Local data object imports
import { Item, Material } from '../../bin-packing';

// Constants definition
const initialItem = {
  name: '',
  width: 0,
  height: 0,
  quantity: 1,
};

/**
 * A functional component that renders a dialog to edit a layout item.
 *
 * @param {function} onClose - A callback function that is called when the dialog is closed.
 * @param {boolean} open - A flag indicating if the dialog is open
 * @param {Item} item - An optional existing item. If not provided a new item will be created.
 * @returns {JSX} The component markup
 */
const ItemDialog = ({ onClose, open, item, materials }) => {
  const [values, setValues] = useState(initialItem);

  /**
   * A side effect that fills the local form fields with the given item data.
   */
  useEffect(() => {
    if (!item) {
      return;
    }

    setValues({
      name: item.name,
      width: parseInt(item.width, 10),
      height: parseInt(item.height, 10),
      quantity: parseInt(item.quantity, 10),
      material: parseInt(item.material, 10),
    });
  }, [item]);

  /**
   * An input change event handler that updates the corresponding data values.
   *
   * @param {object} e - The change event
   */
  const handleInputChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  /**
   * Click handler that is called when the save button is clicked.
   */
  const handleSave = () => {
    onClose(
      new Item(
        values.name,
        parseInt(values.width, 10),
        parseInt(values.height, 10),
        parseInt(values.quantity, 10),
        parseInt(values.material, 10),
        item ? item.id : undefined,
      ),
    );
    setValues(initialItem);
  };

  /**
   * Click handler that is called when the cancel button is clicked.
   */
  const handleCancel = () => {
    setValues(initialItem);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <I18n i18nKey="ItemDataCard.ItemDialog.title" />
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          name="name"
          label={<I18n i18nKey="ItemDataCard.ItemDialog.name" />}
          type="text"
          value={values.name}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
        />
        <TextField
          name="width"
          label={<I18n i18nKey="ItemDataCard.ItemDialog.width" />}
          type="number"
          value={values.width}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
        />
        <TextField
          name="height"
          label={<I18n i18nKey="ItemDataCard.ItemDialog.height" />}
          type="number"
          value={values.height}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
        />
        <TextField
          name="quantity"
          label={<I18n i18nKey="ItemDataCard.ItemDialog.quantity" />}
          type="number"
          value={values.quantity}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="material-label">
            <I18n i18nKey="ItemDataCard.ItemDialog.material" />
          </InputLabel>
          <Select
            name="material"
            labelId="material-label"
            onChange={handleInputChange}
            value={values.material}>
            {materials.map(material => (
              <MenuItem value={material.id} key={material.id}>
                {`${material.name} (${material.width}x${material.height}x${material.thickness}mm)`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Component property types
ItemDialog.propTypes = {
  item: PropTypes.instanceOf(Item),
  materials: PropTypes.arrayOf(PropTypes.instanceOf(Material)),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

// Default property values
ItemDialog.defaultProps = {
  item: undefined,
  open: false,
  materials: [],
};

const mapStateToProps = state => ({
  materials: state.materialReducer.materials,
});

// Export the component as default
export default connect(mapStateToProps)(ItemDialog);
