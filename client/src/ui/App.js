import React, { Component } from 'react';
import { withWindowSizeListener } from 'react-window-size-listener';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import {
  getJwt,
  removeJwt,
  facebookResponse, userPostSellBooks, userCancelSellDialog,
} from '../actions/users.actions';
import {
  getBooksForClasses,
  getSearchResults,
  getUserFavoriteBooks,
  getUserSellingBooks,
} from '../actions/books.actions';
import AutoComplete from './nav/AutoComplete';
import BookListContainer from './book/BookListContainer';
import Sidebar from './drawer/Sidebar';
import Navbar from './nav/Navbar';
import { deserializeClass } from '../serializers/classSerializer';
import About from './About';
import SellDialog from './dashboard/SellDialog';

const drawerWidth = 240;

class App extends Component {
  state = {
    courses: [],
    sidebarOpen: true,
    showResults: false,
    navBarHeight: 51,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    sellingBook: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    user: PropTypes.object,
    token: PropTypes.string,
    showSellForm: PropTypes.bool.isRequired,
    windowSize: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isLoggedIn: false,
    sellingBook: null,
    user: {},
    token: '',
  }

  async componentWillMount() {
    this.showSearch = this._showSearch.bind(this);
    this.handleLogout = this._handleLogout.bind(this);
    this.responseFacebook = this._responseFacebook.bind(this);
    this.handleSearch = this._handleSearch.bind(this);
    this.handleMenu = this._handleMenu.bind(this);
    this.handleCloseForm = this._handleCloseForm.bind(this);
    this.showSelling = this._showSelling.bind(this);
    this.showFavorites = this._showFavorites.bind(this);
    this.sellBook = this._sellBook.bind(this);
    this.trimLabel = this._trimLabel.bind(this);
    this.retrieveNavBarHeight = this._retrieveNavBarHeight.bind(this);

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

  _showSearch() {
    this.props.dispatch(getSearchResults());
  }

  _handleSearch(items) {
    this.props.dispatch(getBooksForClasses(items.map(i => i.id)));
    this.setState({ showResults: true });
  }

  _handleMenu() {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  }

  _sellBook({ id, price, comment }) {
    const { token, user } = this.props;
    this.props.dispatch(userPostSellBooks(
      token, user, [id],
      [{ id, price, comment }],
    ));
  }

  _handleCloseForm = () => {
    this.props.dispatch(userCancelSellDialog());
  };

  _showSelling() {
    this.props.dispatch(getUserSellingBooks(this.props.token));
  }

  _showFavorites() {
    this.props.dispatch(getUserFavoriteBooks(this.props.token));
  }

  _trimLabel(label) {
    const { windowSize } = this.props;
    var maxLength = Math.floor(windowSize.windowWidth / 8);
    if (label.length < maxLength) { return(label); }

    return(label.substring(0,maxLength - 3) + "...");
  }

  _retrieveNavBarHeight(height) {
    this.setState({ navBarHeight: height});
  }

  render() {
    const {
      classes, isLoggedIn, showSellForm, sellingBook, windowSize, 
    } = this.props;
    const { courses, sidebarOpen, showResults, navBarHeight } = this.state;
    let isMobile = false;
    if (windowSize.windowWidth < 600) {
      isMobile = true;
    }
    if (showResults) {
      this.setState({showResults: false});
    }

    return (
      <Router>
        <div className={classes.appFrame}>
          { showResults ? <Redirect to='/' /> : '' }
          <Navbar
            isLoggedIn={isLoggedIn}
            responseFacebook={this.responseFacebook}
            handleLogout={this.handleLogout}
            handleMenu={this.handleMenu}
            retrieveNavBarHeight={this.retrieveNavBarHeight}
          >
            <AutoComplete
              executeSearch={this.handleSearch}
              courseList={courses.map(course => ({
                            value: course,
                            label: this.trimLabel(`${course.numbers.join('/')} - ${course.title}`),
                            labelnum: `${course.numbers.join('/')}`,
                          }))}
            />
          </Navbar>
          <Sidebar
            open={sidebarOpen}
            loggedIn={isLoggedIn}
            showSearch={this.showSearch}
            sellBook={this.sellBook}
            showSelling={this.showSelling}
            showFavorites={this.showFavorites}
            navBarHeight={navBarHeight}
          />
          <main
            className={classNames(classes.content, classes['content-left'], {
              [classes.contentShift]: sidebarOpen && !isMobile,
              [classes['contentShift-left']]: sidebarOpen && !isMobile,
              [classes['contentShift-down-loggedin']]: sidebarOpen && isMobile && isLoggedIn,
              [classes['contentShift-down-notloggedin']]: sidebarOpen && isMobile && !isLoggedIn,
            })}
            style={{paddingTop: navBarHeight - 51}}
          >
            <SellDialog
              className={classes.dialog}
              onSubmit={this.sellBook}
              onClose={this.handleCloseForm}
              book={sellingBook}
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
    height: '100%',
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
  'contentShift-down-loggedin': {
    marginTop: 215, // hard coded
  },
  'contentShift-down-notloggedin': {
    marginTop: 110, // hard coded
  },
  toolbar: theme.mixins.toolbar,
});

const mapStateToProps = state => ({
  isLoggedIn: state.user.loggedIn,
  sellingBook: state.user.sellDialog.book,
  token: state.user.token,
  user: state.user.user,
  showSellForm: state.user.sellDialog.isSelling,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withWindowSizeListener(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(App)));
