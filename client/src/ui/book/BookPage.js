import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import Subheader from 'material-ui/List/ListSubheader';
import Divider from 'material-ui/Divider';
import { deserializeBook } from '../../serializers/bookSerializer';
import { deserializeListing } from '../../serializers/listingSerializer';
import Listing from './Listing';

class BookPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        bookId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    book: {},
    listings: [],
  }

  async componentWillMount() {
    try {
      const { bookId } = this.props.match.params;
      const res = await fetch(`/api/books/${bookId}`);
      const resjson = await res.json();
      const book = await deserializeBook(resjson);

      const res1 = await fetch(`/api/books/${bookId}/listings`);
      const res1json = await res1.json();
      const listings = await deserializeListing(res1json);

      this.setState({ book, listings });
    } catch (e) {
      console.error(`error: ${e}`);
    }
  }

  render() {
    const { book, listings } = this.state;
    const { classes } = this.props;

    /* TODO: Add pictures */
    /* TODO: Add link to each Amazon and Labyrinth Page */

    return (
      <div className={classes.book}>
        <h1 className={classes.bookTitle} >{book.title}</h1>
        <div className={classes.bookDesc} > {book.description} </div>
        <div className={classes.bookAuthors} > {book.authors ? book.authors.map(a => <p key={a}>{a}</p>) : ''} </div>
        <div className={classes.bookPic} > <img src={book.image} alt="book" /> </div>
        <Divider />
        <List>
          <Subheader className={classes.subheader} >Book Prices</Subheader>
          { listings.map(l => <Listing key={l.id} listing={l} />)}
        </List>
      </div>
    );
  }
}

const styles = {
  book: {
    margin: '30px',
  },
  bookTitle: {
    margin: '10px',
  },
  bookDesc: {
    margin: '20px',
  },
  bookAuthors: {
    margin: '20px',
  },
  bookPic: {
    margin: '20px',
  },
  subheader: {
    margin: '0px',
    fontSize: 18,
  },
};

export default withStyles(styles)(BookPage);

