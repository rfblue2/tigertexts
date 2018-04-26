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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Listing from '../home/Listing';
import classnames from 'classnames';
import Divider from 'material-ui/Divider';

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
  }

  handleFavoriteClick = () => {
  }

  generateAuthorString = (authors) => {
    const numAuthors = authors.length
    if (numAuthors == 1) {
      return(authors[0])
    }
    else if (numAuthors == 2) {
      return(authors[0] + '; ' + authors[1])
    }
    else {
      return(authors[0] + '; ' + authors[1] + '; ...')
    }
  }

  render() {
    const { classes, book } = this.props;
    return (
      <Card className = {classes.card} >
        <CardHeader className = {classes.header} title = {book.title} subheader = {this.generateAuthorString(book.authors)}/>
        <CardActions>
          <IconButton 
              onClick={this.handleFavoriteClick.bind(this)}
              aria-label="Add to favorites"
            >
            <FavoriteIcon />
          </IconButton>
          <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick.bind(this)}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent>
            <div className={classes.root}>
            <Grid container spacing={24}>
              <Grid item xs = {12} md = {3}>
                <img className = {classes.bookpic} src={book.image} alt={"book"} />
              </Grid>
              <Grid item xs = {12} md = {9}>  
                <Subheader className = {classes.subheader}>Book Description</Subheader>
                <Typography className = {classes.description}> {book.detail} </Typography>
              </Grid>
              <Grid item xs = {12}>
                <Subheader className = {classes.subheader}>Book Prices</Subheader>
                { book.listings.map(l => <Listing key={l.id} listing={l} />)}
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
    color: 'grey',
  },
  listings: {
    margin: '0px'
  },
  bookpic: {
    height: '200px',
    width: 'auto',
  },
})


export default withStyles(styles)(Book);
