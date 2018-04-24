import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import GridList from 'material-ui/GridList';
import Result from './Result';

class ResultList extends Component {
  static propTypes = {
    books: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onResultClick: PropTypes.func.isRequired,
  };

  state = {
  }

  render() {
    const { books, onResultClick } = this.props;

    return (
      <div>
        <GridList cols={2.5}>
          { books.map(b =>
          (<Result
            key={b.id}
            onClick={onResultClick}
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

export default withStyles(styles)(ResultList);
