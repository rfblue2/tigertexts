import React, { Component } from 'react';
import { withWindowSizeListener } from 'react-window-size-listener';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import InfoIcon from '@material-ui/icons/Info';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SearchIcon from '@material-ui/icons/Search';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

const drawerWidth = 240;
const drawerColor = '#222222'
const drawerLabelColor = '#F0F0F0'
const drawerHighlightColor = '#404040'


class Sidebar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    showSelling: PropTypes.func.isRequired,
    showFavorites: PropTypes.func.isRequired,
    showSearch: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    navBarHeight: PropTypes.number.isRequired,
  }

  static defaultProps = {
  }


  render() {
    const {
      classes,
      open,
      showSearch,
      showSelling,
      showFavorites,
      loggedIn,
      navBarHeight,
    } = this.props;
    let toggle = "left";
    let isMobile = false;
    if (this.props.windowSize.windowWidth < 600) {
      toggle = "top";
      isMobile = true;
    }

    return (
      <Drawer
        classes={{
          paper: classNames({
            [classes.drawerPaper]: !isMobile,
            [classes.drawerPaperMobile]: isMobile,
        })}}
        classNames={classes.drawer}
        variant="persistent"
        anchor={toggle}
        open={open}
        className={classes.drawer}
      > 
        <div className={classes.toolbar} />
        <div style={{paddingTop: navBarHeight - 51}} />
        <List component="nav">
         <ListItem button component={Link} to="/about" className={classes.button}>
           <ListItemIcon>
             <InfoIcon className={classes.icon}/>
           </ListItemIcon>
           <ListItemText primary="About" classes={{primary: classes.text }} />
         </ListItem>
          <ListItem button component={Link} to="/" onClick={showSearch} className={classes.button}>
            <ListItemIcon>
              <SearchIcon className={classes.icon}/>
            </ListItemIcon>
            <ListItemText primary="Search Results" classes={{primary: classes.text }} />
          </ListItem>
          {loggedIn ?
            <ListItem button component={Link} to="/" onClick={showSelling} className={classes.button}>
              <ListItemIcon>
                <LibraryBooksIcon className={classes.icon}/>
              </ListItemIcon>
              <ListItemText primary="Selling" classes={{primary: classes.text }} />
            </ListItem> : ''
          }
          {loggedIn ?
            <ListItem button component={Link} to="/" onClick={showFavorites} className={classes.button}>
              <ListItemIcon>
                <FavoriteIcon className={classes.icon}/>
              </ListItemIcon>
              <ListItemText primary="Favorites" classes={{primary: classes.text }} />
            </ListItem> : ''
          }
        </List>
      </Drawer>
    );
  }
}

const styles = theme => ({
  button: {
    '&:hover': {
      background: drawerHighlightColor,
    }
  },
  icon: {
    color: drawerLabelColor,
  },
  text: {
    color: drawerLabelColor,
  },

  drawerPaper: {
    position: 'fixed',
    width: drawerWidth,
    background: drawerColor,
  },
  drawerPaperMobile: {
    position: 'fixed',
    width: '100%',
    background: drawerColor,
  },
  toolbar: theme.mixins.toolbar,
});

export default withWindowSizeListener(withStyles(styles)(Sidebar));
