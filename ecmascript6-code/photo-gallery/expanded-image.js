import React from 'react'
import $ from 'jquery'
import RRule from 'rrule'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import moment from 'moment';
import {getSrcFromId} from './photo-gallery.js';
import Left from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import Right from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';

export const BACKGROUND_COLOR = '#1A1314'
export const HIGHLIGHT_COLOR = '#41D6C3'


export default class ExpandedImage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.setState({
      loadedMap: new Map(),
    })
  }

  componentWillUnmount() {
  }

  setLoadedState(file, done) {
    this.setState({
      loadedMap: addToMap(this.state.loadedMap, file.id, done)
    })
  }

  render() {
    const {file, close, index, folder, changeIndex} = this.props;
    console.log(this.state)
    if (!file) {
      return null;
    }

      var leftIcon = <div style={{borderRadius: 15, backgroundColor: 'rgba(20, 20, 20, 0.3)', zIndex: 10, position: 'absolute', top: Math.floor(window.innerHeight/2)-35, left: 0}}>
            <IconButton 
              onTouchTap={() => {changeIndex(-1); this.setLoadedState(folder.files[index-1], false);}}
              iconStyle={{width: 70, height: 70, fill: 'white'}} 
              style={{width: 70, height: 70, padding: 0, marginTop: 4}}>
              <Left />
            </IconButton>
      </div>

      var rightIcon = <div style={{borderRadius: 15, backgroundColor: 'rgba(20, 20, 20, 0.3)', zIndex: 10, position: 'absolute', top: Math.floor(window.innerHeight/2)-35, right: 0}}>
            <IconButton 
              onTouchTap={() => {changeIndex(1); this.setLoadedState(folder.files[index+1], false);}}
              iconStyle={{width: 70, height: 70, fill: 'white'}} 
              style={{width: 70, height: 70, padding: 0, marginTop: 4}}>
              <Right />
            </IconButton>
      </div>

      if (!canIncrement(index, 1, folder)) 
        rightIcon = null
      if (!canIncrement(index, -1, folder)) 
        leftIcon = null
      

      return <div style={{zIndex: 5, position: 'fixed', width: '100%', height: '100%', backgroundColor: 'black'}}>
        {leftIcon}
        {rightIcon}
        <Progress visible={this.state.loadedMap.get(file.id) !== true}/>
        <img 
          id={file.id}
          style={{zIndex: 5, position: 'fixed', objectFit: 'contain', width: '100%', height: '100%'}} 
          src={getSrcFromId(file.id)}
          onLoad={() => {this.setLoadedState(file, true);}}/>
      }
      </div>

    }
}
///
const Progress = ({visible}) => {
  if (visible)
    return <div style={{transform: "translate(-50%, -50%)", position: 'absolute', left: '50%', top: '50%', zIndex: 100}}>
      <CircularProgress size={isMobileDevice() ? 1 : 2}/>
    </div>
  if (!visible)
    return null
}

///
function addToMap(map, key, property) {
  const newMap = new Map(map);
  newMap.set(key, property);
  return newMap;
}

function containsFalseValue(map) {
  return [...map.values()].filter((val) => !val).length > 0;
}


function canIncrement(index, inc, folder) {
  return index + inc >= 0 && index + inc < folder.files.length
}

function isMobileDevice(){
  return window.innerWidth <= 500 || screen.width <= 480;
}



