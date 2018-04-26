import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { Redirect } from 'react-router-dom';
import ResultList from '../book/BookList';
import { deserializeBook } from '../../serializers/bookSerializer';
import { deserializeClass } from '../../serializers/classSerializer';
import AutoComplete from '../nav/AutoComplete';

class Home extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    courses: [],
    queryResults: [], // query results
  }

  // runs before component is mounted
  async componentWillMount() {
    // this.goToBook = this._goToBook.bind(this);
    // this.executeSearch = this._executeSearch.bind(this);
    //
    // try {
    //   // TODO replace this with an actual query that returns only the query
    //   // results and not the entire book list!
    //   const cres = await fetch('/api/classes');
    //   const cresjson = await cres.json();
    //   const courses = await deserializeClass(cresjson);
    //   const bres = await fetch('/api/books');
    //   const bresjson = await bres.json();
    //   const books = await deserializeBook(bresjson);
    //   this.setState({ courses, books });
    // } catch (e) {
    //   console.error(`error: ${e}`);
    // }
  }

  // // execute search, selectedItem is a list of course numbers
  // async _executeSearch(selectedItem) {
  //   const fmtCourse = c => c.replace(/\s+/g, '').toLowerCase();
  //   try {
  //     // TODO replace this with an actual query that returns only the query
  //     // results and not the entire book list!
  //     // gets the unique course ids for all classes specified in the inpput
  //     const courses = this.state.courses
  //       .filter(c => c.numbers.map(fmtCourse).some(v => selectedItem.map(fmtCourse).includes(v)));
  //     const courseIds = courses.map(c => c.id);
  //
  //     if (!courses) return;
  //     const results = this.state.books.filter(b => b.classes.some(v => courseIds.includes(v)));
  //
  //     this.setState({
  //       queryResults: results,
  //     });
  //   } catch (err) {
  //     console.error(`error: ${err}`);
  //   }
  // }

  render() {
    const {
      queryResults,
      courses,
    } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.home}>
        <h1>TigerTexts</h1>
        <Typography variant="subheading">A One Stop Shop for Coursebooks</Typography>
        <br />
        <div>
          <AutoComplete
            executeSearch={this.executeSearch}
            classlist={courses.map(c => c.numbers).reduce((a, b) => b.concat(a), [])}
          />
        </div>

        <ResultList
          books={queryResults}
        />
      </div>
    );
  }
}

const styles = {
  home: {
    margin: '30px',
  },
};

export default withStyles(styles)(Home);
