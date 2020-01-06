// Library imports
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

// Local data object imports
import { Rect } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles(theme => ({
  item: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,

    '&:hover': {
      backgroundColor: '#CCC',
    },
  },
}));

/**
 * A functional component that renders a rectangular representing a single layout item.
 *
 * @param {Rect} rect - The rectangular to be rendered
 * @param {number} scale - The zoom scale
 * @returns {JSX} The component markup
 */
const Item = ({ rect, scale }) => {
  const classes = useStyles();

  if (!rect) {
    return null;
  }

  const style = {
    width: rect.width * scale,
    height: rect.height * scale,
    top: rect.posY * scale,
    left: rect.posX * scale,
    borderTop: `${Math.round(rect.cuttingWidth.top * scale)}px solid black`,
    borderRight: `${Math.round(rect.cuttingWidth.right * scale)}px solid black`,
    borderBottom: `${Math.round(rect.cuttingWidth.bottom * scale)}px solid black`,
    borderLeft: `${Math.round(rect.cuttingWidth.left * scale)}px solid black`,
  };

  return (
    <div
      className={classes.item}
      style={style}
      data-width={rect.width}
      data-height={rect.height}
      data-posx={rect.posX}
      data-posy={rect.posY}>
      {rect.name}
    </div>
  );
};

// Component property types
Item.propTypes = {
  rect: PropTypes.instanceOf(Rect),
  scale: PropTypes.number,
};

// Component default properties
Item.defaultProps = {
  rect: undefined,
  scale: 1,
};

// Export the component as default
export default Item;
