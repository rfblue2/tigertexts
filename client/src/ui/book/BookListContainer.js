import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import BookList from './BookList';
import {userDeleteSellBook, userOpenSellDialog} from '../../actions/users.actions'

class BookListContainer extends Component {
  state = { books: [] }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
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

  _sellBook(id) {
    this.props.dispatch(userOpenSellDialog(id));
  }

  render() {
    // console.log('About to repopulate books: ' + JSON.stringify(this.props.books, null, 2));
    const {
      loggedIn,
      books,
      selling,
      favorites,
      display,
    } = this.props;

    let displayBooks = books;
    if (display === 'favorites') displayBooks = favorites;
    else if (display === 'selling') displayBooks = selling;

    return (
      <BookList
        books={displayBooks}
        selling={selling}
        favorites={favorites}
        markSold={this._markSold.bind(this)}
        sellBook={this._sellBook.bind(this)}
        loggedIn={loggedIn}
      />
    );
  }
}

const styles = {
};

const mapStateToProps = state => ({
  display: state.book.display,
  books: state.book.books,
  token: state.user.token,
  selling: state.user.user ? state.user.user.selling : [],
  favorites: state.user.user ? state.user.user.favorites : [],
  loggedIn: state.user.loggedIn,
});


const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(BookListContainer));
