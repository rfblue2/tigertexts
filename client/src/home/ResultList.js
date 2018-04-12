import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List from 'material-ui/List';
import Result from './Result';


class ResultList extends Component {
  state = {
  }

  render() {
    const { books, onResultClick } = this.props;

    return (
      <div>
        <List>
          { books.map(b =>
          (<Result
            key={b.id}
            onClick={onResultClick}
            book={b}
          />))
        }
        </List>
      </div>
    );
  }
}

ResultList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onResultClick: PropTypes.func.isRequired,
};

const styles = {
  home: {
    margin: '20px',
  },
};

export default withStyles(styles)(ResultList);
