import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
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
    secondary: {
      main: grey[900],
      light: grey[600],
    },
    primary: {
      main: orange[800],
      light: orange[500],
    },
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
