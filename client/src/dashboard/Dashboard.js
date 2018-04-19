import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TransactionList from './TransactionList';
import BookList from './BookList';
import { UserDeserializer } from '../serializers/userSerializer';
import { BookDeserializer } from '../serializers/bookSerializer';
import { TransactionDeserializer } from '../serializers/transactionSerializer';

class Dashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    redirectToBook: false,
  }

  async componentWillMount() {
    this.goToBook = this._goToBook.bind(this);
    // TODO use redux to maintain global user state
    // check if user already logged in
    const token = localStorage.getItem('jwtToken');
    if (!token || token === '') return;
    // get user from token
    try {
      // Fetch User information
      const res = await fetch('/api/users/me', {
        headers: { 'x-auth-token': token },
      });

      // token probably expired, logout
      if (res.status === 401) {
        localStorage.removeItem('jwtToken');
      }
      let user = await res.json();
      user = await UserDeserializer.deserialize(user);

      // TODO have server return these relationships with query in "included"
      // TODO avoid await hell
      // Fetch favorites
      const favres = await fetch('api/users/favorites', {
        headers: { 'x-auth-token': token },
      });
      const favresjson = await favres.json();
      user.favorite = await BookDeserializer.deserialize(favresjson);
      // Fetch selling
      const sellres = await fetch('api/users/selling', {
        headers: { 'x-auth-token': token },
      });
      const sellresjson = await sellres.json();
      user.selling = await BookDeserializer.deserialize(sellresjson);
      // Fetch activity
      const actres = await fetch('api/users/activity', {
        headers: { 'x-auth-token': token },
      });
      const actresjson = await actres.json();
      user.activity = await TransactionDeserializer.deserialize(actresjson);
      user.activity = await Promise.all(user.activity.map(async (t) => {
        const bookRes = await fetch(`/api/books/${t.book}`);
        const bookResjson = await bookRes.json();
        const transact = { ...t };
        transact.book = await BookDeserializer.deserialize(bookResjson);
        return transact;
      }));

      console.log(`user info: ${JSON.stringify(user, null, 2)}`);
      this.setState({ token, user });
    } catch (e) {
      console.log(`error: ${e}`);
    }
  }

  // sends you to book page
  _goToBook(id) {
    this.setState({ redirectToBook: true, redirectToBookId: id });
  }

  render() {
    const {
      classes,
    } = this.props;
    const {
      user, redirectToBook, redirectToBookId,
    } = this.state;
    if (redirectToBook) return <Redirect push to={`/book/${redirectToBookId}`} />;

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
              <BookList books={user.favorite} onClick={this.goToBook} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.listPaper}>
              <Typography variant="headline" component="h3">
                Activity
              </Typography>
              <TransactionList transactions={user.activity} onClick={() => 'test'} />
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
