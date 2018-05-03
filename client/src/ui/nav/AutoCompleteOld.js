import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';

class AutoComplete extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    executeSearch: PropTypes.func.isRequired,
    courseList: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    courseList: [],
  }

  state = {
    inputValue: '',
    selectedItems: [],
  };

  handleKeyDown = (event) => {
    let { selectedItems } = this.state;
    const { inputValue } = this.state;
    const { executeSearch } = this.props;

    if (!inputValue.length && keycode(event) === 'backspace') {
      selectedItems = selectedItems.slice(0, selectedItems.length - 1)
      this.setState({
        selectedItems,
      });
      executeSearch(selectedItems);
    } 
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  handleChange = (item) => {
    let { selectedItems } = this.state;
    const { executeSearch } = this.props;

    if (selectedItems.indexOf(item) === -1) {
      selectedItems = [...selectedItems, item];
    }

    console.log(selectedItems)
    this.setState({
      inputValue: '',
      selectedItems,
    });

    executeSearch(selectedItems);
  };

  handleDelete = item => () => {
    const { executeSearch } = this.props;
    const selectedItems = [...this.state.selectedItems];
    selectedItems.splice(selectedItems.indexOf(item), 1);

    this.setState({ selectedItems });
    executeSearch(selectedItems);
  };

  renderInput(inputProps) {
    const {
      InputProps, classes, ref, ...other
    } = inputProps;

    return (
      <TextField className={classes.textfield} InputProps={{
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
    suggestion, index, itemProps, highlightedIndex, selectedItems,
  }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItems || '').indexOf(suggestion) > -1;

    return (
      <MenuItem
        {...itemProps}
        key={suggestion.id}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {suggestion.numbers.join('/')}
      </MenuItem>
    );
  }

  getSuggestions(inputValue, courseList) {
    let count = 0;

    return courseList.filter((suggestion) => {
      const nums = suggestion.numbers;
      let keep = nums.reduce((p, n) =>
        p || n.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1, false);

      keep = keep && count < 5;

      if (keep) {
        count += 1;
      }

      return keep;
    });
  }

  render() {
    const { classes, courseList } = this.props;
    const { inputValue, selectedItems } = this.state;

    return (
      <div className={classes.root}>
        <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItems={selectedItems}>
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue: inputValue2,
            selectedItems: selectedItems2,
            highlightedIndex,
          }) => (
            <div className={classes.container}>
              {selectedItems2}
              {this.renderInput({
                fullWidth: true,
                classes,
                InputProps: getInputProps({
                  startAdornment: selectedItems.map(item => (
                    <Chip
                      key={item.id}
                      tabIndex={-1}
                      label={item.numbers.join('/')}
                      className={classes.chip}
                      onDelete={this.handleDelete(item)}
                    />
                  )),
                  onChange: this.handleInputChange,
                  onKeyDown: this.handleKeyDown,
                  placeholder: 'Enter course numbers',
                  id: 'integration-downshift-multiple',
                }),
              })}
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {this.getSuggestions(inputValue2, courseList).map((suggestion, index) =>
                    this.renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion }),
                      highlightedIndex,
                      selectedItems: selectedItems2,
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
  textfield: {
    marginTop: '8px',
    backgroundColor: '#FFFFFF',
    paddingLeft: '10px',
    width: 'calc(100% - 15px)',
    marginLeft: '5px',
    marginRight: '5px',
    boxShadow: '0px 0px 5px'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

export default withStyles(styles)(AutoComplete);
