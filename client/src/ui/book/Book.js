import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Subheader from 'material-ui/List/ListSubheader';
import List from 'material-ui/List';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Typography from 'material-ui/Typography';
import Listing from '../home/Listing';

class Book extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    book: PropTypes.object.isRequired,
  }

  state = {
    expanded: false,
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { classes, book } = this.props;
    return (
      <Card onClick={this.handleExpandClick.bind(this)}>
        <CardContent>
          <Typography variant="headline"> {book.title} </Typography>
          <img src={book.image} alt={"book"} />
          <div className={classes.bookAuthors} > {book.authors ? book.authors.map(a => <p key={a}>{a}</p>) : ''} </div>
        </CardContent>
        <CardActions>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <List>
              <Subheader className={classes.subheader} >Book Prices</Subheader>
              { book.listings.map(l => <Listing key={l.id} listing={l} />)}
            </List>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

const styles = {
  card: {
    margin: '5px',
    transition: 'all 0.5s ease',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  result: {
    padding: '10px',
    width: '50%',
  },
};


export default withStyles(styles)(Book);
