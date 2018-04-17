import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';

class TransactionList extends Component {
  state = {
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onClick: PropTypes.func.isRequired,
  }

  render() {
    const { transactions, onClick } = this.props;

    return (
      <div>
        <List>
          { transactions.map(t =>
            (<ListItem button key={t.id} onClick={() => onClick(t.id)}>
              <ListItemText primary={`${t.seller} sold ${t.book} to ${t.buyer} for $${t.price}`} />
            </ListItem>))
          }
        </List>
      </div>
    );
  }
}

const styles = {

};

export default withStyles(styles)(TransactionList);
