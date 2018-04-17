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
import Home from './home/Home';
import Book from './book/Book';

class App extends Component {

  state = {
    isLoggedIn: false,
  }

  handleLogout() {
    this.setState({ isLoggedIn: false, userId: null });
  }

  async responseFacebook(res) {
    try {
      // console.log(JSON.stringify(res));
      const loginRes = await fetch(`/api/users/login?token=${res.accessToken}&email=${res.email}&name=${res.name}&userId=${res.id}`);
      if (loginRes.ok) {
        this.setState({ isLoggedIn: true, userId: res.id });
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
              {
                isLoggedIn ?
                  <Button onClick={this.handleLogout.bind(this)}>Logout</Button> :
                  <FacebookLogin
                    appId="1949273201750772"
                    callback={this.responseFacebook.bind(this)}
                    fields="name,email,picture"
                    icon="fa-facebook"
                  />
              }
            </Toolbar>
          </AppBar>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
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
