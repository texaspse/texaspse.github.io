import React from 'react'
import moment from 'moment'
import $ from 'jquery'
import Paper from 'material-ui/Paper';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ExpandedImage from './expanded-image.js'

const allowedFileTypes = ['image/jpeg', 'image/png']
const rootFolderId = '0B20EILHyOSfYaEFLckQ4WHNKNEU';



const folders = []
function getFolders(folderId, folder, self) {
	var api_key = 'AIzaSyBGtwEr1lhOjsCE4Et33KDV6aTyj3fb6hI';
	var url = "https://www.googleapis.com/drive/v3/files?q='" + folderId + "'+in+parents&key=" + api_key;
	$.getJSON( url, function( data, status){
		console.log('successfully got folder contents')

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
	    console.log(folders)
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
    height: 500,
    overflowY: 'auto',
    marginBottom: 24,
  },
};


export default class PhotoGallery extends React.Component {
	constructor(props) {
		super(props)
		console.log('constructed')
		const self = this;
        var rootFolder = {id: rootFolderId, kind: "drive#file", mimeType: "application/vnd.google-apps.folder", name: 'root'}
        getFolders(rootFolderId, rootFolder, self);
	}

	componentWillMount() {
		this.setState({
			folders: [],
			expandedImage: null,
		})
	}

	setImageExpanded(file) {
		this.setState({
			expandedImage: file,
		})
	}

	render() {

		this.state.folders.forEach((folder) => {
			folder.files.forEach((file) => {
				file.folderName = folder.name;
			})
		})

		return  <div>
			<ExpandedImage file={this.state.expandedImage} close={() => {this.setImageExpanded(null);}}/>
		    { 
		    	this.state.folders.map((folder) => {
		    		const header = (folder.files.length > 0) ? <h1 style={{color: 'white'}}>{folder.name}</h1> : null;
		    		return <div>
		    			<div style={{display: 'flex', justifyContent: 'space-around'}}>
		    				{header}
		    			</div>
		    			<div style={styles.root}>
		    			{///
				    		folder.files.map((file) => ( 
					        <GridTile
						        style={{width: 200, height: 200, cursor: 'pointer', margin: 15}}
						        onTouchTap={() => {this.setImageExpanded(file);}}
						        key={file.id}
						        title={file.name}>
					        	<img src={getSrcFromId(file.id)} />
					        </GridTile>))
		    			}
		    			</div>
		    		</div>
		    	})
		  	}
	  	</div>
	}
}
///
export function getSrcFromId(id) {
	return 'https://docs.google.com/uc?id=' + id;
}










