// Library imports
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

// Local component imports
import Item from './Item';

// Local data object imports
import { SheetArea } from '../../bin-packing';

// Styling definitions
const useStyles = makeStyles((theme) => ({
  nestedContainer: {
    position: 'absolute',
  },
}));

/**
 * A functional component that renders a layout bin.
 *
 * @param {Bin} bin The bin to be rendered
 * @param {number} scale The zoom scale
 * @return {JSX} The component markup
 */
const ItemContainer = ({ sheetArea, scale }) => {
  const classes = useStyles();

  if (!sheetArea) {
    return <div />;
  }

  const style = {
    width: Math.round(sheetArea.width * scale),
    height: Math.round(sheetArea.height * scale),
    top: Math.round(sheetArea.posY * scale),
    left: Math.round(sheetArea.posX * scale),
    borderRight: `${Math.round(sheetArea.cuttingWidth.right * scale)}px solid black`,
    borderBottom: `${Math.round(sheetArea.cuttingWidth.bottom * scale)}px solid black`,
  };

  return (
    <div
      id={sheetArea.id}
      className={classes.nestedContainer}
      style={style}
      data-width={sheetArea.width}
      data-height={sheetArea.height}
      data-fullheight={sheetArea.fullHeight}
      data-maxheight={sheetArea.maxHeight}
      data-posx={sheetArea.posX}
      data-posy={sheetArea.posY}
      data-cuts={sheetArea.numberOfCuts}
    >
      {sheetArea.rects &&
        sheetArea.rects.map((rect) => <Item key={rect.id} rect={rect} scale={scale} />)}
      {sheetArea.nestedAreas &&
        sheetArea.nestedAreas.map((nestedArea) => (
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
