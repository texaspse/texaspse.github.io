import React from 'react'
import {render} from 'react-dom';
import App from './app';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
console.log('blah')
render(<MuiThemeProvider><App /></MuiThemeProvider>, document.getElementById('calendarBlah'));