import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import {
  getJwt,
  removeJwt,
  facebookResponse, getUserInfo, userPostSellBooks, userDeleteSellBook,
} from '../actions/users.actions';
import { getBooksForClasses, getUserFavoriteBooks, getUserSellingBooks } from '../actions/books.actions';
import AutoComplete from './nav/AutoComplete';
import BookListContainer from './book/BookListContainer';
import Sidebar from './drawer/Sidebar';
import Navbar from './nav/Navbar';
import { deserializeClass } from '../serializers/classSerializer';
import SellBooksDialog from './dashboard/SellBooksDialog';
import About from './About';

const drawerWidth = 240;

class App extends Component {
  state = {
    courses: [],
    sidebarOpen: true,
    showSellForm: false,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
    user: PropTypes.object,
    token: PropTypes.string,
  }

  static defaultProps = {
    isLoggedIn: false,
  }

  async componentWillMount() {
    this.handleLogout = this._handleLogout.bind(this);
    this.responseFacebook = this._responseFacebook.bind(this);
    this.handleSearch = this._handleSearch.bind(this);
    this.handleMenu = this._handleMenu.bind(this);
    this.handleOpenForm = this._handleOpenForm.bind(this);
    this.handleCloseForm = this._handleCloseForm.bind(this);
    this.showSelling = this._showSelling.bind(this);
    this.showFavorites = this._showFavorites.bind(this);
    this.sellBooks = this._sellBooks.bind(this);

    // TODO move this into redux (maybe)
    const cres = await fetch('/api/classes');
    const cresjson = await cres.json();
    const courses = await deserializeClass(cresjson);
    this.setState({ courses });

    // Check if already logged in
    this.props.dispatch(getJwt());
  }

  _handleLogout() {
    this.props.dispatch(removeJwt());
  }

  _responseFacebook(res) {
    // Get token from facebook info
    this.props.dispatch(facebookResponse(res));
  }

  _handleSearch(items) {
    this.props.dispatch(getBooksForClasses(items.map(i => i.id)));
  }

  _handleMenu() {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  }

  _sellBooks(selectedBooks) {
    const { token, user } = this.props;
    this.setState({
      showSellForm: false,
    });
    this.props.dispatch(userPostSellBooks(token, user, selectedBooks.map(b => b.id)));
  }

  _handleOpenForm = () => {
    this.setState({ showSellForm: true });
  };

  _handleCloseForm = () => {
    this.setState({ showSellForm: false });
  };

  _showSelling() {
    this.props.dispatch(getUserSellingBooks(this.props.token));
  }

  _showFavorites() {
    this.props.dispatch(getUserFavoriteBooks(this.props.token));
  }

  render() {
    const { classes, isLoggedIn } = this.props;
    const { courses, sidebarOpen, showSellForm } = this.state;

    return (
      <Router>
        <div className={classes.appFrame}>
          <Navbar
            isLoggedIn={isLoggedIn}
            responseFacebook={this.responseFacebook}
            handleLogout={this.handleLogout}
            handleMenu={this.handleMenu}
          >
            <AutoComplete
              executeSearch={this.handleSearch}
              courseList={courses}
            />
          </Navbar>
          <Sidebar
            open={sidebarOpen}
            loggedIn={isLoggedIn}
            sellBook={this.sellBook}
            showSelling={this.showSelling}
            showFavorites={this.showFavorites}
            openSellForm={this.handleOpenForm}
          />
          <main
            className={classNames(classes.content, classes['content-left'], {
              [classes.contentShift]: sidebarOpen,
              [classes['contentShift-left']]: sidebarOpen,
            })}
          >
            <SellBooksDialog
              className={classes.dialog}
              onSell={this.sellBooks}
              handleClose={this.handleCloseForm}
              showForm={showSellForm}
            />
            <div className={classes.toolbar} />
            <Route exact path="/" component={BookListContainer} />
            <Route exact path="/about" component={About} />
          </main>
        </div>
      </Router>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  dialog: {
    width: '100%',
    height: '100%',
  },
  appFrame: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
});

const mapStateToProps = state => ({
  isLoggedIn: state.user.loggedIn,
  token: state.user.token,
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(App));
