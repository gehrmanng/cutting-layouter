// Library imports
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Local data object imports
import { Material } from '../../bin-packing';

// Constants definition
const initialMaterial = {
  name: '',
  width: 0,
  height: 0,
  thickness: 10,
  hasGrain: false,
};

/**
 * A functional component that renders a dialog to edit a layout material.
 *
 * @param {function} onClose - A callback function that is called when the dialog is closed.
 * @param {boolean} open - A flag indicating if the dialog is open
 * @param {Material} material - An optional existing material. If not provided a new material will be created.
 * @returns {JSX} The component markup
 */
const MaterialDialog = ({ onClose, open, material }) => {
  const [values, setValues] = useState(initialMaterial);

  /**
   * A side effect that fills the local form fields with the given material data.
   */
  useEffect(() => {
    if (!material) {
      return;
    }

    setValues({
      name: material.name,
      width: parseInt(material.width, 10),
      height: parseInt(material.height, 10),
      thickness: parseInt(material.thickness, 10),
      hasGrain: material.hasGrain || false,
    });
  }, [material]);

  /**
   * An input change event handler that updates the corresponding data values.
   *
   * @param {object} e - The change event
   */
  const handleInputChange = e => {
    const { name, value, checked } = e.target;
    if (name === 'hasGrain') {
      setValues({ ...values, [name]: checked });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  /**
   * Click handler that is called when the save button is clicked.
   */
  const handleSave = () => {
    onClose(
      new Material(
        material && material.id ? material.id : undefined,
        values.name,
        parseInt(values.width, 10),
        parseInt(values.height, 10),
        parseInt(values.thickness, 10),
        values.hasGrain,
      ),
    );
    setValues(initialMaterial);
  };

  /**
   * Click handler that is called when the cancel button is clicked.
   */
  const handleCancel = () => {
    setValues(initialMaterial);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <I18n i18nKey="MaterialDataCard.MaterialDialog.title" />
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          name="name"
          label={<I18n i18nKey="MaterialDataCard.MaterialDialog.name" />}
          type="text"
          value={values.name}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
        />
        <TextField
          name="width"
          label={<I18n i18nKey="MaterialDataCard.MaterialDialog.width" />}
          type="number"
          value={values.width}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
        />
        <TextField
          name="height"
          label={<I18n i18nKey="MaterialDataCard.MaterialDialog.height" />}
          type="number"
          value={values.height}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
        />
        <TextField
          name="thickness"
          label={<I18n i18nKey="MaterialDataCard.MaterialDialog.thickness" />}
          type="number"
          value={values.thickness}
          fullWidth
          onChange={handleInputChange}
          margin="dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={values.hasGrain}
              onChange={handleInputChange}
              color="default"
              name="hasGrain"
            />
          }
          label={<I18n i18nKey="MaterialDataCard.MaterialDialog.hasGrain" />}
        />
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
MaterialDialog.propTypes = {
  material: PropTypes.instanceOf(Material),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

// Default property values
MaterialDialog.defaultProps = {
  material: undefined,
  open: false,
};

// Export the component as default
export default MaterialDialog;
