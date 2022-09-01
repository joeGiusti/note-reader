import React from 'react'
import { useRef } from 'react'

function Edit(props) {

    var titleInput = useRef()
    var contentInput = useRef()

    function saveAndClose(){

        // save and close
        props.saveNote({
            key: props.noteData.key,
            title: titleInput.current.value,
            content: contentInput.current.value,
        })
        props.setPage("titles")

    }
    function revert(){
        
        titleInput.value = props.noteData.title
        contentInput.value = props.noteData.content

    }

  return (
    <div className='edit'>        
        <input defaultValue={props.noteData.title} ref={titleInput}></input>
        <textarea defaultValue={props.noteData.content} ref={contentInput}></textarea>
        <div className='buttonContainer'>
            <div className='button' onClick={() => props.deleteNote(props.noteData)} >Delete</div>
            <div className='button' onClick={revert}>Revert</div>
            <div className='button' onClick={() => props.setPage("titles")}>Cancel</div>
            <div className='button' onClick={saveAndClose}>Save and Close</div>
        </div>
    </div>
  )
}

Edit.defaultProps = {
    noteData: {
        key: null,
        title: "Default Title",
        content: "Default Content",
    },
    delete: (_input) => {console.log("delete function"); console.log(_input);},     
    save: (_input) => {console.log("save function"); console.log(_input);},
    setPage: (_input) => {console.log("set page"); console.log(_input);},
}

export default Edit