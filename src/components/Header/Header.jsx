// Library imports
import React, { useContext } from 'react';
import {
  AppBar,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import I18n, { I18nContext, TYPES } from '@gehrmanng/react-i18n';

// Styling definitions
const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

/**
 * A functional component that renders a page header.
 *
 * @returns {JSX} The component markup
 */
const Header = () => {
  const classes = useStyles();

  // Get the dispatch method from the i18n context
  const { dispatch } = useContext(I18nContext);

  const handleChangeLanguage = lang => () => {
    dispatch({ type: TYPES.SET_LANGUAGE, payload: lang });
  };

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <I18n i18nKey="Header.title" />
        </Typography>
        <ButtonGroup variant="text" size="small" color="inherit">
          <Button onClick={handleChangeLanguage('en_US')}>EN</Button>
          <Button onClick={handleChangeLanguage('de_DE')}>DE</Button>
        </ButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

// Export the component as default
export default Header;
