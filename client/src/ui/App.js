import React, { Component } from 'react';
import { withWindowSizeListener } from 'react-window-size-listener';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {
  getJwt,
  removeJwt,
  facebookResponse, userPostSellBooks, userCancelSellDialog, closeSnack,
} from '../actions/users.actions';
import {
  getBooksForClasses,
  getSearchResults,
  getUserFavoriteBooks,
  getUserSellingBooks,
} from '../actions/books.actions';
import AutoComplete from './nav/AutoComplete';
import BookListContainer from './book/BookListContainer';
import Sidebar from './drawer/Sidebar';
import Navbar from './nav/Navbar';
import { deserializeClass } from '../serializers/classSerializer';
import About from './About';
import SellDialog from './book/SellDialog';
import { closeListingDialog } from '../actions/listings.actions';
import ListingDialog from './book/ListingDialog';
import OffersContainer from './offer/OfferContainer';
import { getUserOffers, postOffer } from '../actions/offers.actions';

const drawerWidth = 240;

class App extends Component {
  state = {
    courses: [],
    sidebarOpen: true,
    showResults: false,
    navBarHeight: 51,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    sellingBook: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    user: PropTypes.object,
    token: PropTypes.string,
    showSellForm: PropTypes.bool.isRequired,
    listing: PropTypes.object,
    showListingDialog: PropTypes.bool.isRequired,
    sellBookSnack: PropTypes.bool.isRequired,
    soldSnack: PropTypes.bool.isRequired,
    notifySellerSnack: PropTypes.bool.isRequired,
    updateOfferSnack: PropTypes.bool.isRequired,
    favoritedSnack: PropTypes.bool.isRequired,
    openSnack: PropTypes.bool.isRequired,
    windowSize: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isLoggedIn: false,
    sellingBook: null,
    user: {},
    token: '',
    listing: {},
  }

  async componentWillMount() {
    this.showSearch = this._showSearch.bind(this);
    this.handleLogout = this._handleLogout.bind(this);
    this.responseFacebook = this._responseFacebook.bind(this);
    this.handleSearch = this._handleSearch.bind(this);
    this.handleMenu = this._handleMenu.bind(this);
    this.handleCloseSellDialog = this._handleCloseSellDialog.bind(this);
    this.showSelling = this._showSelling.bind(this);
    this.showFavorites = this._showFavorites.bind(this);
    this.sellBook = this._sellBook.bind(this);
    this.handleCloseListingDialog = this._handleCloseListingDialog.bind(this);
    this.showOffers = this._showOffers.bind(this);
    this.handleOnOffer = this._handleOnOffer.bind(this);
    this.handleCloseSnack = this._handleCloseSnack.bind(this);
    this.trimLabel = this._trimLabel.bind(this);
    this.retrieveNavBarHeight = this._retrieveNavBarHeight.bind(this);

    // TODO move this into redux (maybe)
    const cres = await fetch('/api/classes');
    const cresjson = await cres.json();
    const courses = await deserializeClass(cresjson);
    this.setState({ courses });

    // Check if already logged in
    this.props.dispatch(getJwt());
  }

  _handleLogout() {
    this.props.dispatch(removeJwt());
  }

  _responseFacebook(res) {
    // Get token from facebook info
    this.props.dispatch(facebookResponse(res));
  }

  _showSearch() {
    this.props.dispatch(getSearchResults());
  }

  _handleSearch(items) {
    this.props.dispatch(getBooksForClasses(items.map(i => i.id)));
    this.setState({ showResults: true });
  }

  _handleMenu() {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  }

  _sellBook({ id, price, comment }) {
    const { token, user } = this.props;
    this.props.dispatch(userPostSellBooks(
      token, user, [id],
      [{ id, price, comment }],
    ));
  }

  _handleCloseSellDialog = () => {
    this.props.dispatch(userCancelSellDialog());
  };

  _handleCloseListingDialog = () => {
    this.props.dispatch(closeListingDialog());
  };

  _showSelling() {
    this.props.dispatch(getUserSellingBooks(this.props.token));
  }

  _showFavorites() {
    this.props.dispatch(getUserFavoriteBooks(this.props.token));
  }

  _showOffers() {
    this.props.dispatch(getUserOffers(this.props.token));
  }

  _handleOnOffer(token, listingId, price, userId) {
    const offer = {
      price,
      buyer: userId,
      listing: listingId,
    };
    this.props.dispatch(postOffer(token, offer));
  }

  _handleCloseSnack() {
    this.props.dispatch(closeSnack());
  }

  getSnackMessage() {
    if (this.props.notifySellerSnack) {
      return 'Seller has been notified of your offer';
    } else if (this.props.favoritedSnack) {
      return 'Updated favorites';
    } else if (this.props.sellBookSnack) {
      return 'Book now marked as selling';
    } else if (this.props.soldSnack) {
      return 'Book marked as sold';
    } else if (this.props.updateOfferSnack) {
      return 'Offer updated';
    }
    return 'Updated!';
  }

  _trimLabel(label) {
    const { windowSize } = this.props;
    var maxLength = Math.floor(windowSize.windowWidth / 8);
    if (label.length < maxLength) { return(label); }

    return(label.substring(0,maxLength - 3) + "...");
  }

  _retrieveNavBarHeight(height) {
    this.setState({ navBarHeight: height});

  }

  render() {
    const {
      classes,
      isLoggedIn,
      showSellForm,
      sellingBook,
      showListingDialog,
      listing,
      user,
      token,
      openSnack,
      windowSize, 
    } = this.props;
    const { courses, sidebarOpen, showResults, navBarHeight } = this.state;
    let isMobile = false;
    if (windowSize.windowWidth < 600) {
      isMobile = true;
    }
    if (showResults) {
      this.setState({ showResults: false });
    }

    return (
      <Router>
        <div className={classes.appFrame}>
          { showResults ? <Redirect to="/" /> : '' }
          <Navbar
            isLoggedIn={isLoggedIn}
            responseFacebook={this.responseFacebook}
            handleLogout={this.handleLogout}
            handleMenu={this.handleMenu}
            retrieveNavBarHeight={this.retrieveNavBarHeight}
          >
            <AutoComplete
              executeSearch={this.handleSearch}
              courseList={courses.map(course => ({
                            value: course,
                            label: this.trimLabel(`${course.numbers.join('/')} - ${course.title}`),
                            labelnum: `${course.numbers.join('/')}`,
                          }))}
            />
          </Navbar>
          <Sidebar
            open={sidebarOpen}
            loggedIn={isLoggedIn}
            showSearch={this.showSearch}
            sellBook={this.sellBook}
            showSelling={this.showSelling}
            showFavorites={this.showFavorites}
            showOffers={this.showOffers}
            navBarHeight={navBarHeight}
          />
          <main
            className={classNames(classes.content, classes['content-left'], {
              [classes.contentShift]: sidebarOpen && !isMobile,
              [classes['contentShift-left']]: sidebarOpen && !isMobile,
              [classes['contentShift-down-loggedin']]: sidebarOpen && isMobile && isLoggedIn,
              [classes['contentShift-down-notloggedin']]: sidebarOpen && isMobile && !isLoggedIn,
            })}
            style={{paddingTop: navBarHeight - 51}}
          >
            <SellDialog
              className={classes.dialog}
              onSubmit={this.sellBook}
              onClose={this.handleCloseSellDialog}
              book={sellingBook}
              showForm={showSellForm}
            />
            <ListingDialog
              listing={listing}
              showForm={showListingDialog}
              user={user}
              loggedIn={isLoggedIn}
              token={token}
              onOffer={this.handleOnOffer}
              onClose={this.handleCloseListingDialog}
            />
            <div className={classes.toolbar} />
            <Route exact path="/" component={BookListContainer} />
            <Route exact path="/about" component={About} />
            <Route exact path="/offers" component={OffersContainer} />
          </main>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openSnack}
            autoHideDuration={3000}
            onClose={this.handleCloseSnack}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.getSnackMessage()}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleCloseSnack}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </div>
      </Router>
    );
  }
}

const styles = theme => ({
  dialog: {
    width: '100%',
    height: '100%',
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  appFrame: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    height: '100%',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: drawerWidth,
  },
  'contentShift-down-loggedin': {
    marginTop: 215, // hard coded
  },
  'contentShift-down-notloggedin': {
    marginTop: 110, // hard coded
  },
  toolbar: theme.mixins.toolbar,
});

const mapStateToProps = state => ({
  isLoggedIn: state.user.loggedIn,
  sellingBook: state.user.sellDialog.book,
  token: state.user.token,
  user: state.user.user,
  showSellForm: state.user.sellDialog.isSelling,
  listing: state.listing.listing,
  showListingDialog: state.listing.dialogOpen,
  sellBookSnack: state.user.sellBookSnack,
  soldSnack: state.user.soldSnack,
  notifySellerSnack: state.user.notifySellerSnack,
  updateOfferSnack: state.user.updateOfferSnack,
  favoritedSnack: state.user.favoritedSnack,
  openSnack: state.user.openSnack,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withWindowSizeListener(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(App)));
