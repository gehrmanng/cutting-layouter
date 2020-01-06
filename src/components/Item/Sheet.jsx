// Library imports
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

// Local component imports
import ItemContainer from './ItemContainer';

// Local data object imports
import { Sheet as PackedSheet } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles(theme => ({
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
 * @param {Bin[]} bins - All layout bins to be rendered
 * @returns {JSX} The component markup
 */
const Sheet = ({ sheet }) => {
  const classes = useStyles();
  const [scale, setScale] = useState(1);
  const paperRef = useRef(null);

  /**
   * Side effect that calculates the zoom scale.
   */
  useEffect(() => {
    const paper = paperRef.current;
    if (!paper || !sheet) {
      return;
    }

    const width = paper.offsetWidth;

    setScale(Math.min(1, width / sheet.width));
  }, [sheet]);

  if (!sheet) {
    return <div />;
  }

  const style = {
    width: sheet.width * scale,
    height: sheet.height * scale,
    position: 'relative',
  };

  return (
    <div ref={paperRef} className={classes.root}>
      <div className={classes.container} style={style} data-scale={scale}>
        <ItemContainer sheetArea={sheet.sheetArea} scale={scale} />
      </div>
    </div>
  );
};

// Component property types
Sheet.propTypes = {
  sheet: PropTypes.instanceOf(PackedSheet),
};

// Component default properties
Sheet.defaultProps = {
  sheet: undefined,
};

// Export the component as default
export default Sheet;
