// Library imports
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  makeStyles,
} from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Local data object imports
import { Item, Material } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles((theme) => ({
  addMore: {
    flexGrow: 1,
    marginLeft: 0,
  },
}));

/**
 * A functional component that renders a dialog to edit a layout item.
 *
 * @param {function} onClose A callback function that is called when the dialog is closed.
 * @param {boolean} open A flag indicating if the dialog is open
 * @param {Item} item An optional existing item. If not provided a new item will be created.
 * @return {JSX} The component markup
 */
const ItemDialog = ({ onClose, open, item, materials, settings }) => {
  const classes = useStyles();

  const initialItem = {
    name: '',
    width: settings.minItemWidth || 1,
    height: settings.minItemHeight || 1,
    quantity: 1,
    material: '',
  };
  const [values, setValues] = useState(initialItem);
  const [errors, setErrors] = useState({});
  const [keepDialogOpen, setKeepDialogOpen] = useState(false);

  /**
   * A side effect that fills the local form fields with the given item data.
   */
  useEffect(() => {
    if (!item) {
      return;
    }

    setValues({
      name: item.name,
      width: item.width,
      height: item.height,
      quantity: item.quantity,
      material: item.material,
    });
  }, [item]);

  const _validate = () => {
    let valid = true;
    const validationErrors = {};
    if (!values.width) {
      validationErrors.width = 'errors.width.required';
      valid = false;
    }
    if (values.width < settings.minItemWidth) {
      validationErrors.width = 'errors.width.minValue';
      valid = false;
    }
    if (!values.height) {
      validationErrors.height = 'errors.height.required';
      valid = false;
    }
    if (values.height < settings.minItemHeight) {
      validationErrors.height = 'errors.height.minValue';
      valid = false;
    }
    if (!values.quantity) {
      validationErrors.quantity = 'errors.quantity.required';
      valid = false;
    }
    if (values.quantity < 1) {
      validationErrors.quantity = 'errors.quantity.minValue';
      valid = false;
    }
    if (!values.material) {
      validationErrors.material = 'errors.material.required';
      valid = false;
    }

    setErrors(validationErrors);

    return valid;
  };

  /**
   * An input change event handler that updates the corresponding data values.
   *
   * @param {object} e The change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'addMoreCheckbox') {
      setKeepDialogOpen(!keepDialogOpen);
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  /**
   * Click handler that is called when the save button is clicked.
   */
  const handleSave = () => {
    const valid = _validate();
    if (!valid) {
      return;
    }

    let newItem;
    if (item) {
      newItem = Item.of(item);
      newItem.width = parseInt(values.width, 10);
      newItem.height = parseInt(values.height, 10);
      newItem.quantity = parseInt(values.quantity, 10);
      newItem.material = parseInt(values.material, 10);
    } else {
      newItem = new Item(
        values.name,
        parseInt(values.width, 10),
        parseInt(values.height, 10),
        parseInt(values.quantity, 10),
        parseInt(values.material, 10),
        item ? item.id : undefined,
      );
    }
    onClose(newItem, keepDialogOpen);
    setValues(initialItem);
  };

  /**
   * Click handler that is called when the cancel button is clicked.
   */
  const handleCancel = () => {
    setValues(initialItem);
    setKeepDialogOpen(false);
    setErrors({});
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
          error={!!errors.name}
          label={<I18n i18nKey={errors.name ? errors.name : 'ItemDataCard.ItemDialog.name'} />}
          type="text"
          value={values.name}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
        />
        <TextField
          name="width"
          error={!!errors.width}
          label={
            <I18n
              i18nKey={errors.width ? errors.width : 'ItemDataCard.ItemDialog.width'}
              vars={{ min: settings.minItemWidth }}
            />
          }
          type="number"
          value={values.width}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
          inputProps={{ min: settings.minItemWidth }}
        />
        <TextField
          name="height"
          error={!!errors.height}
          label={
            <I18n
              i18nKey={errors.height ? errors.height : 'ItemDataCard.ItemDialog.height'}
              vars={{ min: settings.minItemHeight }}
            />
          }
          type="number"
          value={values.height}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
          inputProps={{ min: settings.minItemHeight }}
        />
        <TextField
          name="quantity"
          error={!!errors.quantity}
          label={
            <I18n
              i18nKey={errors.quantity ? errors.quantity : 'ItemDataCard.ItemDialog.quantity'}
              vars={{ min: 1 }}
            />
          }
          type="number"
          value={values.quantity}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
          inputProps={{ min: 1 }}
        />
        <FormControl fullWidth margin="dense" error={!!errors.material}>
          <InputLabel id="material-label">
            <I18n
              i18nKey={errors.material ? errors.material : 'ItemDataCard.ItemDialog.material'}
            />
          </InputLabel>
          <Select
            name="material"
            labelId="material-label"
            onChange={handleInputChange}
            value={values.material}>
            {materials.map((material) => (
              <MenuItem value={material.id} key={material.id}>
                {`${material.name} (${material.width}x${material.height}x${material.thickness}mm)`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          control={
            <Checkbox
              checked={keepDialogOpen}
              onChange={handleInputChange}
              name="addMoreCheckbox"
              color="primary"
            />
          }
          label={<I18n i18nKey="ItemDataCard.ItemDialog.addMore" />}
          className={classes.addMore}
        />
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
  settings: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

// Default property values
ItemDialog.defaultProps = {
  item: undefined,
  open: false,
  materials: [],
  settings: {},
};

const mapStateToProps = (state) => ({
  materials: state.materialReducer.materials,
  settings: state.settingsReducer,
});

// Export the component as default
export default connect(mapStateToProps)(ItemDialog);
