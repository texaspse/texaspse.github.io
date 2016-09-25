import React from 'react'
import $ from 'jquery'
import RRule from 'rrule'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import moment from 'moment';
import {getSrcFromId} from './photo-gallery.js';

export const BACKGROUND_COLOR = '#1A1314'
export const HIGHLIGHT_COLOR = '#41D6C3'

export default class ExpandedImage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {file, close} = this.props;
    if (!file) return null;

    const actions = [
      <FlatButton
        backgroundColor = {HIGHLIGHT_COLOR}
        labelStyle = {{color:'#fff', fontSize:'18px'}}
        label="Okay"
        hoverColor={'#9CCC65'}
        primary={true}
        onTouchTap={close}/>
    ];///

      return <Dialog
          titleStyle={{color: HIGHLIGHT_COLOR}}
          actionsContainerStyle={{paddingBottom:'20px', paddingRight:'20px'}}
          actions={actions}
          modal={false}
          open={true}
          autoScrollBodyContent={true}>
            <img style={{objectFit: 'contain', width: '100%', height: '100%'}} src={getSrcFromId(file.id)}/>
        </Dialog>
    }
}