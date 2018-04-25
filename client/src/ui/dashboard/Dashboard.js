import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import {
  getUserActivity,
  getUserInfo,
  userDeleteSellBook,
  userPostSellBooks,
} from '../../actions/users.actions';
import TransactionList from './TransactionList';
import FavoriteList from './FavoriteList';
import SellingList from './SellingList';
import SellBooksDialog from './SellBooksDialog';
import { deserializeBook } from '../../serializers/bookSerializer';

class Dashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
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
    try {
      // Fetch all the books (for sell modal)
      const resbook = await fetch('/api/books');
      const resjson = await resbook.json();
      const books = await deserializeBook(resjson);

      this.setState({ books });
      // TODO Bug with JSON API Serializer: If selling and favorite share books,
      // deserializer will not behave properly
      this.props.dispatch(getUserInfo(this.props.token, ['favorite', 'selling']));
      this.props.dispatch(getUserActivity(this.props.token));
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
    this.props.dispatch(userDeleteSellBook(this.props.token, id));
  }

  _onSell(selectedItems) {
    const { token, user } = this.props;
    const items = selectedItems.map(i => i.toLowerCase());
    const books = this.state.books
      .filter(b => items.includes(b.title.toLowerCase()));
    const bookIds = books.map(b => b.id);
    this.setState({
      showForm: false,
    });
    this.props.dispatch(userPostSellBooks(token, user, bookIds));
  }

  render() {
    const {
      classes,
      user,
      token,
      loggedIn,
    } = this.props;
    const {
      redirectToBook,
      redirectToBookId,
      showForm,
    } = this.state;
    // console.log(`USER BEFORE RENDER: ${JSON.stringify(user, null, 2)}`);
    if (redirectToBook) return <Redirect push to={`/book/${redirectToBookId}`} />;

    if (!loggedIn) return <div className={classes.unloggedin}>Please Log In</div>;
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

        <SellBooksDialog
          className={classes.dialog}
          onSell={this.onSell}
          handleClose={this.handleClose}
          showForm={showForm}
        />

        <Grid container className={classes.grid} justify="center" spacing={24}>
          <Grid item xs={12} md={4}>
            <Paper className={classes.listPaper}>
              <Typography variant="headline" component="h3">
                Unsold Books
              </Typography>
              <SellingList
                books={user.selling}
                onClick={this.goToBook}
                onMarkSoldClick={this.markSold}
              />
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
    margin: '30px',
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
  dialog: {
    width: '100%',
    height: '100%',
  },
};

const mapStateToProps = state => ({
  token: state.user.token,
  user: state.user.user,
  loggedIn: state.user.loggedIn,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Dashboard));
