import React from 'react'
import $ from 'jquery'
import RRule from 'rrule'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import moment from 'moment'
import {render} from 'react-dom';
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';

const MAX_WIDTH_MOBILE_VIEW = 750;
const BACKGROUND_COLOR = '#231F20'

export default class Calendar extends React.Component 
{
	constructor(){
		super();
		const self = this;
		this.handleResize = this.handleResize.bind(this);

		var calendarID = 'p2s62j1glcm2of7co1qoumio84@group.calendar.google.com';
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
    	mobileView: isMobileDevice(),})
    window.addEventListener('resize', this.handleResize);
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

	render() 
	{
		const DialogShowingEventDetails = ({event, close}) => {
			if (!event) return <div></div>;

			const actions = [
		      <FlatButton
		        label="Got It"
		        primary={true}
		        onTouchTap={close}
		      />,];

		    return <div>
		        <Dialog
		          title={event.eventName}
		          actions={actions}
		          modal={false}
		          open={true}>
		          <div>
		          	<p>{'Date: ' + moment(event.startDate).format('MMMM Do YYYY')}</p>
		          	<p>{'Time: ' + moment(event.startDate).format('h:mm') + ' - ' + moment(event.endDate).format('h:mm a')}</p>
		          	<p>{'Location: ' + (event.location || '')}</p>
		          	<p>{'Description: ' + (event.description || '')}</p>
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
					<div style={{display: 'flex', justifyContent: 'space-between', width: '100%',}}>
						<div style={columnFlexBox}>
							<RaisedButton label={moment(addMonth(this.state.date, -1)).format('MMMM')} onTouchTap={() => {this.incrementMonth(-1)}}/>
						</div>
						<div style={columnFlexBox}>
							<h2>{moment(this.state.date).format('MMMM, YYYY')}</h2>
						</div>
						<div style={columnFlexBox}>
							<RaisedButton label={moment(addMonth(this.state.date, 1)).format('MMMM')} onTouchTap={() => {this.incrementMonth(1)}}/>
						</div>
					</div>
					<div style={{display: 'flex', justifyContent: 'space-around', width: '100%', height: 40, color: 'inherit'}}>
						{
							['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w) => {return <p>{w}</p>})
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
										const numberColor = monthOfCell === this.state.date.getMonth() ? 'white' : '#d9d9d9';
										const dateOfCell = new Date(this.state.date);
										dateOfCell.setDate(day);
										dateOfCell.setMonth(monthOfCell);
										const eventsInCell = events.filter((event) => {
											return sameDates(event.startDate, dateOfCell);
										})
										const backgroundColor = sameDates(new Date(), dateOfCell) ? '#cce6ff' : 'grey'
										return <div style={{width: (100/7)+'%', border: '1px solid white', backgroundColor}}>
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
				</div>
			);
		}
		else {
			const currentDate = new Date();
			const events = getEventObjectsFromResult(this.state.result, this.state.date);
			const ALLOWED_TIME_AFTER_CURRENT_DATE = 500 * 24 * 3600 * 1000;
			const upcomingEvents = events.filter((event) => {
				const dateDifference = event.endDate - currentDate;
				return dateDifference >= 0 && dateDifference <= ALLOWED_TIME_AFTER_CURRENT_DATE
			})
			const paperStyle = {width: 800, padding: 10};
			const centerFlexbox = {display: 'flex', justifyContent: 'space-around', margin: 30}
			return <div style={{width: '100%'}}>
				<DialogShowingEventDetails event={this.state.dialogEvent} close={() => {this.setDialogEvent(null)}}/>
				<div style={centerFlexbox}><h1>Upcoming Events</h1></div> 
				{
					upcomingEvents.map((event) => {

						const location = event.location ? <p>{'Location: ' + event.location}</p> : <div></div>
						//const description = event.description ? <p>{'Description: ' + event.description}</p> : <div></div>

						return <div style={centerFlexbox}>
							<Paper style={paperStyle} zDepth={3}>
								<div style={centerFlexbox}><b>{event.eventName}</b></div>
					          	<p>{'Date: ' + moment(event.startDate).format('MMMM Do YYYY')}</p>
					          	<p>{'Time: ' + moment(event.startDate).format('h:mm') + ' - ' + moment(event.endDate).format('h:mm a')}</p>
					          	{location}
					          	<RaisedButton label="More" onTouchTap={()=>{this.setDialogEvent(event)}}/>
							</Paper>
						</div>
					})
				}
			</div>
		}

	}
}

const EventInCell = ({event, onClick}) => {
	const divStyle = {display: 'auto', padding: 5}
	const style = {margin: 5}
	var name = <b><div style={divStyle}>{'No Name'}</div></b>
	if (event.eventName)
		name = <b><div style={divStyle}>{event.eventName}</div></b>
	else if (event.description)
		name = <b><div style={divStyle}>event.description</div></b>
	
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
	var rule = RRule.fromString(item.recurrence[0].replace('RRULE:', ''))
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
