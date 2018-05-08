import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile } from 'material-ui/GridList';
import Typography from 'material-ui/Typography';
import Grow from 'material-ui/transitions/Grow';
import Offer from './Offer';

class OfferList extends Component {
  static propTypes = {
    offers: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
    onDecline: PropTypes.func.isRequired,
  };

  static defaultProps = {
    offers: [],
  }

  state = {
  }

  static dateCompare(a, b) {
    const d1 = new Date(a.initiated || a.completed);
    const d2 = new Date(b.initiated || b.completed);
    return d1 < d2;
  }

  render() {
    const {
      classes,
      offers,
      user,
      token,
      onAccept,
      onDecline,
    } = this.props;

    return (
      <div>
        <Typography variant="title">My Offers</Typography>
        <br />
        {
          offers.filter(o => o.buyer.id === user.id).length > 0 ?
            <GridList className={classes.list} cellHeight="100%" cols={1}>
              {
                offers.filter(o => o.buyer.id === user.id).map((o, i) => (
                  <Grow key={o.id} in style={{transitionDelay: i * 75}}>
                    <GridListTile>
                      <Offer
                        offer={o}
                        token={token}
                        userId={user.id}
                        onAccept={onAccept}
                        onDecline={onDecline}
                      />
                    </GridListTile>
                  </Grow>
                ))
              }
            </GridList>
            : <Typography>No Offers</Typography>
        }
        <br />
        <Typography variant="title">Offers to me</Typography>
        <br />
        {
          offers.filter(o => o.buyer.id !== user.id).length > 0 ?
            <GridList className={classes.list} cellHeight="100%" cols={1}>
              {
                offers.filter(o => o.buyer.id !== user.id).map((o, i) => (
                  <Grow key={o.id} in style={{transitionDelay: i * 75}}>
                    <GridListTile>
                      <Offer
                        offer={o}
                        token={token}
                        userId={user.id}
                        onAccept={onAccept}
                        onDecline={onDecline}
                      />
                    </GridListTile>
                  </Grow>
                ))
              }
            </GridList>
            : <Typography>No Offers</Typography>
        }
      </div>
    );
  }
}

const styles = {
  list: {
    marginLeft: '23vh',
    marginRight: '23vh',
  },
  home: {
    margin: '20px',
  },
  empty: {
    verticalAlign: 'middle',
  },
};

export default withStyles(styles)(OfferList);
