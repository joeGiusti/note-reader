import { useEffect, useRef, useState } from 'react';
import './App.css';
import Edit from './Components/Edit';
import Titles from './Components/Titles';
import { initializeApp } from 'firebase/app'
import { getDatabase, set, update, ref, push, onValue } from 'firebase/database'
import View from './Components/View';

/*

5:55 

planning
5:58 (3 minutes)

nap
6:05 (8 minutes)

create components
6:22 (17min)

import components
6:23 (1 minute)

display components based on clicks
6:31 (8 minutes)

style components
6:45 (14 minutes)

phone call
cuddled ash
found phone charge
walked maggie

7:05 (20 minutes)

save new note
7:15 (10 minutes)

load and display notes
7:22 (7 minutes)

open note when clicked
7:26 (4 minutes)

save existing note
7:27 (1 minutes)

delete a note
7:28 (1 minute)

total time:
1:30 - (25 miutes of break) = 1:05

*/

function App() {

  const [page, setPage] = useState("titles")

  const [noteData, setNoteData] = useState(null)
  const [noteArray, setNoteArray] = useState([])

  const dbRef = useRef()

  useEffect(() => {
    firebaseSetup()
    loadNotes()
  }, [])

  function firebaseSetup(){
    var firebaseConfig = {
        apiKey: "AIzaSyDCrQSCE91lh7GYlr7eTFbX--e1NnvF7Uw",
        authDomain: "practice-79227.firebaseapp.com",
        databaseURL: "https://practice-79227-default-rtdb.firebaseio.com",
        projectId: "practice-79227",
        storageBucket: "practice-79227.appspot.com",
        messagingSenderId: "283438782315",
        appId: "1:283438782315:web:d913f1ed9d87b5401a1e2e"     
    }
    var app = initializeApp(firebaseConfig)
    dbRef.current = getDatabase(app)
  }

  function loadNotes(){
    onValue(ref(dbRef.current, "noteApp/notes/"), snap => {
      console.log("note load value:")
      console.log(snap.val())
      var tempArray = []
      for(var index in snap.val()){
        var tempNoteData = snap.val()[index]
        
        tempArray.push({
          key: index,
          title: tempNoteData.title,
          content: tempNoteData.content,
        })
      }
      setNoteArray(tempArray)
    })
  }

  function openNote(_noteData){
    
    if(!_noteData)
      return
        
    setNoteData(_noteData)

    setPage("view")

  }
  function editNote(_noteData, _event){

    _event.stopPropagation()

    if(!_noteData)
      setNoteData({
        key: null,
        title: "New Note",
        content: ""
      })
    else
      setNoteData(_noteData)

      setPage("edit")
  }
  
  function saveNote(_noteData){    
    console.log("saving note in App.js")
    console.log(_noteData)
    if(_noteData.key)
      updateNote(_noteData)
    else
      saveNewNote(_noteData)
  }
  function saveNewNote(_noteData){
    console.log("saving new note")
    var newRef = push(ref(dbRef.current, "noteApp/notes/"))
    set(newRef, _noteData)
  }
  function updateNote(_noteData){
    set(ref(dbRef.current, "noteApp/notes/" + _noteData.key), _noteData)
  }
  function deleteNote(_noteData){
    set(ref(dbRef.current, "noteApp/notes/" + _noteData.key), null)
    setPage("titles")
  }

  function displayPage(){
    if(page == "edit")
        return (        
          <Edit
            saveNote={saveNote}
            deleteNote={deleteNote}
            noteData={noteData}
            setPage={setPage}
          ></Edit>
        );
    if(page == "titles")
      return (        
        <Titles
          openNote={openNote}
          noteArray={noteArray}
          setPage={setPage}
          editNote={editNote}
        ></Titles>
      );
    if(page == "view")
      return (        
        <View
          setPage={setPage}
          noteData={noteData}
        ></View>
      );
  }

  return (
    <div className="App">
      {displayPage()}
    </div>
  );
}

export default App;
