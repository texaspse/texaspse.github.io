import React from 'react'
import {render} from 'react-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Calendar from './calendar/calendar.js';
import OfficerList from './officer-list/officer-list.js';
import PhotoGallery from './photo-gallery/photo-gallery.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

//This is where all react components are attached to the website
if (document.getElementById('officerListBlah') !== null)
render(<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
		<OfficerList />
	</MuiThemeProvider>, document.getElementById('officerListBlah'));
///
if (document.getElementById('calendarBlah') !== null)
render(<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
		<Calendar />
	</MuiThemeProvider>, document.getElementById('calendarBlah'));
///
if (document.getElementById('photoGalleryBlah') !== null)
render(<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
		<PhotoGallery />
	</MuiThemeProvider>, document.getElementById('photoGalleryBlah'));


