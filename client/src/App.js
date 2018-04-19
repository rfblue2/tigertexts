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
import Button from 'material-ui/Button';
import HomeIcon from '@material-ui/icons/Home';
import FacebookLogin from 'react-facebook-login';
import Login from './Login';
import Dashboard from './dashboard/Dashboard';
import Home from './home/Home';
import Book from './book/Book';

class App extends Component {
  state = {
    isLoggedIn: false,
  }

  async componentWillMount() {
    // check if user already logged in
    const token = localStorage.getItem('jwtToken');
    console.log(token);
    if (!token || token === '') return;
    // get user from token
    try {
      // Fetch User information
      const res = await fetch('/api/users/me', {
        headers: { 'x-auth-token': token },
      });
      // token probably expired
      if (res.status === 401) {
        localStorage.removeItem('jwtToken');
        return;
      }
    } catch (e) {
      console.log(`error: ${e}`);
    }
    // TODO this is a good place for dispatching redux to fetch user data
    this.setState({ isLoggedIn: true, jwt: token });
  }

  handleLogout() {
    localStorage.removeItem('jwtToken');
    this.setState({ isLoggedIn: false, jwt: null });
  }

  async responseFacebook(res) {
    try {
      // console.log(`Facebook response: ${JSON.stringify(res)}`);
      const loginRes = await fetch(`/api/users/login?token=${res.accessToken}&email=${res.email}&name=${res.name}&userId=${res.id}`);
      if (loginRes.ok) {
        // console.log(JSON.stringify(userObj, null, 2));
        const jwtToken = loginRes.headers.get('x-auth-token');
        localStorage.setItem('jwtToken', jwtToken);
        this.setState({ isLoggedIn: true, jwt: jwtToken });
      }
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  render() {
    const { isLoggedIn } = this.state;
    const { classes } = this.props;
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

export default withStyles(styles)(App);
