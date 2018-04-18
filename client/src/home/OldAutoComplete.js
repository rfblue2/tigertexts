import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';

class IntegrationDownshift extends Component {

  renderInput(inputProps) {
    const { executeSearch } = this.props;

    const { InputProps, classes, ref, ...other } = inputProps;

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
        onKeyPress={executeSearch}
      />
    );
  }

  renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
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

  getSuggestions(inputValue, classlist) {
    let count = 0;

    return classlist.filter(suggestion => {
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
    const { classes } = this.props;
    const { classlist, executeSearch } = this.props;

    return (
      <div className={classes.root}>
        <Downshift>
          {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
            <div className={classes.container}>
              {/* Renders Field Tab */}
              {this.renderInput({
                fullWidth: true,
                classes,
                InputProps: getInputProps({
                  placeholder: 'Enter Course Number',
                  id: 'integration-downshift-simple',
                }),
              })}
              {/* Renders Suggestions Box When Applicable */}
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {this.getSuggestions(inputValue, classlist).map((suggestion, index) =>
                    this.renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion }),
                      highlightedIndex,
                      selectedItem,
                    }),
                  )}
                </Paper>
              ) : null}
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
  executeSearch: PropTypes.func.isRequired,
};


const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
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

export default withStyles(styles)(IntegrationDownshift);
