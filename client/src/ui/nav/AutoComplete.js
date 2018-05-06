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
    (t, a) => t && (a.labelnum !== o.labelnum), true));
  let numRes = [];
  // search by course number
  if (q.length < 4 &&
      q.slice(0, 3).match(/^[a-z]+$/i) !== null 
      ||
      q.length < 7 && 
      q.slice(0, 3).match(/^[a-z]+$/i) !== null &&
      q.slice(3, 6).match(/^[0-9]+$/i) !== null 
      ||
      q.length < 8 && 
      q.slice(0, 3).match(/^[a-z]+$/i) !== null &&
      q.slice(3, 6).match(/^[0-9]+$/i) !== null &&
      q.slice(6, 7).match(/^[a-z]+$/i) !== null

      ||
      q.length < 8 && 
      q.slice(0, 3).match(/^[a-z]+$/i) !== null &&
      q.slice(3, 4).match(/\s/) &&
      q.slice(4, 7).match(/^[0-9]+$/i) !== null
      ||
      q.length < 9 && 
      q.slice(0, 3).match(/^[a-z]+$/i) !== null &&
      q.slice(3, 4).match(/\s/) &&
      q.slice(4, 7).match(/^[0-9]+$/i) !== null &&
      q.slice(7, 8).match(/^[a-z]+$/i) !== null
      ) {
    numRes = deduped.filter(o =>
      o.labelnum.split('/').reduce((t, a) =>
        t || a.replace(/\s+/g, '').toLowerCase().startsWith(q.replace(/\s+/g, '').toLowerCase()), false));
    // if course numbers match, return those
    if (numRes.length > 0) return numRes;
  }
  // search by course number (numerical component)
  else if ( q.length < 4 && q.slice(0, 3).match(/^[0-9]+$/i) !== null ||
            q.length < 5 && q.slice(0, 3).match(/^[0-9]+$/i) !== null && q.slice(3, 4).match(/^[a-z]+$/i) !== null
          ) {
    numRes = deduped.filter(o =>
      o.labelnum.split('/').reduce((t, a) =>
        t || a.slice(3,7).toLowerCase().startsWith(q.slice(0,4).toLowerCase()), false));
    if (numRes.length > 0) return numRes;
  }

  // match by course title
  return deduped.filter(d =>
    d.value.title.toLowerCase().includes(filter.toLowerCase()));


};

const SelectWrapped = (props) => {
  const { classes, ...other } = props;

  console.log(classes);
  return (
    <VirtualizedSelect
      optionComponent={Option}
      optionHeight={40}
      noResultsText={<Typography>{'No results found'}</Typography>}
      arrowRenderer={arrowProps => {
        return arrowProps.isOpen ? <ArrowDropUpIcon className={classes.arrowIcon}/> : <ArrowDropDownIcon className={classes.arrowIcon} />;
      }}
      filterOptions={filterOptions}
      clearRenderer={() => <ClearIcon className={classes.clearIcon} />}
      valueComponent={valueProps => {
        const { value, children, onRemove } = valueProps;

        const onDelete = event => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        };

        console.log(value.labelnum);
        console.log(children);
        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={value.labelnum}
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
  arrowIcon: {
    marginTop: '4px'
  },
  clearIcon: {
    marginTop: '4px'
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
