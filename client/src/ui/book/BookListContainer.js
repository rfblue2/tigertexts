import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import BookList from './BookList';
import { userDeleteSellBook } from '../../actions/users.actions';

class BookListContainer extends Component {
  state = { books: [] }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    books: PropTypes.array,
    selling: PropTypes.array,
    favorites: PropTypes.array,
    token: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object,
  }

  static defaultProps = {
    books: [],
    selling: [],
    favorites: [],
  }

  async _markSold(id) {
    this.props.dispatch(userDeleteSellBook(this.props.token, id));
  }

  render() {
    // console.log('About to repopulate books: ' + JSON.stringify(this.props.books, null, 2));
    const {
      books,
      selling,
      favorites,
    } = this.props;
    console.log("NEw Book: " + books.length)

    return (
      <BookList
        books={books}
        selling={selling.map(b => b.id)}
        favorites={favorites.map(b => b.id)}
        markSold={this._markSold.bind(this)}
      />
    );
  }
}

const styles = {
};

const mapStateToProps = state => ({
  books: state.book.books,
  token: state.user.token,
  selling: state.user.user.selling,
  favorites: state.user.user.favorites,
});


const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(BookListContainer));
