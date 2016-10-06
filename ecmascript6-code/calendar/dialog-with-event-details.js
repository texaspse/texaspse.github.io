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

    const actions = [
      <FlatButton
        backgroundColor = {HIGHLIGHT_COLOR}
        labelStyle = {{color:'#fff', fontSize:'18px'}}
        label="Got It!"
        hoverColor={'#9CCC65'}
        primary={true}
        onTouchTap={close}/>
    ];

      return <Dialog
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