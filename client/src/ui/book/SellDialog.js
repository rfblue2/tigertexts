import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Input, { InputAdornment, InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';

class SellDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    book: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    showForm: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    book: {},
  }

  state = {
    comment: '',
    price: '',
    type: 'good',
  }

  onPriceChange = (e) => {
    if (e.target.value === '') this.setState({ price: '' });
    else this.setState({ price: Math.min(999, Math.max(0, e.target.value)) });
  }

  onCommentChange = (e) => {
    this.setState({ comment: e.target.value });
  }

  onTypeChange = (e) => {
    this.setState({ type: e.target.value });
  }

  handleSubmit = () => {
    const newBook = this.props.book;
    newBook.price = this.state.price;
    newBook.comment = this.state.comment;
    newBook.type = this.state.type;
    this.props.onSubmit(newBook);
  }

  // consider full screen dialog (might look nicer)
  render() {
    const {
      classes, book, showForm, onClose,
    } = this.props;
    const { price } = this.state;

    return (
      <Dialog
        aria-labelledby="sell-a-book"
        open={showForm}
        onClose={onClose}
        className={classes.dialog}
      >
        <DialogTitle id="sell-a-book">
          Sell {book.title}
        </DialogTitle>
        <DialogContent className={classes.content}>
          <FormControl className={classes.priceText} >
            <InputLabel htmlFor={`price-${book.id}`}>Price (optional)</InputLabel>
            <Input
              id={`price-${book.id}`}
              value={price}
              type="number"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              onChange={this.onPriceChange.bind(this)}
            />
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="type-select">Condition</InputLabel>
            <Select
              value={this.state.type}
              onChange={this.onTypeChange.bind(this)}
              inputProps={{
                name: 'type',
                id: 'type-select',
              }}
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="good">Good</MenuItem>
              <MenuItem value="fair">Fair</MenuItem>
              <MenuItem value="poor">Poor</MenuItem>
            </Select>
          </FormControl>
          <br />
          <TextField
            id={`comment-${book.id}`}
            label="Comment"
            multiline
            fullWidth
            rows="5"
            className={classes.comment}
            onChange={this.onCommentChange.bind(this)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={this.handleSubmit.bind(this)}>Submit</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = {
  dialog: {
  },
  formControl: {
    marginTop: '5px',
    marginBottom: '5px',
  },
  content: {
    height: '200px',
  },
};

export default withStyles(styles)(SellDialog);
