import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';

class TransactionList extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onClick: PropTypes.func.isRequired,
  }

  state = {
  }

  static buildItemText(t) {
    let text = '';
    if (t.seller) {
      text += `${t.seller} sold ${t.book.title}`;
      if (t.buyer) {
        text += ` to ${t.buyer}`;
      }
    } else {
      text += `${t.buyer} bought ${t.book.title}`;
    }
    if (t.price) {
      text += ` for $${t.price}`;
    }
    return text;
  }

  render() {
    const { transactions, onClick } = this.props;

    return (
      <div>
        <List>
          { transactions.map(t => (
            <ListItem button key={t.id} onClick={() => onClick(t.id)}>
              <ListItemText primary={TransactionList.buildItemText(t)} />
            </ListItem>
            ))
          }
        </List>
      </div>
    );
  }
}

const styles = {

};

export default withStyles(styles)(TransactionList);
