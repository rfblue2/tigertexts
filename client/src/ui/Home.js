import React from 'react';
import Typography from 'material-ui/Typography';

const Home = () => (
  <div style={{ textAlign: 'center' }}>
    <br />
    <img src="logo.png" alt="LOGO" style={{ maxWidth: '50%' }} />
    <br />
    <br />
    <Typography style={{ fontSize: '24px' }} >
            The one-stop-shop for all your Princeton coursebook needs!
    </Typography>
    <div style={{ marginBottom: '5%' }} />
  </div>
);

export default (Home);
