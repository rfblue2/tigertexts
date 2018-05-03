/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Input from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from 'material-ui/Chip';
import Select from 'react-select';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';


class Option extends React.Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props;
    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {children}
      </MenuItem>
    );
  }
}

const filterOptions = (options, filter, currentVals) => {
  const q = filter.trim();
  const deduped = options.filter(o => currentVals.reduce(
    (t, a) => t && (a.label !== o.label), true));
  let numRes = [];
  if (q.length < 4 &&
      q.slice(0, 3).match(/^[a-z]+$/i) !== null ||
      q.length < 7 &&
      q.slice(3, 6).match(/^[0-9]+$/i) !== null) {
    numRes = deduped.filter(o =>
      o.label.split('/').reduce((t, a) =>
        t || a.toLowerCase().startsWith(q.toLowerCase()), false));
    // if course numbers match, return those
    if (numRes.length > 0) return numRes;
  }

  // match by course title
  return deduped.filter(d =>
    d.value.title.toLowerCase().includes(filter.toLowerCase()));
};

const SelectWrapped = (props) => {
  const { classes, ...other } = props;

  return (
    <VirtualizedSelect
      optionComponent={Option}
      optionHeight={40}
      noResultsText={<Typography>{'No results found'}</Typography>}
      arrowRenderer={arrowProps => {
        return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
      }}
      filterOptions={filterOptions}
      clearRenderer={() => <ClearIcon />}
      valueComponent={valueProps => {
        const { value, children, onRemove } = valueProps;

        const onDelete = event => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        };

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          );
        }

        return <div className="Select-value">{children}</div>;
      }}
      {...other}
    />
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.VirtualizedSelectFocusedOption': {
      backgroundColor: 'rgba(200, 200, 200)',
    },
    '.VirtualizedSelectOption': {
      padding: '0 .7rem',
      fontSize: '10pt',
    },
    '.Select-control': {
      borderRadius: '3px',
      border: '1px solid #ccc',
      borderSpacing: '0',
    }
  },
});

class IntegrationReactSelect extends React.Component {
  state = {
    selectedItems: null,
  };

  handleChange = (value) => {

    this.setState({
      selectedItems: value,
    });
    this.props.executeSearch(value.map(course => (course.value)));
  };

  render() {
    const { classes, courseList } = this.props;

    return (
      <div className={classes.root}>
        <TextField
          fullWidth
          value={this.state.selectedItems}
          onChange={this.handleChange}
          placeholder="Enter Course Numbers"
          name="react-select-chip-label"
          InputProps={{
            disableUnderline: true,
            inputComponent: SelectWrapped,
            inputProps: {
              classes,
              multi: true,
              instanceId: 'react-select-chip-label',
              id: 'react-select-chip-label',
              simpleValue: false,
              options: courseList,
            },
          }}
        />
      </div>
    );
  }
}

IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  executeSearch: PropTypes.func.isRequired,
  courseList: PropTypes.arrayOf(PropTypes.object),
};

export default withStyles(styles)(IntegrationReactSelect);
