import React from 'react'
import $ from 'jquery'
import RRule from 'rrule'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import moment from 'moment'
import {MAX_WIDTH_MOBILE_VIEW, BACKGROUND_COLOR, HIGHLIGHT_COLOR} from './styles.js'

export default class DialogShowingEventDetails extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {event, close} = this.props;
    if (!event) return <div></div>;
///
    const action1 = <FlatButton
        backgroundColor = {HIGHLIGHT_COLOR}
        labelStyle = {{color:'#fff', fontSize:'18px'}}
        label="Okay"
        style={{margin: 5}}
        hoverColor={'#9CCC65'}
        primary={true}
        onTouchTap={close}/>
///
    const action2 = <FlatButton
        backgroundColor = {HIGHLIGHT_COLOR}
        labelStyle = {{color:'#fff', fontSize:'18px'}}
        label="RSVP"
        style={{margin: 5}}
        hoverColor={'#9CCC65'}
        primary={true}
        onTouchTap={() => {goto(event.extraData.RSVP)}}/>
///
    const actions = [action1, event.extraData.RSVP ? action2 : null];

      return <Dialog
          autoScrollBodyContent={true}
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
    }
}



export function goto(src) {
  var a = document.createElement('a');
  a.href = src;
  document.body.appendChild(a);
  a.click()
}