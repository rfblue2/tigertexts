import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import OfferList from './OfferList';
import { declineOffer, getUserOffers } from '../../actions/offers.actions';

class OfferContainer extends Component {
  state = { }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
    offers: PropTypes.arrayOf(PropTypes.object).isRequired,
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  }

  static defaultProps = {
  }

  componentWillReceiveProps(nextProps) {
    // Intended only to run during app startup in the event the user
    // starts in /offers path
    if (nextProps.token && !this.props.token) {
      this.props.dispatch(getUserOffers(nextProps.token));
    }
  }

  onAcceptOffer(token, offer) {
    this.props.dispatch(declineOffer(token, offer.id));
  }

  onDeclineOffer(token, offer) {
    this.props.dispatch(declineOffer(token, offer.id));
  }

  render() {
    const {
      offers,
      user,
      token,
    } = this.props;

    return (
      <OfferList
        offers={offers}
        user={user}
        token={token}
        onAccept={this.onAcceptOffer.bind(this)}
        onDecline={this.onDeclineOffer.bind(this)}
      />
    );
  }
}

const styles = {
};

const mapStateToProps = state => ({
  token: state.user.token,
  loggedIn: state.user.loggedIn,
  user: state.user.user,
  offers: state.offer.offers,
});


const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(OfferContainer));
