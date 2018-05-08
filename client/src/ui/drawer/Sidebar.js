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

const drawerWidth = 240;

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
        variant="persistent"
        anchor={toggle}
        open={open}
      > 
        <div className={classes.toolbar} />
        <div style={{paddingTop: navBarHeight - 51}} />
        <List component="nav">
         <ListItem button component={Link} to="/about">
           <ListItemIcon>
             <InfoIcon />
           </ListItemIcon>
           <ListItemText primary="About" />
         </ListItem>
          <ListItem button component={Link} to="/" onClick={showSearch}>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search Results" />
          </ListItem>
          {loggedIn ?
            <ListItem button component={Link} to="/" onClick={showSelling}>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary="Selling" />
            </ListItem> : ''
          }
          {loggedIn ?
            <ListItem button component={Link} to="/" onClick={showFavorites}>
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem> : ''
          }
        </List>
      </Drawer>
    );
  }
}

const styles = theme => ({
  drawerPaper: {
    position: 'fixed',
    width: drawerWidth,
  },
  drawerPaperMobile: {
    position: 'fixed',
    width: '100%',
  },
  toolbar: theme.mixins.toolbar,
});

export default withWindowSizeListener(withStyles(styles)(Sidebar));
