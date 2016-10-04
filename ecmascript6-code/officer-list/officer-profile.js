import React from 'react'
import $ from 'jquery'
import RRule from 'rrule'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import moment from 'moment'
import {WIDTH, HEIGHT} from './styles.js'

export const BACKGROUND_COLOR = '#1A1314'
export const HIGHLIGHT_COLOR = '#41D6C3'

export default class OfficerProfile extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {officer, close,} = this.props;
    if (!officer) return null;

    const actions = [
      <FlatButton
        backgroundColor = {HIGHLIGHT_COLOR}
        labelStyle = {{color:'#fff', fontSize:'18px'}}
        label="Got It!"
        hoverColor={'#9CCC65'}
        primary={true}
        onTouchTap={close}/>
    ];///

      return <Dialog
          titleStyle={{color: HIGHLIGHT_COLOR}}
          actionsContainerStyle={{paddingBottom:'20px', paddingRight:'20px'}}
          title={officer.profile.name + ' - ' + officer.profile.position}
          actions={actions}
          modal={false}
          open={true}
          autoScrollBodyContent={true}>

          <div style={{color:'white', textAlign: 'left'}}>
            <p style={{marginTop: 5, lineHeight: '1em', textAlign: 'left'}}><font size="3">{officer.profile.year + ', ' + officer.profile.major}</font></p>
            <p style={{marginTop: 5, lineHeight: '0.9em', textAlign: 'left'}}><font size="2">{officer.profile.description}</font></p>
            <p style={{marginTop: 5, lineHeight: '0.9em', textAlign: 'left'}}><font size="2">{(!officer.profile.skills) ? '' : 'Skills: ' + officer.profile.skills}</font></p>
          </div>
        </Dialog>
    }
}