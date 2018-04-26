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
import AutoComplete from './nav/AutoComplete';
import Login from '../Login';
import Dashboard from './dashboard/Dashboard';
import BookListContainer from './book/BookListContainer';
import Home from './home/Home';
import Book from './book/BookPage';
import Navbar from './nav/Navbar';
import { deserializeClass } from '../serializers/classSerializer';

class App extends Component {
  state = { courses: [] }

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
    console.log("yay search items " + JSON.stringify(items, null, 2));
    // const fmtCourse = c => c.replace(/\s+/g, '').toLowerCase();
    // try {
    //   // TODO replace this with an actual query that returns only the query
    //   // results and not the entire book list!
    //   // gets the unique course ids for all classes specified in the inpput
    //   const courses = this.state.courses
    //     .filter(c => c.numbers.map(fmtCourse).some(v => selectedItem.map(fmtCourse).includes(v)));
    //   const courseIds = courses.map(c => c.id);
    //
    //   if (!courses) return;
    //   const results = this.state.books.filter(b => b.classes.some(v => courseIds.includes(v)));
    //
    //   this.setState({
    //     queryResults: results,
    //   });
    // } catch (err) {
    //   console.error(`error: ${err}`);
    // }

  }

  render() {
    const { classes, isLoggedIn } = this.props;
    const { courses } = this.state;
    console.log(JSON.stringify(courses, null, 2));
    return (
      <Router>
        <div className={classes.root}>
          <Navbar
            isLoggedIn={isLoggedIn}
            responseFacebook={this.responseFacebook}
            handleLogout={this.handleLogout}
          >
            <AutoComplete
              executeSearch={this.handleSearch}
              courseList={courses}
            />
          </Navbar>
          <Route exact path="/" component={BookListContainer} />
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
};

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
