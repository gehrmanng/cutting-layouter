// Library imports
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  Icon,
  IconButton,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Local component imports
import Sheet from './Sheet';
import SheetSummary from './SheetSummary';

// Local data object imports
import { Item, Material, Packer } from '../../bin-packing';
import Job from '../../data/Job';

// Local Redux action imports
import { updateItem } from '../../actions/itemActions';

import useDeepEffect from '../../effects/useDeepEffect';

// Styling definitions
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    overflowX: 'auto',
    marginTop: theme.spacing(3),
  },
  cardHeader: {},
  sheetContainer: {
    paddingBottom: theme.spacing(3),
  },
}));

/**
 * A functional component that renders a card containing all sheet layouts.
 *
 * @param {Item[]} items - All available layout items
 * @returns {JSX} The component markup
 */
const SheetCard = ({ items, materials, dispatch }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [sheets, setSheets] = useState([]);
  const [job] = useState(new Job());
  const cardRef = useRef(null);

  /**
   * Side effect to pack the available layout items.
   */
  useDeepEffect(
    () => {
      const packer = new Packer();
      const packedSheets = packer.pack(items, materials);
      setSheets(packedSheets);
      job.sheets = packedSheets;
      items.forEach(item => {
        dispatch(updateItem(item));
      });
    },
    items,
    ['width', 'height', 'material', 'name', 'quantity'],
  );

  return (
    <Card className={classes.root} ref={cardRef}>
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
          <div className={classes.sheetContainer} key={`${sheet.id}_container`}>
            <SheetSummary job={job} sheet={sheet} />
            <Sheet
              key={sheet.id}
              sheet={sheet}
              maxWidth={cardRef.current.offsetWidth - theme.spacing(4) - 2}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Component property types
SheetCard.propTypes = {
  items: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
  materials: PropTypes.arrayOf(PropTypes.instanceOf(Material)),
  dispatch: PropTypes.func.isRequired,
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
