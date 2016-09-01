import React from 'react'
import IconMenu from 'material-ui/IconMenu';
import $ from 'jquery'
import RRule from 'rrule'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import moment from 'moment'
import {render} from 'react-dom';
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';

const MAX_WIDTH_MOBILE_VIEW = 750;
const BACKGROUND_COLOR = '#1A1314'
const HIGHLIGHT_COLOR = '#41D6C3'

export default class Calendar extends React.Component 
{
	constructor(props){

		super(props);
		const self = this;
		this.handleResize = this.handleResize.bind(this);
	    this.state = {
	      open: false,
	    };

		var calendarID = 'p2s62j1glcm2of7co1qoumio84@group.calendar.google.com';
		//var calendarID = 'texaspse@gmail.com';
        var key = 'AIzaSyBPmI2uj1LjQ30oI0lCKKMK8IoF25AyoOo'
        var url = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarID + '/events?key=' + key;

        $.getJSON(url, function(result) {
        	console.log(result)
        	self.setState({
        		result: result,
        	})
        })

	}


  handleResize(event) {
  	this.setState({
  		width: window.innerWidth,
  		height: window.innerHeight,
  		mobileView: isMobileDevice(),})
  	console.log(this.state)
  }

   componentWillMount() {
    this.state = ({
    	width: window.innerWidth,
    	height: window.innerHeight,
    	date: new Date(),
    	result: null,
    	dialogEvent: null,
    	mobileView: isMobileDevice(),
    	extendedEventDesc: new Map(),
    	typeOfCalendarInstruction: null})
    window.addEventListener('resize', this.handleResize);
  }


  setTypeOfCalendarInstruction(type){
  	this.setState({
  		typeOfCalendarInstruction: type,
  	})
  }


  setDialogEvent(event) {
  	this.setState({
  		dialogEvent: event,
  	})
  }

	  incrementMonth(inc) {
	  	this.setState({
	  		date: addMonth(this.state.date, inc)
	  	});
	  }

	  toggleExtendedEventDesc(key){
	  	const map = this.state.extendedEventDesc;
	  	map.set(key, !map.get(key))
	  	this.setState({
	  		extendedEventDesc: map,
	  	})
	  }



  handleTouchTap(event){
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  };

    handleRequestClose(){
    this.setState({
      open: false,
    });
  };


	render() 
	{
		console.log('state')
		console.log(this.state)


		const DialogShowingEventDetails = ({event, close}) => {
			console.log('blah2')
			if (!event) return <div></div>;
			const actions = [
			<FlatButton
		      	backgroundColor = {HIGHLIGHT_COLOR}
		      	labelStyle = {{color:'#fff', fontSize:'18px'}}
		        label="Got It!"
		        hoverColor={'#9CCC65'}
		        primary={true}
		        onTouchTap={close}
		      />,

		      ];

		    return <div>
		        <Dialog
		          titleStyle={{color: HIGHLIGHT_COLOR}}
		          actionsContainerStyle={{paddingBottom:'20px', paddingRight:'20px'}}
		          title={event.eventName}
		          actions={actions}
		          modal={false}
		          open={true}>

		          <div style={{color:'white'}}>
		          	<p>{'Date: ' + moment(event.startDate).format('MMMM Do YYYY')}</p>
		          	<p>{'Time: ' + moment(event.startDate).format('h:mm') + ' - ' + moment(event.endDate).format('h:mm a')}</p>
		          	<p>{'Location: ' + (event.location || '')}</p>
		          	<p>{(event.description || '')}</p>
		          </div>
		        </Dialog>
		    </div>
		}


		if (this.state.mobileView === false) {
			
			const columnFlexBox = {display: 'flex', justifyContent: 'space-around', flexDirection: 'column', margin: 25,};

			const events = getEventObjectsFromResult(this.state.result, this.state.date);
			const width = this.state.width;
			const height = this.state.height;
			const matrix = makeMonthMatrix(this.state.date);
			return (
				<div style={{color: 'white', backgroundColor: BACKGROUND_COLOR, width: '100%', padding: 10, maxHeight: 1000, overflowY: 'auto'}}>
					<DialogShowingEventDetails event={this.state.dialogEvent} close={() => {this.setDialogEvent(null)}}/>
					<CalendarInstruction type={this.state.typeOfCalendarInstruction} cancel={() => {this.setTypeOfCalendarInstruction(null);}}/>

					<div style={{display: 'flex', justifyContent: 'space-between', width: '100%',}}>
						<div style={columnFlexBox}>
							<RaisedButton label={moment(addMonth(this.state.date, -1)).format('MMMM')} onTouchTap={() => {this.incrementMonth(-1)}}/>
						</div>

						<div style={columnFlexBox}>
							<h2>{moment(this.state.date).format('MMMM YYYY')}</h2>
						</div>
						<div style={columnFlexBox}>
							<RaisedButton label={moment(addMonth(this.state.date, 1)).format('MMMM')} onTouchTap={() => {this.incrementMonth(1)}}/>
						</div>
					</div>
					<div style={{display: 'flex', justifyContent: 'space-around', width: '100%', height: 40, color: 'inherit'}}>
						{
							['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((w) => {return <p>{w}</p>})
						}
					</div>
					<div style={{width: '100%'}}>
					{
						matrix.map((row, rowIndex) => {
							return (
								<div style={{display: 'flex', width: '100%', minHeight: 100,}}>
								{
									row.map((day, dayIndex) => {
										const monthOfCell = getMonthFromCalendarCell(day, rowIndex, this.state.date).getMonth();
										const numberColor = monthOfCell === this.state.date.getMonth() ? 'white' : '#737373';
										const dateOfCell = new Date(this.state.date);
										dateOfCell.setDate(day);
										dateOfCell.setMonth(monthOfCell);
										const eventsInCell = events.filter((event) => {
											return sameDates(event.startDate, dateOfCell);
										})
										const backgroundColor = sameDates(new Date(), dateOfCell) ? '#404040' : BACKGROUND_COLOR
										const cellBorder = getBorderFromCell(matrix, dayIndex, rowIndex, dateOfCell);
										return <div style={{...cellBorder, width: (100/7)+'%', backgroundColor}}>
											<div style={{position: 'relative', width: '100%', height: '100%'}}>
												{
													[1].map((x) => {
														if (eventsInCell.length === 0) return <p style={{color: numberColor, position: 'absolute', top: 0, right: 5}}>{day}</p>
													})
												}
												{
													eventsInCell.map((event) => {
														return <EventInCell
														 event={event} 
														 onClick={()=>{this.setDialogEvent(event)}}/>
													})
												}
											</div>
										</div>
									})
								}
								</div>
							)
						})
					}
					</div>


		      <div style={columnFlexBox}>
		        <RaisedButton
		          onTouchTap={(event) => {this.handleTouchTap(event)}}
		          label="SUBSCRIBE TO THIS CALENDAR"

		        />
		        <Popover
				  open={this.state.open}
		          anchorEl={this.state.anchorEl}
		          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
		          targetOrigin={{horizontal: 'left', vertical: 'top'}}
	              onRequestClose={() => {this.handleRequestClose()}}
		        >
		          <Menu>
		            <MenuItem primaryText="Google Calendar" onTouchTap={() => {window.open("https://calendar.google.com/calendar/render?cid=p2s62j1glcm2of7co1qoumio84@group.calendar.google.com&pli=1#main_7")}}/>
		            <MenuItem primaryText="iCalendar" onTouchTap={() => {this.setTypeOfCalendarInstruction('iCalendar'); this.handleRequestClose();}}/>
		            <MenuItem primaryText="Outlook" onTouchTap={() => {this.setTypeOfCalendarInstruction('Outlook'); this.handleRequestClose();}}/>
		            <MenuItem primaryText="Outlook Online" onTouchTap={() => {this.setTypeOfCalendarInstruction('Outlook Online'); this.handleRequestClose();}}/>
		            <MenuItem primaryText="Yahoo Online" onTouchTap={() => {this.setTypeOfCalendarInstruction('Yahoo Online'); this.handleRequestClose();}}/>
		            <MenuItem primaryText="Other" onTouchTap={() => {this.setTypeOfCalendarInstruction('Other'); this.handleRequestClose();}}/>
		          </Menu>
		        </Popover>
		      </div>

				</div>
			);
		}
		else {
			const currentDate = new Date();
			const events = getEventObjectsFromResult(this.state.result, this.state.date);
			const ALLOWED_TIME_AFTER_CURRENT_DATE = 14 * 24 * 3600 * 1000;

			const upcomingEvents = events.filter((event) => {
				const dateDifference = event.endDate - currentDate;
				return dateDifference >= 0 && dateDifference <= ALLOWED_TIME_AFTER_CURRENT_DATE
			})
			const paperStyle = {width: 800, padding: 10, paddingBottom: 40};
			const centerFlexbox = {display: 'flex', justifyContent: 'space-around', margin: 30};
			const title = upcomingEvents.length > 0 ? 'Upcoming Events' : 'No Upcoming Events This Week';
			const margin = 40; 
			return <div style={{width: '100%'}}>
				<DialogShowingEventDetails event={this.state.dialogEvent} close={() => {this.setDialogEvent(null)}}/>
				<div style={centerFlexbox}><h2>{title}</h2></div> 
				{
					upcomingEvents.map((event) => {
						const key = event.id + event.startDate.getDate()
						console.log({key, state:this.state})
						const location = event.location ? <p>{'Location: ' + event.location}</p> : <div></div>
						const isExpanded = this.state.extendedEventDesc.get(key) === true
						const description = isExpanded ? <p>{'Description: ' + event.description}</p> : <div></div>

						return <div style={centerFlexbox}>
							<Paper style={paperStyle} zDepth={3}>
								<div style={centerFlexbox}><h3 style={{color: HIGHLIGHT_COLOR}}>{event.eventName}</h3></div>
								<div style={{marginLeft:'40px'}}>
						          	<p>{'Date: ' + moment(event.startDate).format('dddd, MMMM Do YYYY')}</p>
						          	<p>{'Time: ' + moment(event.startDate).format('h:mm') + ' - ' + moment(event.endDate).format('h:mm a')}</p>
						          	{location}
						          	{description}
					          	</div>
					          	<RaisedButton style={{marginLeft:'40px'}} backgroundColor = {HIGHLIGHT_COLOR} labelStyle = {{color:'#fff', fontSize:'16px'}} hoverColor={'#9CCC65'} label={isExpanded ? "Show Less" : "Show More"} onTouchTap={()=>{this.toggleExtendedEventDesc(key)}}/>
							</Paper>
						</div>
					})
				}
			</div>
		}

	}
}

const CalendarInstruction = ({type, cancel}) => {
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

const EventInCell = ({event, onClick}) => {
	const divStyle = {display: 'auto', padding: 5}
	const style = {margin: 5}
	var name = <b><div style={{...divStyle, color: HIGHLIGHT_COLOR}}>{'No Name'}</div></b>
	if (event.eventName)
		name = <b><div style={{...divStyle, color: HIGHLIGHT_COLOR}}>{event.eventName}</div></b>
	else if (event.description)
		name = <b><div style={{...divStyle, color: HIGHLIGHT_COLOR}}>event.description</div></b>
	
	const dateStr = <div style={divStyle}>{moment(event.startDate).format('h:mm') + ' - ' + moment(event.endDate).format('h:mm a')}</div>;

	const location = event.location ? <div style={divStyle}>{event.location}</div> : <div></div>;
	
	return <Paper style={style} zDepth={2}>
		<List>
			<ListItem innerDivStyle={{padding: '0px'}} onTouchTap={onClick}>
					{name}
					{dateStr}
					{location}
			</ListItem>
		</List>
	</Paper>
}

function isMobileDevice(){
	return window.innerWidth <= MAX_WIDTH_MOBILE_VIEW || screen.width <= 480;
}

function getBorderFromCell(matrix, dayIndex, rowIndex, cellDate) {
	const cellBorder = sameDates(new Date(), cellDate) ? '1px solid ' + HIGHLIGHT_COLOR : '1px solid grey';
	if (sameDates(new Date(), cellDate)) {
		return {borderLeft: cellBorder, borderTop: cellBorder, borderRight: cellBorder, borderBottom: cellBorder}
	}
	var style = {borderLeft: cellBorder, borderTop: cellBorder};
	if (dayIndex === matrix[0].length - 1)
		style = {...style, borderRight: cellBorder}
	if (rowIndex === matrix.length - 1)
		style = {...style, borderBottom: cellBorder}
	if (new Date().getMonth() === cellDate.getMonth()) {
		if (sameDates(new Date(), addDate(cellDate, -1)))
			style={...style, borderLeft: '0px solid grey'}
		if (sameDates(new Date(), addDate(cellDate, -7)))
			style={...style, borderTop: '0px solid grey'}
		if (sameDates(new Date(), addDate(cellDate, 1)))
			style={...style, borderRight: '0px solid grey'}
		if (sameDates(new Date(), addDate(cellDate, 7)))
			style={...style, borderBottom: '0px solid grey'}
	}
	return style; 
}

function getMonthFromCalendarCell(day, rowIndex, currentDate) {
	if (rowIndex === 0 && day > 7) {
		var d = new Date(currentDate);
		d.setMonth(d.getMonth - 1);
		return d;
	}
	else if (rowIndex > 3 && day <= 7) {
		var d = new Date(currentDate);
		d.setMonth(d.getMonth + 1);
		return d;
	}
	else 
		return new Date(currentDate);
}

function getEventObjectsFromResult(result, currentDate) {
	if (!result) return [];
	var events = [];
	const items = result.items;
	const maxDate = addMonth(currentDate, 1);
	const minDate = addMonth(currentDate, -1);
	items.forEach((item) => {
		if (item.status === 'cancelled' && item.recurringEventId !== undefined) {
			events = cancelEvent(events, item);
		}
		else if (item.status === 'confirmed' && item.recurringEventId !== undefined) {
			events = updateSingleEvent(events, item)
		}
		else if (item.status !== 'cancelled' && item.recurrence === undefined) {
			events.push(format(item));
		}
		else if (item.status !== 'cancelled' && item.recurrence !== undefined) {
			events = getEventsFromRRule(events, item, maxDate, minDate)
		}
	})
	console.log('events')
	console.log(events)
	return events
}

function updateSingleEvent(events, item) {
	return events.map((event) => {
		const originalStartTime = moment(item.originalStartTime.dateTime).toDate();
		if (event.id === item.recurringEventId && sameDates(event.startDate, originalStartTime)) {
			return format(item);
		}
		return event;
	})
}

function cancelEvent(events, item) {
	const recurrenceId = item.recurringEventId
	const deletedDate = moment(item.originalStartTime.dateTime).toDate();
	return events.filter((event) => {
		if (event.id === recurrenceId && sameDates(event.startDate, deletedDate))
			return false;
		return true;
	})
}

function getEventsFromRRule(events, item, maxDate, minDate) {
	var options = RRule.parseString(item.recurrence[0].replace('RRULE:', ''));
	options.dtstart = moment(item.start.dateTime).toDate();
	var rule = new RRule(options);
    var dates = rule.between(minDate, maxDate);
    const formattedItem = format(item);
    const startMin = formattedItem.startDate.getMinutes();
    const startHour = formattedItem.startDate.getHours();
   	const endMin = formattedItem.endDate.getMinutes();
    const endHour = formattedItem.endDate.getHours();
    dates = dates.map((date) => {
    	const copiedItem = Object.assign({}, formattedItem);
    	copiedItem.startDate = new Date(date);
    	copiedItem.endDate = new Date(date);
    	copiedItem.startDate.setHours(startHour)
    	copiedItem.startDate.setMinutes(startMin)
    	copiedItem.endDate.setHours(endHour)
    	copiedItem.endDate.setMinutes(endMin)
    	return copiedItem
    })
    events = events.concat(dates)
    return events;
}

function sameDates(d1, d2) {
	return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function format(result) {
    return {
        creationDate: moment(result.created).toDate(),
        creator: result.creator,
        startDate: moment(result.start.dateTime).toDate(),
        endDate: moment(result.end.dateTime).toDate(),
        description: result.description,
        repeatRule: result.recurrence,
        eventName: result.summary,
        location: result.location,
        id: result.id,
        status: result.status,
    }
}

function makeMonthMatrix(date) {
	let matrix = zero2D(6, 7);
	const daysInMonth = getDaysInMonth(date);
	const firstDay = getDayOfWeekOfFirstDay(date);
	const lastMonth = addMonth(date, -1);
	const daysInLastMonth = getDaysInMonth(lastMonth);
	var c = daysInLastMonth - firstDay + 1;
	for (var i = 0; i < matrix.length; i++){
		for (var j = 0; j < matrix[0].length; j++){
			if (j === firstDay && i === 0)
				c = 1;
			if (c === daysInMonth + 1 && i > 3)
				c = 1;
			matrix[i][j] = c
			c++;
		}
	}
	if (matrix[matrix.length - 1][0] < 10)
		matrix.pop();
	return matrix;
}

function getDaysInMonth(anyDateInMonth) {
    return new Date(anyDateInMonth.getYear(), 
                    anyDateInMonth.getMonth()+1, 
                    0).getDate();
}

function zero2D(rows, cols) {
  var array = [], row = [];
  while (cols--) row.push(0);
  while (rows--) array.push(row.slice());
  return array;
}

function addMonth(date, increment) {
	var d = new Date(date);
	d.setMonth(d.getMonth() + increment);
	return d;
}

function addDate(date, increment) {
	var d = new Date(date);
	d.setDate(d.getDate() + increment);
	return d;
}

function addYear(date, increment) {
	var d = new Date(date);
	d.setFullYear(d.getFullYear() + increment);
	return d;
}

function getDayOfWeekOfFirstDay(date) {
	var d = new Date(date);
	d.setDate(1);
	return d.getDay()
}
