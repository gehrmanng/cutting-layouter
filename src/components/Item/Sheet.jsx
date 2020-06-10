// Library imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

// Local component imports
import ItemContainer from './ItemContainer';

// Local data object imports
import { Sheet as PackedSheet } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles((theme) => ({
  root: {
    '&:not(:first-child)': {
      paddingTop: theme.spacing(3),
    },
  },

  container: {
    border: '1px solid black',
    boxSizing: 'content-box',
  },
}));

/**
 * A functional component that renders a layout sheet.
 *
 * @param {Array.<Bin>} bins All layout bins to be rendered
 * @return {JSX} The component markup
 */
const Sheet = ({ maxWidth, sheet }) => {
  const classes = useStyles();
  const [scale, setScale] = useState(1);

  /**
   * Side effect that calculates the zoom scale.
   */
  useEffect(() => {
    if (!sheet) {
      return;
    }

    setScale(Math.min(1, maxWidth / sheet.width));
    // setScale(1);
  }, [sheet]);

  if (!sheet) {
    return <div />;
  }

  const style = {
    width: Math.round(sheet.width * scale),
    height: Math.round(sheet.height * scale),
    position: 'relative',
  };

  return (
    <div className={classes.root}>
      <div className={classes.container} style={style} data-scale={scale}>
        <ItemContainer sheetArea={sheet.sheetArea} scale={scale} />
      </div>
    </div>
  );
};

// Component property types
Sheet.propTypes = {
  maxWidth: PropTypes.number.isRequired,
  sheet: PropTypes.instanceOf(PackedSheet),
};

// Component default properties
Sheet.defaultProps = {
  sheet: undefined,
};

// Export the component as default
export default Sheet;
