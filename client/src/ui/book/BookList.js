import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import GridList from 'material-ui/GridList';
import Book from './Book';

class BookList extends Component {
  static propTypes = {
    books: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  };

  state = {
  }

  render() {
    const { books } = this.props;

    return (
      <div>
        <GridList cols={2.5}>
          { books.map(b =>
          (<Book
            key={b.id}
            book={b}
          />))
        }
        </GridList>
      </div>
    );
  }
}

const styles = {
  home: {
    margin: '20px',
  },
};

export default withStyles(styles)(BookList);
