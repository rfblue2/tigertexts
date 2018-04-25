import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { deserializeBook } from '../../serializers/bookSerializer';
import AutoCompleteBook from './AutoCompleteBook';

class SellBooksDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSell: PropTypes.func.isRequired,
    showForm: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  }

  state = {
    books: [],
    selected: [],
  }

  async componentWillMount() {
    const res = await fetch('/api/books');
    const resjson = await res.json();
    const books = await deserializeBook(resjson);
    this.setState({ books: books.map(b => b.title) });
  }

  selectBooks(titles) {
    this.setState({ selected: [...this.state.selected, ...titles] });
  }

  renderSelectedBook(title) {
    return <div key={title}>{title}</div>;
  }

  // consider full screen dialog (might look nicer)
  render() {
    const {
      classes, onSell, showForm, handleClose,
    } = this.props;
    const { books } = this.state;

    return (
      <Dialog
        aria-labelledby="sell-a-book"
        open={showForm}
        onClose={handleClose}
        className={classes.dialog}
      >
        <DialogTitle id="sell-a-book">
          Sell books
        </DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText>Select books and set their prices here.</DialogContentText>
          <AutoCompleteBook booklist={books} execute={this.selectBooks.bind(this)} />
          { this.state.selected.map(this.renderSelectedBook) }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onSell(this.state.selected)}>Submit</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = {
  dialog: {
  },
  content: {
    height: '300px',
  },
};

export default withStyles(styles)(SellBooksDialog);
