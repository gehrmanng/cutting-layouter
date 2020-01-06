// Library imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardContent, CardHeader, Icon, IconButton, makeStyles } from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Local component imports
import Sheet from './Sheet';

// Local data object imports
import { Item, Material, Packer } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    marginTop: theme.spacing(3),
  },
  cardHeader: {},
}));

/**
 * A functional component that renders a card containing all sheet layouts.
 *
 * @param {Item[]} items - All available layout items
 * @returns {JSX} The component markup
 */
const SheetCard = ({ items, materials }) => {
  const classes = useStyles();
  const [sheets, setSheets] = useState([]);

  /**
   * Side effect to pack the available layout items.
   */
  useEffect(() => {
    const packer = new Packer();
    const packedSheets = packer.pack(items, materials);
    setSheets(packedSheets);
  }, [items]);

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <Icon>more_vert</Icon>
          </IconButton>
        }
        title={<I18n i18nKey="SheetCard.title" />}
        titleTypographyProps={{
          variant: 'h6',
        }}
        className={classes.cardHeader}
      />
      <CardContent>
        {sheets.map(sheet => (
          <Sheet key={sheet.id} sheet={sheet} />
        ))}
      </CardContent>
    </Card>
  );
};

// Component property types
SheetCard.propTypes = {
  items: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
  materials: PropTypes.arrayOf(PropTypes.instanceOf(Material)),
};

// Default property values
SheetCard.defaultProps = {
  items: [],
  materials: [],
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

// Export the component as default and connect it to the Redux store
export default connect(mapStateToProps)(SheetCard);
