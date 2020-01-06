// Library imports
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

// Local component imports
import Item from './Item';

// Local data object imports
import { SheetArea } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles(theme => ({
  nestedContainer: {
    position: 'absolute',
  },
}));

/**
 * A functional component that renders a layout bin.
 *
 * @param {Bin} bin - The bin to be rendered
 * @param {number} scale - The zoom scale
 * @returns {JSX} The component markup
 */
const ItemContainer = ({ sheetArea, scale }) => {
  const classes = useStyles();

  if (!sheetArea) {
    return <div />;
  }

  const style = {
    width: sheetArea.width * scale,
    height: sheetArea.height * scale,
    top: sheetArea.posY * scale,
    left: sheetArea.posX * scale,
    borderTop: `${Math.round(sheetArea.cuttingWidth.top * scale)}px solid black`,
    borderRight: `${Math.round(sheetArea.cuttingWidth.right * scale)}px solid black`,
    borderBottom: `${Math.round(sheetArea.cuttingWidth.bottom * scale)}px solid black`,
    borderLeft: `${Math.round(sheetArea.cuttingWidth.left * scale)}px solid black`,
  };

  return (
    <div
      className={classes.nestedContainer}
      style={style}
      data-width={sheetArea.width}
      data-height={sheetArea.height}
      data-posx={sheetArea.posX}
      data-posy={sheetArea.posY}>
      {sheetArea.rects &&
        sheetArea.rects.map(rect => <Item key={rect.id} rect={rect} scale={scale} />)}
      {sheetArea.nestedAreas &&
        sheetArea.nestedAreas.map(nestedArea => (
          <ItemContainer key={nestedArea.id} sheetArea={nestedArea} scale={scale} />
        ))}
    </div>
  );
};

// Component property types
ItemContainer.propTypes = {
  sheetArea: PropTypes.instanceOf(SheetArea),
  scale: PropTypes.number,
};

// Component default properties
ItemContainer.defaultProps = {
  sheetArea: undefined,
  scale: 1,
};

// Export the component as default
export default ItemContainer;
