import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, Icon, IconButton, Tooltip, makeStyles } from '@material-ui/core';
import I18n from '@gehrmanng/react-i18n';

// Styling definitions
const useStyles = makeStyles(theme => ({
  drawer: {
    width: theme.spacing(7) + 1,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(8) + 1,
    },
  },
  button: {
    margin: theme.spacing(),
  },
  toolbar: {
    ...theme.mixins.toolbar,
    marginBottom: theme.spacing(2),
  },
  active: {
    color: theme.palette.primary.main,
  },
}));

const SideNavigation = () => {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerClose,
      }}>
      <div className={classes.toolbar} />
      {[
        ['table_chart', '/layout', 'layout'],
        ['category', '/materials', 'materials'],
        ['settings', '/settings', 'settings'],
      ].map(([icon, target, i18nKey]) => (
        <Tooltip key={target} title={<I18n i18nKey={`navigation.${i18nKey}`} />}>
          <IconButton
            key={target}
            className={classes.button}
            component={NavLink}
            to={target}
            activeClassName={classes.active}>
            <Icon>{icon}</Icon>
          </IconButton>
        </Tooltip>
      ))}
    </Drawer>
  );
};

export default SideNavigation;
