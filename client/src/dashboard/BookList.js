import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';

class BookList extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    books: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onClick: PropTypes.func.isRequired,
  }

  render() {
    const { books, onClick } = this.props;

    return (
      <div>
        <List>
          { books.map(b => (
            <ListItem button key={b.id} onClick={() => onClick(b.id)}>
              <ListItemText primary={b.title} />
            </ListItem>))
          }
        </List>
      </div>
    );
  }
}

const styles = {

};

export default withStyles(styles)(BookList);
