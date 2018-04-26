import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile } from 'material-ui/GridList';
import Book from './Book';

class BookList extends Component {
  static propTypes = {
    books: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  };

  state = {
  }

  render() {
    const { classes, books } = this.props;

    return (
      <div>
        <GridList className = {classes.list} cellHeight={'100%'} cols={1} >
          { books.map(b =>
          (
            <GridListTile>
              <Book
                key={b.id}
                book={b}
              />
            </GridListTile>
          ))
        }
        </GridList>
      </div>
    );
  }
}

const styles = {
  list: {
    marginLeft: '23vh',
    marginRight: '23vh',
  },
  home: {
    margin: '20px',
  },
};

export default withStyles(styles)(BookList);
