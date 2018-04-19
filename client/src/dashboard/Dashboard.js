import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TransactionList from './TransactionList';
import BookList from './BookList';
import { UserDeserializer } from '../serializers/userSerializer';
import { BookDeserializer } from '../serializers/bookSerializer';

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
    activity: [
      {
        id: '45672', book: '15514', seller: 'someone', buyer: 'someone else', price: 10,
      },
    ],
  }

  async componentWillMount() {
    // TODO use redux to maintain global user state
    // check if user already logged in
    const token = localStorage.getItem('jwtToken');
    if (!token || token === '') return;
    // get user from token
    try {
      const res = await fetch('/api/users/me', {
        headers: { 'x-auth-token': token },
      });
      let user = await res.json();
      user = await UserDeserializer.deserialize(user);
      // TODO have server return these relationships with query in "included"
      user.favorite = await Promise.all(user.favorite.map(async (f) => {
        const res = await fetch(`/api/books/${f}`);
        const resjson = await res.json();
        return BookDeserializer.deserialize(resjson);
      }));
      user.selling = await Promise.all(user.selling.map(async (s) => {
        const res = await fetch(`/api/books/${s}`);
        const resjson = await res.json();
        return BookDeserializer.deserialize(resjson);
      }));
      console.log(`user info: ${JSON.stringify(user, null, 2)}`);
      this.setState({ token, user });
    } catch (e) {
      console.log(`error: ${e}`);
    }
  }

  render() {
    const {
      classes, activity,
    } = this.props;
    const {
      user,
    } = this.state;

    if (!user) return <div>Not logged in</div>;
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
              <BookList books={user.selling} onClick={() => 'test'} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.listPaper}>
              <Typography variant="headline" component="h3">
                Favorites
              </Typography>
              <BookList books={user.favorite} onClick={() => 'test'} />
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
