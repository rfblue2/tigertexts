import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';

class AutoCompleteBook extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    execute: PropTypes.func.isRequired,
    booklist: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    booklist: [],
  }

  state = {
    inputValue: '',
    selectedItem: [],
  };

  handleKeyDown = (event) => {
    const { inputValue, selectedItem } = this.state;
    const { execute } = this.props;

    if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    } else if (selectedItem.length && !inputValue.length && keycode(event) === 'enter') {
      execute(selectedItem);
    }
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  handleChange = (item) => {
    let { selectedItem } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }

    this.setState({
      inputValue: '',
      selectedItem,
    });
  };

  handleDelete = item => () => {
    const selectedItem = [...this.state.selectedItem];
    selectedItem.splice(selectedItem.indexOf(item), 1);

    this.setState({ selectedItem });
  };

  renderInput(inputProps) {
    const {
      InputProps, classes, ref, ...other
    } = inputProps;

    return (
      <TextField
        InputProps={{
          inputRef: ref,
          classes: {
            root: classes.inputRoot,
          },
          ...InputProps,
        }}
        {...other}
      />
    );
  }

  renderSuggestion({
    suggestion, index, itemProps, highlightedIndex, selectedItem,
  }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion) > -1;

    return (
      <MenuItem
        {...itemProps}
        key={suggestion}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {suggestion}
      </MenuItem>
    );
  }

  getSuggestions(inputValue, booklist) {
    let count = 0;

    return booklist.filter((suggestion) => {
      const keep =
        (!inputValue || suggestion.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
        count < 5;

      if (keep) {
        count += 1;
      }

      return keep;
    });
  }

  render() {
    const { classes, booklist } = this.props;
    const { inputValue, selectedItem } = this.state;

    return (
      <div className={classes.root}>
        <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItem={selectedItem}>
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue: inputValue2,
            selectedItem: selectedItem2,
            highlightedIndex,
          }) => (
            <div className={classes.container}>
              {this.renderInput({
                fullWidth: true,
                classes,
                InputProps: getInputProps({
                  startAdornment: selectedItem.map(item => (
                    <Chip
                      key={item}
                      tabIndex={-1}
                      label={item}
                      className={classes.chip}
                      onDelete={this.handleDelete(item)}
                    />
                  )),
                  onChange: this.handleInputChange,
                  onKeyDown: this.handleKeyDown,
                  placeholder: 'Enter Book Title',
                  id: 'integration-downshift-multiple',
                }),
              })}
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {this.getSuggestions(inputValue2, booklist).map((suggestion, index) =>
                    this.renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion }),
                      highlightedIndex,
                      selectedItem: selectedItem2,
                    }))}
                </Paper>
              ) : null}
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 50,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

export default withStyles(styles)(AutoCompleteBook);
