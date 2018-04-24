import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import HomeIcon from '@material-ui/icons/Home';
import FacebookLogin from 'react-facebook-login';
import {
  getJwt,
  removeJwt,
  facebookResponse,
} from '../actions/users.actions';
import Login from '../Login';
import Dashboard from './dashboard/Dashboard';
import Home from './home/Home';
import Book from './book/Book';

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
  }

  static defaultProps = {
    isLoggedIn: false,
  }

  componentWillMount() {
    // Check if already logged in
    this.props.dispatch(getJwt());
  }

  handleLogout() {
    this.props.dispatch(removeJwt());
  }

  responseFacebook(res) {
    // Get token from facebook info
    this.props.dispatch(facebookResponse(res));
  }

  render() {
    const { classes, isLoggedIn } = this.props;
    return (
      <Router>
        <div className={classes.root}>
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
              {
                isLoggedIn ? (
                  <Button color="inherit" component={Link} to="/dashboard">
                    Dashboard
                  </Button>
                ) : ''
              }
              <div className={classes.flex} />
              {
                isLoggedIn ?
                  <Button
                    color="inherit"
                    onClick={this.handleLogout.bind(this)}
                    className={classes.logoutButton}
                  >Logout
                  </Button> :
                  <FacebookLogin
                    appId="1949273201750772"
                    callback={this.responseFacebook.bind(this)}
                    fields="name,email,picture"
                    icon="fa-facebook"
                    className={classes.loginButton}
                  />
              }
            </Toolbar>
          </AppBar>
          <Route exact path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/book/:bookId" component={Book} />
        </div>
      </Router>
    );
  }
}

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  homeButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  logoutButton: {
    textAlign: 'right',
  },
  loginButton: {
    textAlign: 'right',
  },
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.token !== null,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(App));
