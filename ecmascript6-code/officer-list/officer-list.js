import React from 'react'
import {List, ListItem} from 'material-ui/List';
import moment from 'moment'
import Paper from 'material-ui/Paper';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import OfficerProfile from './officer-profile.js'
import {officerData} from './officer-data.js'
import {WIDTH, HEIGHT} from './styles.js'
import InlineOfficerProfile from './officer-profile-inline.js'


export default class OfficerList extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize(event) {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      columns: getColumnCount(),
      expandedMap: getColumnCount() < 3 ? new Map() : this.state.expandedMap}) //remove expansions if less than 3 columns
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleResize);
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      officerProfileShown: null,
      expandedMap: new Map(),
      columns: getColumnCount(),
      hoverMap: new Map()})
  }

  setHoverState(src, isMouseInside) {
    const newMap = new Map(this.state.hoverMap);
    newMap.set(src, isMouseInside);
    this.setState({
      hoverMap: newMap,
    })
  }

  setDialogSrc(officer) {
    this.setState({
      officerProfileShown: officer,
    })
  }

  toggleExpanded(src) {
    const newMap = new Map(this.state.expandedMap);
    const isExpanded = !(newMap.get(src) === true);
    [...newMap.keys()].forEach((key) => {newMap.set(key, false);}) //un-expand everything
    newMap.set(src, isExpanded)
    this.setState({
      expandedMap: newMap,
    })
  }

  render() {
    
    const width = this.state.width;
    const columns = this.state.columns;

    const matrix = getOfficerMatrixFromList(officerData, columns, this.state.expandedMap);
    const styles = {
      root: {
        width: WIDTH*columns,
        height: HEIGHT*matrix.length,
        position: 'relative',
      },
    };

    return <div>
      <OfficerProfile officer={this.state.officerProfileShown} close={()=>{this.setDialogSrc(null)}} />

        <div style={{margin: 20, display: 'flex', justifyContent: 'space-around', width: '100%'}}>
          <h2>Meet our officers!</h2>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
          <div style={styles.root}>
          {
            getGridListFromMatrix(matrix, columns, this.state.expandedMap, (src) => {
              if (this.state.columns > 2)
                this.toggleExpanded(src);
              else
                this.setDialogSrc(getOfficerFromSrc(src, officerData));
            }, this.state.hoverMap, (src, isMouseInside) => {
              if (this.state.hoverMap.get(src) !== isMouseInside)
                this.setHoverState(src, isMouseInside);
            })
          }      
          </div>
        </div>
    </div>
  }
}///

function getGridListFromMatrix(matrix, columns, expandedMap, onTapFunction, hoverMap, onHoverFunction) {
  const list = [];
  matrix.forEach((row, rowIndex) => {
    row.forEach((tile, columnIndex) => {
      const isExpanded = expandedMap.get(tile.src) === true
      const isMouseInside = hoverMap.get(tile.src) === true

      const inlineProfileStyle = {
        transitionProperty: 'width,height,top,left',
        zIndex: isExpanded ? 2 : 1, 
        transitionDuration: '0.5s', 
        border: '1px solid black', 
        overflow: 'hidden', 
        position: 'absolute', 
        left: WIDTH*(columnIndex+1), 
        top: HEIGHT*rowIndex, 
        width: isExpanded ? (columns-1)*WIDTH : 0, 
        height: HEIGHT, 
        backgroundColor: '#4d4d4d'
      }

      const gridStyle = {
        transitionProperty: 'width,height,top,left', 
        zIndex: isExpanded ? 2 : 1, border: '1px solid black', 
        transitionDuration: '0.5s', display: 'initial', 
        position: 'absolute', 
        cursor: 'pointer', 
        top: HEIGHT*rowIndex, 
        left: WIDTH*columnIndex, 
        width: WIDTH, 
        height: HEIGHT, 
        backgroundColor: 'white'
      }

      list.push(
        <div key={tile.src}>
          <div style={inlineProfileStyle}>
            <InlineOfficerProfile officer={tile} columns={columns}/>
          </div>
          <GridTile
              cols={null}
              rows={null}
              onMouseMove={()=>{if (!isExpanded) onHoverFunction(tile.src, true)}}
              onMouseLeave={()=>{onHoverFunction(tile.src, false)}}
              onTouchTap={() => {onTapFunction(tile.src); onHoverFunction(tile.src, false)}}
              titleBackground={isMouseInside ? 'rgba(0,0,0,0.5)' : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)'}
              title={tile.title}
              style={gridStyle}
              subtitle={<span><b style={{color: 'white'}}>{tile.subtitle}</b></span>}>
              <img src={tile.src} />
          </GridTile>
        </div>
      )
    })
  })///
  
  list.sort((a, b) => { //so the images are always in the same order in the list to make transitions work
    if (a.key < b.key) return -1;
    else if (a.key > b.key) return 1;
    else return 0;
  })

  return list;
}

//Algorithm to make the matrix of officers
function getOfficerMatrixFromList(list_, columns, expandedMap) {
  const list = [...list_]; //makes copy
  const matrix = [];
  var index = 0;

  while(index < list.length) {
    var expandedIndex = null;
    for (var i = index; i < Math.min(index + columns, list.length); i++) {
      if (expandedMap.get(list[i].src) === true) {
        expandedIndex = i;
        break;
      }
    }

    if (expandedIndex !== null) {
      matrix.push([list[expandedIndex]])
      list.splice(expandedIndex, 1)
    }
    else {
      var l = [];
      for (var i = index; i < Math.min(index + columns, list.length); i++) {
        l.push(list[i])
      }
      matrix.push(l)
      index += l.length
    }
  }
  return matrix;
}

function getColumnCount(){
  const w = window.innerWidth;
  if (w > (WIDTH*4) * 1.5)
    return 4;
  if (w > (WIDTH*3) * 1.1)
    return 3;
  if (w > (WIDTH*2) * 1.1)
    return 2;
  return 1;
}

function getOfficerFromSrc(src, officers) {
  for (var i = 0; i < officers.length; i++) {
    if (officers[i].src === src)
      return officers[i];
  }
  return null;
}


