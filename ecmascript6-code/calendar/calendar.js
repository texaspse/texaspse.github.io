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
import CalendarInstruction from './calendar-instructions.js'
import DialogShowingEventDetails from './dialog-with-event-details.js'
import EventInCell from './event-box-in-cell.js'
import {MAX_WIDTH_MOBILE_VIEW, BACKGROUND_COLOR, HIGHLIGHT_COLOR} from './styles.js'




export default class Calendar extends React.Component 
{
	constructor(props){

		super(props);
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

        // $.getJSON('https://apsi.mlab.com/api/1/databases/test_12345/collections/mynewcollection?apiKey=vELwcWICM9CTv0ZgsaXVOIUvOc4qNAE0', function(result) {
        // 	console.log('got result')
        // 	console.log(result)
        // 	alert(JSON.stringify(result))
        // })


        
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
			date: now(),
			result: null,
			dialogEvent: null,
			mobileView: isMobileDevice(),
			extendedEventDesc: new Map(),
			typeOfCalendarInstruction: null,
			calendarPopoverInstructionPopoverOpen: false,})
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

	handlePopoverTouchTap(event){
		event.preventDefault();
		this.setState({
			calendarPopoverInstructionPopoverOpen: true,
			anchorEl: event.currentTarget,
		})
	};

    handleRequestClose(){
	    this.setState({
	      calendarPopoverInstructionPopoverOpen: false,
	    });
  	};


	render() 
	{
		if (this.state.mobileView === false) {
			
			const columnFlexBox = {display: 'flex', justifyContent: 'space-around', flexDirection: 'column', margin: 25,};
			const events = getEventObjectsFromResult(this.state.result, this.state.date);
			const width = this.state.width;
			const height = this.state.height;
			const matrix = makeMonthMatrix(this.state.date);

			return (
				<div style={{color: 'white', backgroundColor: BACKGROUND_COLOR, width: '100%', padding: 10, maxHeight: 2000, overflowY: 'auto'}}>
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
							const cellHeight = Math.floor(window.innerHeight / 9)
							return (
								<div style={{display: 'flex', width: '100%', minHeight: cellHeight,}}>
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
										const backgroundColor = sameDates(now(), dateOfCell) ? '#404040' : BACKGROUND_COLOR
										const cellBorder = getBorderFromCell(matrix, dayIndex, rowIndex, dateOfCell);
										return <div style={{...cellBorder, width: (100/7)+'%', backgroundColor}}>
											<div style={{position: 'relative', width: '100%', height: '100%', paddingTop: 25}}>
												{
													[1].map((x) => {
														if (eventsInCell.length > -1) return <p style={{color: numberColor, position: 'absolute', top: 0, right: 5}}>{day}</p>
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
		          onTouchTap={(event) => {this.handlePopoverTouchTap(event)}}
		          label="SUBSCRIBE TO THIS CALENDAR"
		        />
		        <Popover
				  open={this.state.calendarPopoverInstructionPopoverOpen}
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
		else if (this.state.mobileView === true) {
			const currentDate = now();
			const events = getEventObjectsFromResult(this.state.result, this.state.date);
			const ALLOWED_TIME_AFTER_CURRENT_DATE = 7 * 24 * 3600 * 1000;

			const upcomingEvents = events.filter((event) => {
				const dateDifference = event.endDate - currentDate;
				return dateDifference >= 0 && dateDifference <= ALLOWED_TIME_AFTER_CURRENT_DATE
			}).sort((a, b) => {
				return a.startDate - b.startDate;
			})
			const LEFT_MARGIN = 10
			const paperStyle = {width: 800, padding: 10};
			const centerFlexbox = {display: 'flex', justifyContent: 'space-around', margin: 30};
			const leftFlexbox = {display: 'flex', justifyContent: 'flex-start', margin: LEFT_MARGIN};
			const title = upcomingEvents.length > 0 ? 'Upcoming Events' : 'No Upcoming Events This Week';
			const margin = 40; 
			return <div style={{width: '100%'}}>
				<DialogShowingEventDetails event={this.state.dialogEvent} close={() => {this.setDialogEvent(null)}}/>
				<div style={centerFlexbox}><h2>{title}</h2></div> 
				{
					upcomingEvents.map((event) => {
						const key = event.id + event.startDate.getDate()
						console.log({key, state:this.state})

						const bStyle = {color: 'white'}
						const isExpanded = this.state.extendedEventDesc.get(key) === true
						const location = event.location ? <p><b style={bStyle}>{'Location: '}</b>{event.location}</p> : <div></div>
						const description = isExpanded ? <p><b style={bStyle}>{'Description: '}</b>{(event.description || 'None Available')}</p> : <div></div>


						return <div style={centerFlexbox}>
							<Paper style={paperStyle} zDepth={3}>
								<div style={leftFlexbox}><h3 style={{color: HIGHLIGHT_COLOR, marginBottom: 10}}>{event.eventName}</h3></div>

								<div style={{marginLeft: LEFT_MARGIN}}>
						          	<p><b style={bStyle}>{'Date: '}</b>{moment(event.startDate).format('dddd, MMMM Do YYYY')}</p>
						          	<p><b style={bStyle}>{'Time: '}</b>{moment(event.startDate).format('h:mm') + ' - ' + moment(event.endDate).format('h:mm a')}</p>
						          	{location}
						          	{description}
					          	</div>
					          	<div style={{display: 'flex', justifyContent: 'flex-end'}}>
					          	<RaisedButton style={{marginLeft:'10px'}} backgroundColor = {HIGHLIGHT_COLOR} labelStyle = {{color:'#fff', fontSize:'16px'}} hoverColor={'#9CCC65'} label={isExpanded ? "Less" : "More"} onTouchTap={()=>{this.toggleExtendedEventDesc(key)}}/>
								</div>

							</Paper>
						</div>
					})
				}
			</div>
		}
	}
}

function isMobileDevice(){
	return window.innerWidth <= MAX_WIDTH_MOBILE_VIEW || screen.width <= 480;
}

function getBorderFromCell(matrix, dayIndex, rowIndex, cellDate) {
	const cellBorder = sameDates(now(), cellDate) ? '1px solid ' + HIGHLIGHT_COLOR : '1px solid grey';
	if (sameDates(now(), cellDate)) {
		return {borderLeft: cellBorder, borderTop: cellBorder, borderRight: cellBorder, borderBottom: cellBorder}
	}
	var style = {borderLeft: cellBorder, borderTop: cellBorder};
	if (dayIndex === matrix[0].length - 1)
		style = {...style, borderRight: cellBorder}
	if (rowIndex === matrix.length - 1)
		style = {...style, borderBottom: cellBorder}
	if (now().getMonth() === cellDate.getMonth()) {
		if (sameDates(now(), addDate(cellDate, -1)) && dayIndex !== 0)
			style={...style, borderLeft: '0px solid grey'}
		if (sameDates(now(), addDate(cellDate, -7)))
			style={...style, borderTop: '0px solid grey'}
		if (sameDates(now(), addDate(cellDate, 1)) && dayIndex !== 6)
			style={...style, borderRight: '0px solid grey'}
		if (sameDates(now(), addDate(cellDate, 7)))
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
    console.log({rule: item.recurrence[0], dates})
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

function now() {
	return new Date()
}
