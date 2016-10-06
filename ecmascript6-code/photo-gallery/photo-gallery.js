import React from 'react'
import moment from 'moment'
import $ from 'jquery'
import Paper from 'material-ui/Paper';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import ExpandedImage from './expanded-image.js'
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/Hardware/keyboard-backspace';
import AppBar from 'material-ui/AppBar';

const allowedFileTypes = ['image/jpeg', 'image/png']
const rootFolderId = '0B_0R926dGCfPRkl3WGFNZWtObkk';

export const BACKGROUND_COLOR = '#1A1314'
export const HIGHLIGHT_COLOR = '#41D6C3'

const DEFAULT_MENU_VALUE = 'All Events'
const PADDING = 50
const MIN_WIDTH = 350;

const folders = []
function getFolders(folderId, folder, self) {
	var api_key = 'AIzaSyBGtwEr1lhOjsCE4Et33KDV6aTyj3fb6hI';
	var url = "https://www.googleapis.com/drive/v3/files?q='" + folderId + "'+in+parents&key=" + api_key;
	$.getJSON( url, function( data, status){
	    var files = []
	    for (var i = 0; i < data.files.length; i++) {
	    	var file = data.files[i];
	    	if (file.mimeType === 'application/vnd.google-apps.folder') {
	    		getFolders(file.id, file, self);
	    	}
	    	else {
	    		file.folderName = folder.name;
	    		files.push(file)
	    	}
	    }

	    folder.files = files;
	    folders.push(folder)
	    self.setState({
	    	folders: folders
	    })
	}).done(function( data ){
	    console.log('done')
	}).fail(function(){
		console.log('fail')
	});
}

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: 'black',
    padding: 50,
  },
  gridList: {
    width: 500,
    overflowY: 'auto',
    marginBottom: 24,
  },
};


export default class PhotoGallery extends React.Component {
	constructor(props) {
		super(props)
		console.log('constructed')
		const self = this;
		this.handleResize = this.handleResize.bind(this);
        var rootFolder = {id: rootFolderId, kind: "drive#file", mimeType: "application/vnd.google-apps.folder", name: 'root'}
        getFolders(rootFolderId, rootFolder, self);
	}

	componentWillMount() {
		window.addEventListener('resize', this.handleResize);
		this.setState({
			folders: [],
			expandedImage: null,
			expandedImageIndex: null,
			dropdownMenuValue: DEFAULT_MENU_VALUE,
			width: window.innerWidth,
			height: window.innerHeight,
			hoverMap: new Map(),
			folder: null,
		})
	}

	backIconClicked() {
		if (this.state.expandedImage) {
			this.setImageExpanded(null, null);
		}
		else if (this.state.folder) {
			this.setFolder(null);
		}
		else if (!this.state.folder) {
			goto('index.html')
		}
	}

	incrementImageIndex(inc) {
		if (!this.state.folder) {
			console.error('folder does not exist');
			return;
		}
		const files = [...this.state.folder.files];
		const index = this.state.expandedImageIndex;
		const newIndex = index + inc;
		if (newIndex < 0 || newIndex >= files.length){
			console.error('index out of bounds');
			return;
		}
		const newFile = files[newIndex];
		this.setState({
			expandedImage: newFile,
			expandedImageIndex: newIndex,
		})
	}

	setFolder(folder) {
		this.setState({
			folder: folder,
		})
	}

	setHoverState(src, isMouseInside) {
	    const newMap = new Map(this.state.hoverMap);
	    newMap.set(src, isMouseInside);
	    this.setState({
	      	hoverMap: newMap,
	    })
	}

	setImageExpanded(file, index) {
		this.setState({
			expandedImage: file,
			expandedImageIndex: index,
		})
	}

	setDropdownMenuValue(value) {
		this.setState({
			dropdownMenuValue: value,
		})
	}

	handleResize(event) {
		console.log('resize')
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight,
		})
	}

	render() {
		console.log(this.state)
		var foldersCopy = [...this.state.folders]
		const columns = getColumns()
		const size = this.state.width / columns

		foldersCopy.forEach((folder) => {
			folder.files.forEach((file) => {
				if (file.folderName === undefined)
					file.folderName = folder.name;
			})
			if (folder.date === undefined)
				folder.date = getDateFromName(folder.name)
			if (folder.nameWithoutDate === undefined)
					folder.nameWithoutDate = removeDateFromName(folder.name)


		})

		foldersCopy.sort((a,b) => (b.date - a.date));

		const folderNames = [DEFAULT_MENU_VALUE].concat(foldersCopy
			.filter(folder => folder.files.length > 0)
			.map(folder => folder.name))

		if (this.state.dropdownMenuValue !== DEFAULT_MENU_VALUE) {
			foldersCopy = foldersCopy.filter((folder) => folder.name === this.state.dropdownMenuValue);
		}

		foldersCopy = foldersCopy.filter(folder => folder.files.length > 0)

		const titleTextSize = (this.state.folder && this.state.width < 500) ? 16 : 24

		var dropDownMenu = <DropDownMenu 
			        value={this.state.dropdownMenuValue} 
			        onChange={(event, index, value) => {this.setDropdownMenuValue(value);}}
			        style={{minWidth: 200}}>
			    {
		        	folderNames.map((name) => {
		        		return <MenuItem value={name} primaryText={name}/>
		        	})///
		        }
	       		</DropDownMenu>
	    ///
	    if (this.state.width < 500 || this.state.folder)
	    	dropDownMenu = null



		return  <div>
			<ExpandedImage 
				index={this.state.expandedImageIndex}
				file={this.state.expandedImage} 
				folder={this.state.folder}
				close={() => {this.setImageExpanded(null, null);}}
				changeIndex={(inc) => {this.incrementImageIndex(inc);}}/>
		      <AppBar
		      	style={{marginBottom: 16, backgroundColor: HIGHLIGHT_COLOR, position: 'fixed', top: 0, left: 0}}
			    title={<span>{getTitleFromState(this.state)}</span>}
			    titleStyle={{color: 'white', fontSize: titleTextSize}}
			    iconElementLeft={///
			    	<IconButton 
			    		onTouchTap={() => {this.backIconClicked()}}
			    		iconStyle={{width: 50, height: 50, fill: 'rgb(179, 66, 244)'}} 
			    		style={{width: 50, height: 50, padding: 0,}}>
			    		<NavigationClose />
			    	</IconButton>
			    }
			    children={dropDownMenu}/>
		    <div style={{width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: 64}}>
		    {
		    	[0].map((x) => {
		    		if (!this.state.folder) {
			    		return <GridList
					      cols={columns}
					      cellHeight={size}
					      style={{...styles.gridList, width: this.state.width - PADDING}}>
					      {
					      	foldersCopy.map((folder) => {
						      	const firstFile = folder.files[0];
						      	const firstFileSrc = getSrcFromId(firstFile.id)
						      	const isMouseInside = this.state.hoverMap.get(firstFileSrc) === true;
						        return <GridTile
						          onMouseMove={()=>{if (!isMouseInside) this.setHoverState(firstFileSrc, true)}}
			              		  onMouseLeave={()=>{this.setHoverState(firstFileSrc, false)}}
			              		  onTouchTap={() => {this.setFolder(folder)}}
						          key={firstFile.id}
						          title={folder.nameWithoutDate}
						          style={{cursor: 'pointer'}}
								  titleBackground={isMouseInside ? 'rgba(0,0,0,0.5)' : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)'}
						          subtitle={<span><b>{folder.files.length + ' Images (' + (folder.date ? moment(folder.date).format('MMMM Do') : 'No Date') + ')'}</b></span>}>
						          <img src={firstFileSrc} />
						        </GridTile>
					     	})
					  	}
					    </GridList>
		    		}
		    		else {///
		    			const unscrollable = (this.state.expandedImage !== null) 
		    			const files = [...this.state.folder.files];///
		    			return <GridList
					      cols={columns}
					      cellHeight={size}
					      style={{...styles.gridList, width: this.state.width - PADDING, height: unscrollable ? '0px' : 'auto' }}>
					      {
					      	files.map((file, index) => {
					      		const fileSrc = getSrcFromId(file.id)
						      	const isMouseInside = this.state.hoverMap.get(fileSrc) === true;
						        return <GridTile
						          onMouseMove={()=>{if (!isMouseInside) this.setHoverState(fileSrc, true);}}
			              		  onMouseLeave={()=>{this.setHoverState(fileSrc, false);}}
			              		  onTouchTap={()=>{this.setImageExpanded(file, index);}}
						          key={file.id}
						          title={file.name}
						          style={{cursor: 'pointer'}}
								  titleBackground={isMouseInside ? 'rgba(0,0,0,0.5)' : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)'}>
						          <img src={fileSrc} />
						        </GridTile>
					     	})
					  	}
					    </GridList>
		    		}
		    	})
		    }
			</div>
	  	</div>
	}
}///

export function goto(src) {
	var a = document.createElement('a');
	a.href = src;
	document.body.appendChild(a);
	a.click()
}

function getColumns(){
	return Math.ceil(window.innerWidth / MIN_WIDTH);
}

export function getSrcFromId(id) {
	return 'https://docs.google.com/uc?id=' + id;
}

function removeDateFromName(name) {
	const firstString = name.split(' ')[0];
	if (isNaN(moment(firstString).toDate().getTime()))
		return name;
	else
		return name.split(' ').filter((s,i)=>i>0).join(' ');
}

function getDateFromName(name) {
	const firstString = name.split(' ')[0];
	const date = moment(firstString).toDate()
	if (isNaN(date.getTime()))
		return null;
	else
		return date;
}

function getTitleFromState(state){
	var titleStr = 'error';
    if (state.expandedImage) {
		titleStr = state.expandedImage.name
	}
	else if (state.folder) {
		titleStr = state.folder.nameWithoutDate
	}
	else if (!state.folder) {
		titleStr = 'Photo Gallery'
	}
	return titleStr
}








