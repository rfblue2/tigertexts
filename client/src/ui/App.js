import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import {
  getJwt,
  removeJwt,
  facebookResponse,
} from '../actions/users.actions';
import { getBooksForClasses } from '../actions/books.actions';
import AutoComplete from './nav/AutoComplete';
import Login from '../Login';
import Dashboard from './dashboard/Dashboard';
import BookListContainer from './book/BookListContainer';
import Sidebar from './drawer/Sidebar';
import Book from './book/BookPage';
import Navbar from './nav/Navbar';
import { deserializeClass } from '../serializers/classSerializer';

class App extends Component {
  state = {
    courses: [],
    sidebarOpen: true,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
  }

  static defaultProps = {
    isLoggedIn: false,
  }

  async componentWillMount() {
    this.handleLogout = this._handleLogout.bind(this);
    this.responseFacebook = this._responseFacebook.bind(this);
    this.handleSearch = this._handleSearch.bind(this);
    this.handleMenu = this._handleMenu.bind(this);

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

  render() {
    const { classes, isLoggedIn } = this.props;
    const { courses, sidebarOpen } = this.state;

    return (
      <Router>
        <div className={classes.root}>
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
          />
          <div className={classes.content}>
            <Route exact path="/" component={BookListContainer} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/book/:bookId" component={Book} />
          </div>
        </div>
      </Router>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
});

const mapStateToProps = state => ({
  isLoggedIn: state.user.loggedIn,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(App));
