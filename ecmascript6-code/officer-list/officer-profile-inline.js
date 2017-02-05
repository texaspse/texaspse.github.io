import React from 'react'
import {WIDTH, HEIGHT} from './styles.js'
import {officerData} from './officer-data.js'

const HIGHLIGHT_COLOR = '#41D6C3'

const linkBoxStyle = {
  position: 'absolute',
  right: 10,
  bottom: 0,
  width: 100,
  display: 'flex',
  justifyContent: 'flex-end'
}

export default class InlineOfficerProfile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {officer, columns} = this.props;

    const officerSkills = <p style={{marginTop: 5, lineHeight: '0.9em'}}>
      <font size="2">
        {officer.profile.description}
      </font>
    </p>

    return <div style={{padding: 10, color: 'white', width: (columns-1)*WIDTH}}>
      <h3 style={{color: HIGHLIGHT_COLOR, fontSize: 20}}>
        {officer.profile.name + ' - ' + officer.profile.position}
      </h3>
      <p style={{marginTop: 5, lineHeight: '1em', fontSize: 16}}>
        <font>
          {officer.profile.year + ', ' + officer.profile.major}
        </font>
      </p>
      <p style={{marginTop: 5, lineHeight: '1.1em', fontSize: 14}}>
        <font>
          {officer.profile.description}
        </font>
      </p>
      <p style={{marginTop: 5, lineHeight: '1em', fontSize: 14, maxWidth: Math.floor(WIDTH*(columns-1.7))}}>
        <font size="2">
          {(!officer.profile.skills) ? '' : 'Skills: ' + officer.profile.skills}
        </font>
      </p>
      <div style={linkBoxStyle}>
        {getImageList(officer)}
      </div>
    </div>
  }
}

const faStyle = {
    marginBottom: 17
}

function getImageList(officer) {
  var list = [];
  if (officer.profile.facebookURL)
    list.push(<a href={officer.profile.facebookURL}><i style={faStyle} className="fa fa-facebook fa-lg fa-fw" aria-hidden="true"></i></a>)
  if (officer.profile.linkedinURL)
    list.push(<a href={officer.profile.linkedinURL}><i style={faStyle} className="fa fa-linkedin fa-lg fa-fw" aria-hidden="true"></i></a>)
  if (officer.profile.githubURL)
    list.push(<a href={officer.profile.githubURL}><i style={faStyle} className="fa fa-github fa-lg fa-fw" aria-hidden="true"></i></a>)
  return list;
}
