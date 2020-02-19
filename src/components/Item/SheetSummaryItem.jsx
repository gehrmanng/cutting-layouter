import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

const SheetSummaryItem = ({ classes, i18nKey, ...rest }) => {
  return (
    <Grid item xs={12} classes={{ item: classes.text }}>
      <I18n className={classes.text} i18nKey={i18nKey} vars={{ ...rest }} />
    </Grid>
  );
};

SheetSummaryItem.propTypes = {
  classes: PropTypes.object,
  i18nKey: PropTypes.string.isRequired,
};

SheetSummaryItem.defaultProps = {
  classes: {},
};

export default SheetSummaryItem;
