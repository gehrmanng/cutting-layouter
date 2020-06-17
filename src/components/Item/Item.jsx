// Library imports
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

// Local data object imports
import { Rect } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles((theme) => ({
  item: {
    position: 'absolute',
    fontSize: 18,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textAlign: 'center',

    '&:hover': {
      backgroundColor: '#CCC !important',
    },
  },
}));

/**
 * A functional component that renders a rectangular representing a single layout item.
 *
 * @param {Rect} rect The rectangular to be rendered
 * @param {number} scale The zoom scale
 * @return {JSX} The component markup
 */
const Item = ({ rect, scale }) => {
  const classes = useStyles();

  if (!rect) {
    return null;
  }

  const style = {
    width: Math.round(rect.width * scale),
    height: Math.round(rect.height * scale),
    lineHeight: `${Math.round(rect.height * scale)}px`,
    top: Math.round(rect.posY * scale),
    left: Math.round(rect.posX * scale),
    borderRight: `${Math.round(rect.cuttingWidth.right * scale)}px solid black`,
    borderBottom: `${Math.round(rect.cuttingWidth.bottom * scale)}px solid black`,
    backgroundColor: rect.color,
  };

  return (
    <div
      className={classes.item}
      style={style}
      data-width={rect.width}
      data-height={rect.height}
      data-posx={rect.posX}
      data-posy={rect.posY}
      data-cuts={rect.numberOfCuts}
    >
      {`${rect.name}${rect.index + 1}`}
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
