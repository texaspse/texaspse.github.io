import React from 'react'
import {render} from 'react-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Calendar from './calendar';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
console.log('blah')
render(<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
		<Calendar />
	</MuiThemeProvider>, document.getElementById('calendarBlah'));