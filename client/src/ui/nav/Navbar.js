import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import HomeIcon from '@material-ui/icons/Home';
import FacebookLogin from 'react-facebook-login';

class Navbar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool,
    responseFacebook: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isLoggedIn: false,
  }

  render() {
    const { classes, isLoggedIn, responseFacebook, handleLogout } = this.props;
    return (
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
          {/*{*/}
            {/*isLoggedIn ? (*/}
              {/*<Button color="inherit" component={Link} to="/dashboard">*/}
                {/*Dashboard*/}
              {/*</Button>*/}
            {/*) : ''*/}
          {/*}*/}
          { this.props.children }
          <div className={classes.flex} />
          {
            isLoggedIn ?
              <Button
                color="inherit"
                onClick={handleLogout}
                className={classes.logoutButton}
              >Logout
              </Button> :
              <FacebookLogin
                appId="1949273201750772"
                callback={responseFacebook}
                fields="name,email,picture"
                icon="fa-facebook"
                className={classes.loginButton}
              />
          }
        </Toolbar>
      </AppBar>
    );
  }
}

const styles = {
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

export default withStyles(styles)(Navbar);
