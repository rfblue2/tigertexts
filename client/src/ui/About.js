import React from 'react';
import Typography from 'material-ui/Typography';

const About = () => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ marginTop: '5%' }} />
    <Typography style={{ fontSize: '30px' }} >
            Tigertexts - The one stop shop for all your Princeton coursebook needs!
    </Typography>
    <br />
    <img src="logo.png" alt="LOGO" style={{ maxWidth: '40%' }} />
    <br />
    <Typography style={{ fontSize: '24px' }} >
            Enter your courses in the searchbar above to get started!
    </Typography>
    <div style={{ marginBottom: '5%' }} />
  </div>
);


export default (About);
