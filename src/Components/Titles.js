import React from 'react'

function Titles(props) {

  return (
    <div className='titlesContainer'>
        <div className='titleBox' onClick={(event) => props.editNote(null, event)}>
          <div className='titleBoxInner'>
            New Note
          </div>
        </div>
        {props.noteArray.map(noteData => (
          <div className='titleBox' onClick={() => props.openNote(noteData)}>
            <div className='titleBoxInner'>
              {noteData.title}              
            </div>
              <div className='editButton' onClick={(event) => props.editNote(noteData, event)}>
                Edit
              </div>
            </div>
        ) )}
    </div>
  )
}

Titles.defaultProps = {
    noteArray: [],
    openNote: (_input) => {console.log("opening note"); console.log(_input);}
}

export default Titles