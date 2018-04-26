import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import BookList from './BookList';

class BookListContainer extends Component {
  state = { books: [] }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    books: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    books: [],
  }

  componentWillMount() {

  }

  render() {
    // console.log('About to repopulate books: ' + JSON.stringify(this.props.books, null, 2));
    return (
      <BookList
        books={this.props.books}
      />
    );
  }
}

const styles = {
};

const mapStateToProps = state => ({
  books: state.book.books,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(BookListContainer));
