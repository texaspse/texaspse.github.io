import React from 'react'
import $ from 'jquery'
import RRule from 'rrule'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {MAX_WIDTH_MOBILE_VIEW, BACKGROUND_COLOR, HIGHLIGHT_COLOR} from './styles.js'


export default class CalendarInstruction extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		const {type, cancel} = this.props;
		console.log('blah')
		const isCalendarDialogueVisible = (type !== null)
		if (isCalendarDialogueVisible == false){
			return <div></div>
		}

		const actions = [
	    <FlatButton
	    	onTouchTap={cancel}
	      	backgroundColor = {HIGHLIGHT_COLOR}
	      	labelStyle = {{color:'#fff', fontSize:'18px'}}
	        label="Done"
	        hoverColor={'#9CCC65'}
	        primary={true}
		  />
		  ];

		 if (type == 'Outlook Online'){
			return <div>
			<Dialog
			  titleStyle={{color: HIGHLIGHT_COLOR}}
			  actionsContainerStyle={{paddingBottom:'20px', paddingRight:'20px'}}
			  title={'Instructions To Subscribe To Texas PSE Calendar Using Outlook Web App'}
			  actions={actions}
			  modal={false}
			  open={isCalendarDialogueVisible}>

			  <div style={{color:'white'}}>
				<p>{'1. In your Outlook Calendar client, click Add Calendar > From internet'}</p>
				<p>2. Copy &amp; past the following link:</p> 
				<p>https://calendar.google.com/calendar/ical/p2s62j1glcm2of7co1qoumio84%40group.calendar.google.com/public/basic.ics</p>
				<p>3. Enter a Calendar Name (optional). </p>
				<p>4. Click "OK" when finished. </p>
			  </div>
			</Dialog>
			</div>
		 }
	 	 else if (type == 'Yahoo Online'){
		 	return <div>
			<Dialog
			  titleStyle={{color: HIGHLIGHT_COLOR}}
			  actionsContainerStyle={{paddingBottom:'20px', paddingRight:'20px'}}
			  title={'Instructions To Subscribe To Texas PSE Calendar Using Yahoo'}
			  actions={actions}
			  modal={false}
			  open={isCalendarDialogueVisible}>

			  <div style={{color:'white'}}>
				<ol>
				<p>{'1. In Yahoo Mail, click the Calendar icon'}</p> 
				<p>2. Mouse over "Others," click the Manage Followed Calendars icon</p> 
				<p>3. Select Follow Other Calendars</p> 
				<p>4. Enter a name for your calendar</p> 
				<p>5. Enter the following iCal address.</p>
				<p>https://calendar.google.com/calendar/ical/p2s62j1glcm2of7co1qoumio84%40group.calendar.google.com/public/basic.ics</p>
				<p>6. Select a color for the calendar</p> 
				<p>7. Select Refresh and Remind options</p> 			
				<p>8. Click Continue</p> 
				</ol>
			  </div>
			</Dialog>
			</div>
		 }

		 else if (type == 'Outlook'){
		 	return <div>
			<Dialog
			  titleStyle={{color: HIGHLIGHT_COLOR}}
			  actionsContainerStyle={{paddingBottom:'20px', paddingRight:'20px'}}
			  title={'Instructions To Subscribe To Texas PSE Calendar Using Outlook'}
			  actions={actions}
			  modal={false}
			  open={isCalendarDialogueVisible}>

			  <div style={{color:'white'}}>
				<ol>
				<p>{'1. In your Outlook Calendar client, click Open Calendar > From Internet...'}</p>
				<p>2. Copy &amp; past the following link:</p> 
				<p>https://calendar.google.com/calendar/ical/p2s62j1glcm2of7co1qoumio84%40group.calendar.google.com/public/basic.ics</p>
				<p>3. Click Add. </p>
				<p>4. Click "Save" when finished. </p>
				</ol>
			  </div>
			</Dialog>
			</div>
		 }
		 else if (type == 'iCalendar'){
		 	return <div>
			<Dialog
			  titleStyle={{color: HIGHLIGHT_COLOR}}
			  actionsContainerStyle={{paddingBottom:'20px', paddingRight:'20px'}}
			  title={'Instructions To Subscribe To Texas PSE Calendar Using iOS Calendar'}
			  actions={actions}
			  modal={false}
			  open={isCalendarDialogueVisible}>

			  <div style={{color:'white'}}>
				<ol>
				<p>{'1. In Calendar, choose File > New Calendar Subscription.'}</p>
				<p>2. Copy &amp; past the following link:</p> 
				<p>https://calendar.google.com/calendar/ical/p2s62j1glcm2of7co1qoumio84%40group.calendar.google.com/public/basic.ics</p>
				<p>3. Click Subscribe.</p>
				<p>4. Enter a name for the calendar in the Name field and choose a color from the adjacent pop-up menu.</p>
				<p>5. Click OK.</p>
				</ol>
			  </div>
			</Dialog>
			</div>
		 }

		 else{
			return <div>
			<Dialog
			  titleStyle={{color: HIGHLIGHT_COLOR}}
			  actionsContainerStyle={{paddingBottom:'20px', paddingRight:'20px'}}
			  title={'Instructions To Subscribe To Texas PSE Calendar'}
			  actions={actions}
			  modal={false}
			  open={isCalendarDialogueVisible}>

			  <div style={{color:'white'}}>
			  <p>Please use the following address to access your calendar from other applications. You can copy and paste this into any calendar product that supports the iCal format.
			  </p>
			  <p>https://calendar.google.com/calendar/ical/p2s62j1glcm2of7co1qoumio84%40group.calendar.google.com/public/basic.ics
			  </p>

			  </div>
			</Dialog>
			</div>
		}

	}
}
