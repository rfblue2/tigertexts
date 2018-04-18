import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import SearchBar from './SearchBar';
import ResultList from './ResultList';
import { BookDeserializer } from '../serializers/bookSerializer';
import { ClassDeserializer } from '../serializers/classSerializer';
import IntegrationDownshift from './AutoComplete';

class Home extends Component {
  state = {
    courses: [],
    queryResults: [], // query results
    redirect: false,
    redirectBookId: null,
  }

  // runs before component is mounted
  async componentWillMount() {
    this.goToBook = this._goToBook.bind(this);
    this.executeSearch = this._executeSearch.bind(this);

    try {
      // TODO replace this with an actual query that returns only the query
      // results and not the entire book list!
      const res = await fetch('/api/classes');
      const resjson = await res.json();
      const courses = await ClassDeserializer.deserialize(resjson);
      this.setState({ courses });
    } catch (e) {
      console.error(`error: ${e}`);
    }
  }

  // sends you to book page
  _goToBook(id) {
    this.setState({ redirect: true, redirectBookId: id });
  }

  // execute search, selectedItem is a list of course numbers
  async _executeSearch(selectedItem) {
    const fmtCourse = c => c.replace(/\s+/g, '').toLowerCase();
    try {
      // TODO replace this with an actual query that returns only the query
      // results and not the entire book list!
      const res = await fetch('/api/books');
      const resjson = await res.json();
      const books = await BookDeserializer.deserialize(resjson);
      // gets the unique course ids for all classes specified in the inpput
      const courses = this.state.courses
          .filter(c => c.numbers.map(fmtCourse).some(v => selectedItem.map(fmtCourse).includes(v)));
      var course_ids = courses.map(c => c.id)


      if (!courses) return;
      const results = books.filter(b => b.classes.some(v => course_ids.includes(v)));

      this.setState({
        queryResults: results,
      });
    } catch (err) {
      console.error(`error: ${err}`);
    }
  }

  render() {
    const {
      queryResults,
      redirectBookId,
      courses,
    } = this.state;
    const { classes } = this.props;

    if (this.state.redirect) return <Redirect push to={`/book/${redirectBookId}`} />;

    return (
      <div className={classes.home}>
        <h1>Textbooks</h1>
        <div>Enter Course Number:</div>
        <div>
          <IntegrationDownshift 
            executeSearch={this.executeSearch}
            classlist={[].concat.apply([], courses.map(c => c.numbers))}
          />
        </div>

        <ResultList
          books={queryResults}
          onResultClick={this.goToBook}
        />
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = {
  home: {
    margin: '20px',
  },
  searchBar: {
    width: '100%',
  },
};

export default withStyles(styles)(Home);