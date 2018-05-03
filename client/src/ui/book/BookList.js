import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile } from 'material-ui/GridList';
import Typography from 'material-ui/Typography';
import Grow from 'material-ui/transitions/Grow';
import Book from './Book';

class BookList extends Component {
  static propTypes = {
    books: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    loggedIn: PropTypes.bool.isRequired,
    markSold: PropTypes.func.isRequired,
    sellBook: PropTypes.func.isRequired,
    onFavorite: PropTypes.func.isRequired,
    selling: PropTypes.arrayOf(PropTypes.object),
    favorites: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    selling: [],
    favorites: [],
  }

  state = {
  }

  render() {
    const {
      classes, books, selling, favorites, markSold, sellBook, loggedIn, onFavorite,
    } = this.props;

    if (!books || books.length === 0) {
      return <Typography className={classes.empty}>No results to show</Typography>;
    }

    return (
      <div>
        <GridList className={classes.list} cellHeight="100%" cols={1} >
          {
            books.map((b, i) => (
              <Grow in style={{ transitionDelay: i * 75 }}>
                <GridListTile key={b.id}>
                  <Book
                    book={b}
                    loggedIn={loggedIn}
                    selling={selling.map(s => s.id).includes(b.id)}
                    favorite={favorites.map(f => f.id).includes(b.id)}
                    onMarkSoldClick={markSold}
                    onSellClick={sellBook}
                    onFavoriteClick={onFavorite}
                  />
                </GridListTile>
              </Grow>
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
