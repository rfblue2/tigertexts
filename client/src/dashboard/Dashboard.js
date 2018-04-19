import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Modal from 'material-ui/Modal';
import Tooltip from 'material-ui/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import TransactionList from './TransactionList';
import FavoriteList from './FavoriteList';
import SellingList from './SellingList';
import SellBooksForm from './SellBooksForm';
import {UserDeserializer, UserSerializer} from '../serializers/userSerializer'
import { BookDeserializer } from '../serializers/bookSerializer';
import { TransactionDeserializer } from '../serializers/transactionSerializer';

class Dashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    redirectToBook: false,
    showForm: false,
    books: [],
  }

  async componentWillMount() {
    this.markSold = this._markSold.bind(this);
    this.onSell = this._onSell.bind(this);
    this.goToBook = this._goToBook.bind(this);
    this.handleOpen = this._handleOpen.bind(this);
    this.handleClose = this._handleClose.bind(this);
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
      // Fetch all the books (for sell modal)
      const resbook = await fetch('/api/books');
      const resjson = await resbook.json();
      const books = await BookDeserializer.deserialize(resjson);
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
      this.setState({ token, user, books });
    } catch (e) {
      console.log(`error: ${e}`);
    }
  }

  // sends you to book page
  _goToBook(id) {
    this.setState({ redirectToBook: true, redirectToBookId: id });
  }

  _handleOpen = () => {
    this.setState({ showForm: true });
  };

  _handleClose = () => {
    this.setState({ showForm: false });
  };

  async _markSold(id) {
    await fetch(`/api/users/selling/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': this.state.token },
    });
    this.setState({
      user: {
        ...this.state.user,
        selling: this.state.user.selling.filter(b => b.id !== id),
      },
    });
  }

  async _onSell(selectedItems) {
    const { token, user } = this.state;
    const items = selectedItems.map(i => i.toLowerCase());
    const books = this.state.books
      .filter(b => items.includes(b.title.toLowerCase()));
    const userObj = {
      data: {
        type: 'user',
        id: user.id,
        attributes: {},
        relationships: {
          selling: {
            data: books.map((b) => {
              return {
                type: 'book',
                id: b.id,
              };
            }),
          },
        },
      },
    };
    console.log(JSON.stringify(userObj));
    await fetch('api/users/selling', {
      method: 'POST',
      headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(userObj),
    });
    this.setState({
      user: { ...user, selling: [...this.state.user.selling, ...books] },
      showForm: false,
    });
  }

  render() {
    const {
      classes,
    } = this.props;
    const {
      user,
      redirectToBook,
      redirectToBookId,
      showForm,
    } = this.state;
    console.log("USER: " + JSON.stringify(user, null, 2));
    if (redirectToBook) return <Redirect push to={`/book/${redirectToBookId}`} />;

    if (!user) return <div className={classes.unloggedin}>Please Log In</div>;
    return (
      <div className={classes.dash}>
        <h1>Dashboard</h1>
        <p>Hello {user.name}</p>

        <Tooltip id="tooltip-fab" title="Sell a book">
          <Button
            variant="fab"
            color="primary"
            aria-label="add"
            onClick={this.handleOpen}
            className={classes.sellButton}
          >
            <AddIcon />
          </Button>
        </Tooltip>

        <Modal
          aria-labelledby="Sell a book"
          open={showForm}
          onClose={this.handleClose}
        >
          <SellBooksForm onSell={this.onSell}/>
        </Modal>

        <Grid container className={classes.grid} justify="center" spacing={24}>
          <Grid item xs={12} md={4}>
            <Paper className={classes.listPaper}>
              <Typography variant="headline" component="h3">
                Unsold Books
              </Typography>
              <SellingList books={user.selling} onClick={this.goToBook} onMarkSoldClick={this.markSold} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.listPaper}>
              <Typography variant="headline" component="h3">
                Favorites
              </Typography>
              <FavoriteList books={user.favorite} onClick={this.goToBook} />
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
  unloggedin: {
    margin: '20px',
  },
  dash: {
    margin: '20px',
  },
  grid: {
    flexGrow: 1,
  },
  listPaper: {
    padding: '16px',
  },
  sellButton: {
    position: 'fixed',
    bottom: 16 * 2,
    right: 16 * 3,
    zIndex: 10, // float above all!
  },
};

export default withStyles(styles)(Dashboard);
