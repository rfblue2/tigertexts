import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import BookList from './BookList';
import {
  userDeleteFavorite,
  userDeleteSellBook,
  userOpenSellDialog,
  userPostFavorite,
} from '../../actions/users.actions';
import { getListing, openListingDialog } from '../../actions/listings.actions';

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

  _markSold(id) {
    this.props.dispatch(userDeleteSellBook(this.props.token, id));
  }

  _sellBook(id) {
    this.props.dispatch(userOpenSellDialog(id));
  }

  _onFavorite(id, isFavoriting) {
    if (isFavoriting) {
      this.props.dispatch(userPostFavorite(this.props.token, this.props.user, id));
    } else {
      this.props.dispatch(userDeleteFavorite(this.props.token, id));
    }
  }

  _onListingClick(id) {
    this.props.dispatch(getListing(id));
    this.props.dispatch(openListingDialog());
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
        onFavorite={this._onFavorite.bind(this)}
        onListingClick={this._onListingClick.bind(this)}
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
  favorites: state.user.user ? state.user.user.favorite : [],
  loggedIn: state.user.loggedIn,
  user: state.user.user,
});


const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(BookListContainer));
