import React from 'react'
import {List, ListItem} from 'material-ui/List';
import moment from 'moment'
import Paper from 'material-ui/Paper';
import {MAX_WIDTH_MOBILE_VIEW, BACKGROUND_COLOR, HIGHLIGHT_COLOR} from './styles.js'

export default class EventInCell extends React.Component {

  constructor(props) {
  	super(props)
  }

  render() {
  		const {event, onClick} = this.props;
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
}
