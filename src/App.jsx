// Library imports
import React from 'react';
import { makeStyles, CssBaseline } from '@material-ui/core';

// Local component imports
import Header from './components/Header/Header';
import ItemDataCard from './components/ItemData/ItemDataCard';
import SheetCard from './components/Item/SheetCard';

// Styling definitions
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(3),
  },
}));

/**
 * A functional component that renders the main application.
 */
function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <CssBaseline />

      <Header />

      <main className={classes.root}>
        <ItemDataCard />
        <SheetCard />
      </main>
    </div>
  );
}

// Export the component as default
export default App;
