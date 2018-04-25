import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import { GridListTile } from 'material-ui/GridList';
import Typography from 'material-ui/Typography';

const Result = ({ classes, book, onClick }) => (
  // What if we used card instead http://www.material-ui.com/#/components/card
  <GridListTile className={classes.result} onClick={() => onClick(book.id)}>
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="headline"> {book.title} </Typography>
      </CardContent>
    </Card>
  </GridListTile>
);

const styles = {
  card: {
    margin: '5px',
    transition: 'all 0.5s ease',
    '&:hover': {
      backgroundColor: '#dddddd',
      cursor: 'pointer',
    },
    '&:active': {
      backgroundColor: '#aaaaaa',
      transition: 'none',
    },
  },
  result: {
    padding: '10px',
    width: '50%',
  },
};

Result.propTypes = {
  classes: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(Result);
