import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { BookDeserializer } from '../serializers/bookSerializer';
import AutoCompleteBook from './AutoCompleteBook';

class SellBooksForm extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSell: PropTypes.func.isRequired,
  }

  state = {
    selling: [],
    books: [],
  }

  async componentWillMount() {
    const res = await fetch('/api/books');
    const resjson = await res.json();
    const books = await BookDeserializer.deserialize(resjson);
    this.setState({ books: books.map(b => b.title) });
  }

  getModalStyle() {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  render() {
    const { classes, onSell } = this.props;
    const { books } = this.state;
    console.log(JSON.stringify(books[0], null, 2));

    return (
      <div style={this.getModalStyle()} className={classes.paper}>
        <Typography variant="title" id="modal-title">
          Sell books
        </Typography>
        <AutoCompleteBook booklist={books} execute={onSell} />
      </div>
    );
  }
}

const styles = {
  paper: {
    position: 'absolute',
    boxShadow: '#333333',
    backgroundColor: '#fff',
    width: '50%',
    padding: 16 * 4,
  },
};

export default withStyles(styles)(SellBooksForm);
