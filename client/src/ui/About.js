import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';

const About = ({ classes }) => (
  <div style={{ textAlign: 'center' }}>
    <Typography variant="display1" align="left">
      About
    </Typography>
    <br />
    <Typography variant="subheading" align="left">
      TigerTexts is your one stop shop for all your coursebook needs.
      We collect information from Blackboard, Labyrinth and Amazon so that you can
      learn about what coursebooks you need for each class and how much they'll
      cost you.  Furthermore, if you have old textbooks that you're just
      dying to get rid of, you can sell them right here on this platform!
    </Typography>
    <br />
    <Typography variant="display1" align="left">
      How to use this app
    </Typography>
    <br />
    <Typography variant="subheading" align="left">
      <ol>
        <li>
          Start typing course names or numbers into the search bar to see
          what books each course requires.
        </li>
        <li>
          Click on the down arrow to see
          more information about each book as well as listings on Amazon,
          Labyrinth, or from your fellow classmates.
        </li>
        <li>
          Log in (via Facebook)
          to favorite books and buy and sell books.
        </li>
        <li>
          To sell a book, press the 'Mark Sold' button
          on each book you wish to sell.  You may optionally specify a price.
        </li>
        <li>
          Interested buyers can then view the listings on each book record and
          make offers (optionally specifying a price they are willing to pay) to
          sellers.
        </li>
        <li>
          The buyer will be notified by email if a user is interested
          in buying their book, and can view all the offers in the Offers page.
        </li>
        <li>
          The seller can choose to accept or decline the offer and the offerer
          will be notified accordingly via email.
        </li>
      </ol>
    </Typography>
    <br />
    <Typography variant="display1" align="left">
      About the developers
    </Typography>
    <br />
    <div className={classes.gridroot}>
      <Grid container spacing={24} justify="center">
        <Grid item xs={6} md={3}>
          <Avatar alt="David Fan" src="/david.png" className={classes.avatar} />
          <br />
          <Typography variant="body" className={classes.caption}>David Fan '19</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Avatar alt="Roland Fong" src="/roland.jpg" className={classes.avatar} />
          <br />
          <Typography variant="body" className={classes.caption} >Roland Fong '19</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Avatar alt="Nathanael Ji" src="/nathanael.jpg" className={classes.avatar} />
          <br />
          <Typography variant="body" className={classes.caption} >Nathanael Ji '18</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Avatar alt="Kyle Xiao" src="/kyle.jpg" className={classes.avatar} />
          <br />
          <Typography variant="body" className={classes.caption} >Kyle Xiao '19</Typography>
        </Grid>
      </Grid>
    </div>
    <br />
    <Typography variant="subheading" align="left">
      This app was developed as a COS333 project in Spring 2018.
    </Typography>
    <div style={{ marginBottom: '5%' }} />
  </div>
);

const styles = {
  gridroot: {
    flexGrow: 1,
    justify: 'center',
  },
  caption: {
    justify: 'center',
  },
  avatar: {
    margin: '0 auto',
    width: '120px',
    height: '120px',
  },
};

export default withStyles(styles)(About);
