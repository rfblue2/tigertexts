import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import FavoriteIcon from '@material-ui/icons/Favorite';
import InfoIcon from '@material-ui/icons/Info';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import Drawer from 'material-ui/Drawer';

const drawerWidth = 240;

class Sidebar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    openSellForm: PropTypes.func.isRequired,
    showProfile: PropTypes.func.isRequired,
    showSelling: PropTypes.func.isRequired,
    showFavorites: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  }

  static defaultProps = {
  }

  render() {
    const {
      classes,
      open,
      openSellForm,
      showProfile,
      showSelling,
      showFavorites,
      loggedIn,
    } = this.props;
    return (
      <Drawer
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <div className={classes.toolbar} />
        <List component="nav">
          {/*<ListItem button component={Link} to="/about">*/}
            {/*<ListItemIcon>*/}
              {/*<InfoIcon />*/}
            {/*</ListItemIcon>*/}
            {/*<ListItemText primary="About" />*/}
          {/*</ListItem>*/}
          { loggedIn ?
            <ListItem button onClick={showProfile}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem> : ''
          }
          {loggedIn ?
            <ListItem button onClick={showSelling}>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary="Selling" />
            </ListItem> : ''
          }
          {loggedIn ?
            <ListItem button onClick={showFavorites}>
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem> : ''
          }
          {loggedIn ?
            <ListItem button onClick={openSellForm}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Sell a Book" />
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
  toolbar: theme.mixins.toolbar,
});

export default withStyles(styles)(Sidebar);
