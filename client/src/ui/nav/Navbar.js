import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import MenuIcon from '@material-ui/icons/Menu';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import sizeMe from 'react-sizeme' 

class Navbar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool,
    responseFacebook: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
    handleMenu: PropTypes.func.isRequired,
    retrieveNavBarHeight: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isLoggedIn: false,
  }

  state = {
   // navBarHeight: 0,
  }

  onHeightChange(height) {
    

    
  }

  componentWillReceiveProps(nextProps) {
    const { retrieveNavBarHeight } = this.props;
    if (this.props.size.height !== nextProps.size.height) {
      retrieveNavBarHeight(nextProps.size.height);
    }
  }

  render() {
    const {
      classes, isLoggedIn, responseFacebook, handleLogout, handleMenu, navBarHeight //retrieveNavBarHeight
    } = this.props;

    return (
      <AppBar className={classes.appBar} position="static">
        <Toolbar className={classes.ToolbarRoot}>
          <IconButton
            color="inherit"
            aria-label="Menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          { this.props.children }
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
                className={classes.loginButton}
                size="small"
                render={renderProps => (
                  <Button
                    color="inherit"
                    onClick={renderProps.onClick}
                  >Login</Button>
                )}
              />
          }
        </Toolbar>
      </AppBar>
    );
  }
}

const styles = theme => ({
  flex: {
    flex: 1,
  },
  appBar: {
    position: 'fixed',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: theme.zIndex.drawer + 1,
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
  'ToolbarRoot': {
    minHeight: '51px',
  },
});

export default sizeMe({ monitorHeight: true })(withStyles(styles)(Navbar));
