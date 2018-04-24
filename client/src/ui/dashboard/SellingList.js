import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';

class SellingList extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    books: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onClick: PropTypes.func.isRequired,
    onMarkSoldClick: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.renderListItem = this._renderListItem.bind(this);
  }

  _renderListItem(b) {
    const { onClick, onMarkSoldClick } = this.props;
    return (
      <ListItem button key={b.id} onClick={() => onClick(b.id)}>
        <ListItemText primary={b.title} />
        <ListItemSecondaryAction>
          <Button variant="raised" onClick={() => onMarkSoldClick(b.id)}>
            Mark Sold
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  renderListWithDividers(items) {
    const listItemsWithDividers = [];
    items.forEach((item, index) => {
      listItemsWithDividers.push(item);
      if (items[index + 1] !== undefined) {
        listItemsWithDividers.push(<Divider key={index} />);
      }
    });
    return listItemsWithDividers;
  }

  render() {
    const { books } = this.props;

    return (
      <div>
        <List>
          { this.renderListWithDividers(books.map(this.renderListItem)) }
        </List>
      </div>
    );
  }
}

const styles = {

};

export default withStyles(styles)(SellingList);
