import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import orange from 'material-ui/colors/orange';
import grey from 'material-ui/colors/grey';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import App from './ui/App';
import './index.css';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk),
);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[800],
      light: orange[500],
    },
    secondary: {
      main: grey[900],
      light: grey[500],
    },
    background: {
      default: grey[300],
    },
  },
  
  shadows: ['none'],

  typography: {
    fontFamily: 'Lato',
  },
});

render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store} >
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'),
);
