// Library imports
import React from 'react';
import { makeStyles, CssBaseline } from '@material-ui/core';
import { Route, Redirect, Switch } from 'react-router-dom';

// Local component imports
import Header from './components/Header/Header';
import SideNavigation from './components/Navigation/SideNavigation';
import MaterialView from './components/Views/MaterialView';
import LayoutView from './components/Views/LayoutView';

// Styling definitions
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

/**
 * A functional component that renders the main application.
 */
function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Header />
      <SideNavigation />

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/layout" component={LayoutView} />
          <Route exact path="/materials" component={MaterialView} />
          <Redirect from="/" to="/layout" />
        </Switch>
      </main>
    </div>
  );
}

// Export the component as default
export default App;
