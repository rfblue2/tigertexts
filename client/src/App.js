import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Home from './home/Home';
import Book from './book/Book';

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                className={classes.homeButton}
                color="inherit"
                aria-label="Home"
                component={({ ...props }) => <Link to="/" {...props} />}
              >
                <HomeIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Route exact path="/" component={Home} />
          <Route path="/book/:bookId" component={Book} />
        </div>
      </Router>
    );
  }
}

const styles = {
  homeButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

export default withStyles(styles)(App);
