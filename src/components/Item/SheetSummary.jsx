import React from 'react';
import PropTypes from 'prop-types';
import { Grid, makeStyles } from '@material-ui/core';

import SheetSummaryItem from './SheetSummaryItem';

import { Sheet } from '../../bin-packing';
import Job from '../../data/Job';

// Styling definitions
const useStyles = makeStyles(theme => ({
  layoutSummary: {
    fontWeight: 'bold',
  },
}));

const SheetSummary = ({ job, sheet }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <SheetSummaryItem
        classes={{ text: classes.layoutSummary }}
        i18nKey="SheetCard.summary.layoutSummary"
        sheetNumber={sheet.sheetNumber + 1}
        totalSheets={job.sheets.length}
        material={sheet.material.name}
        thickness={sheet.material.thickness}
        width={sheet.material.width}
        height={sheet.material.height}
      />
      <Grid item xs={4}>
        <Grid container>
          <SheetSummaryItem i18nKey="SheetCard.summary.sheetPanels" panels={sheet.numberOfRects} />
          <SheetSummaryItem i18nKey="SheetCard.summary.jobPanels" panels={job.numberOfRects} />
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <Grid container>
          <SheetSummaryItem i18nKey="SheetCard.summary.sheetWastage" wastage={sheet.wastageStr} />
          <SheetSummaryItem i18nKey="SheetCard.summary.jobWastage" wastage={job.wastage} />
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <Grid container>
          <SheetSummaryItem i18nKey="SheetCard.summary.numberOfCuts" cuts={sheet.numberOfCuts} />
          <SheetSummaryItem i18nKey="SheetCard.summary.jobCuts" cuts={job.numberOfCuts} />
        </Grid>
      </Grid>
    </Grid>
  );
};

SheetSummary.propTypes = {
  job: PropTypes.instanceOf(Job).isRequired,
  sheet: PropTypes.instanceOf(Sheet).isRequired,
};

export default SheetSummary;
