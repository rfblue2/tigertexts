import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile } from 'material-ui/GridList';
import Book from './Book';

class BookList extends Component {
  static propTypes = {
    books: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    markSold: PropTypes.func.isRequired,
    selling: PropTypes.arrayOf(PropTypes.String),
    favorites: PropTypes.arrayOf(PropTypes.String),
  };

  static defaultProps = {
    selling: [],
    favorites: [],
  }

  state = {
  }

  render() {
    const { classes, books, selling, favorites, markSold } = this.props;

    if (!books || books.length === 0) {
      return <div className={classes.empty}>No results to show</div>
    }

    return (
      <div>
        <GridList className = {classes.list} cellHeight={'100%'} cols={1} >
          { books.map(b =>
          (
            <GridListTile>
              <Book
                key={b.id}
                book={b}
                selling={selling.includes(b.id)}
                favorite={favorites.includes(b.id)}
                onMarkSoldClick={markSold}
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
  empty: {
    verticalAlign: 'middle',
  },
};

export default withStyles(styles)(BookList);
