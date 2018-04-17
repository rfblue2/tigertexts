import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TransactionList from './TransactionList';
import BookList from './BookList';

class Dashboard extends Component {
  state = {
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired, // token for auth with server
    favorites: PropTypes.arrayOf(PropTypes.object), // array of books
    selling: PropTypes.arrayOf(PropTypes.object), // array of books
    activity: PropTypes.arrayOf(PropTypes.object), // array of transactions
    user: PropTypes.object, // the user object
  }

  static defaultProps = {
    token: '12345',
    favorites: [
      { id: '12345', title: 'book1' },
      { id: '123534', title: 'book2' },
    ],
    selling: [
      { id: 'b232', title: 'book3' },
    ],
    activity: [
      { id: '45672', book: '15514', seller: 'someone', buyer: 'someone else', price: 10 },
    ],
    user: {
      name: 'roland',
      email: 'rfblue2@gmail.com',
    },
  }

  componentWillMount() {
  }

  render() {

    const { classes, user, selling, favorites, activity } = this.props;

    return (
      <div className={classes.dash}>
        <h1>Dashboard</h1>
        <p>Hello {user.name}</p>
        <Grid container className={classes.grid} justify="center" spacing={24}>
          <Grid item xs={12} md={4}>
            <Paper className={classes.listPaper}>
              <Typography variant="headline" component="h3">
                Unsold Books
              </Typography>
              <BookList books={selling} onClick={() => 'test'} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.listPaper}>
              <Typography variant="headline" component="h3">
                Favorites
              </Typography>
              <BookList books={favorites} onClick={() => 'test'} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.listPaper}>
              <Typography variant="headline" component="h3">
                Activity
              </Typography>
              <TransactionList transactions={activity} onClick={() => 'test'} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = {
  dash: {
    margin: '20px',
  },
  grid: {
    flexGrow: 1,
  },
  listPaper: {
    padding: '16px',
  },
};

export default withStyles(styles)(Dashboard);
