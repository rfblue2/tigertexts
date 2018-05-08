import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Subheader from 'material-ui/List/ListSubheader';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import red from 'material-ui/colors/red';
import Listing from './Listing';

class Book extends Component {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    book: PropTypes.object.isRequired,
    selling: PropTypes.bool.isRequired,
    favorite: PropTypes.bool.isRequired,
    onMarkSoldClick: PropTypes.func.isRequired,
    onSellClick: PropTypes.func.isRequired,
    onFavoriteClick: PropTypes.func.isRequired,
    onListingClick: PropTypes.func.isRequired,
  }

  state = {
    expanded: false,
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  generateAuthorString = (authors) => {
    const numAuthors = authors ? authors.length : 0;
    if (numAuthors === 0) {
      return ('');
    } else if (numAuthors === 1) {
      return (authors[0]);
    } else if (numAuthors === 2) {
      return (`${authors[0]}; ${authors[1]}`);
    }

    return (`${authors[0]}; ${authors[1]}; ...`);
  }

  // if user is logged in, either mark sold or sell
  renderSellButton = (book) => {
    const {
      loggedIn, selling, onMarkSoldClick, onSellClick,
    } = this.props;
    if (!loggedIn) return '';
    if (selling) {
      return (
        <Button variant="raised" onClick={() => onMarkSoldClick(book.id)} style={{boxShadow: "none"}}>
          Mark Sold
        </Button>
      );
    }
    return (
      <Button variant="raised" onClick={() => onSellClick(book)} style={{boxShadow: "none"}}>
        Sell this book
      </Button>
    );
  }

  render() {
    const {
      classes, book, onFavoriteClick, onListingClick, favorite, loggedIn,
    } = this.props;
    return (
      <Card className={classes.card} style={{boxShadow: "none"}}>
        <CardHeader
          className={classes.header}
          title={book.title}
          subheader={this.generateAuthorString(book.authors)}
        />
        <CardActions>
          {
            loggedIn ?
              <IconButton
                onClick={() => onFavoriteClick(book.id, !favorite)}
                aria-label="Add to favorites"
                className={classNames(classes['favorite-icon'], {
                  [classes.favorite]: this.props.favorite,
                })}
              >
                <FavoriteIcon />
              </IconButton> : ''
          }
          <IconButton
            className={classNames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick.bind(this)}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          {this.renderSellButton(book)}
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent>
            <div className={classes.root}>
              <Grid container spacing={24}>
                <Grid item xs={12} md={3}>
                  <img className={classes.bookpic} src={book.image} alt="book" />
                </Grid>
                <Grid item xs={12} md={9}>
                  <Subheader className={classes.subheader}>Book Description</Subheader>
                  <Typography className={classes.description}> {book.description} </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Subheader className={classes.subheader}>Book Prices</Subheader>
                  {
                    book.listings.map(l => (<Listing
                      key={l.id}
                      listing={l}
                      onClick={onListingClick}
                    />))
                  }
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

const styles = theme => ({
  card: {
    margin: '5px',
    transition: 'all 0.5s ease',
  },
  subheader: {
    fontSize: '18px',
    color: 'black',
    align: 'left',
    textAlign: 'left',
    marginRight: 'auto',
    paddingLeft: '0px',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginRight: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  description: {
  },
  'favorite-icon': {
    transition: 'all .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
      color: red['500'],
    },
  },
  favorite: {
    color: red['500'],
  },
  listings: {
    margin: '0px',
  },
  bookpic: {
    height: '200px',
    width: 'auto',
  },
});


export default withStyles(styles)(Book);
