import React from 'react';
import { Card, CardContent, CardHeader, Icon, IconButton, makeStyles } from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

import MaterialTable from './MaterialTable';

// Styling definitions
const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
});

const MaterialDataCard = () => {
  const classes = useStyles();

  const handleOpenDialog = () => {};

  const handleEditClick = material => {};

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton aria-label="settings" onClick={handleOpenDialog}>
            <Icon>add</Icon>
          </IconButton>
        }
        title={<I18n i18nKey="MaterialDataCard.title" />}
        titleTypographyProps={{
          variant: 'h6',
        }}
      />

      <CardContent>
        <MaterialTable onEdit={handleEditClick} />
      </CardContent>
    </Card>
  );
};

export default MaterialDataCard;
