import React, { useEffect, useRef, useState } from 'react'

function View(props) {
  
    const [noteArray, setNoteArray] = useState([])
    
    const lineRef = useRef(0)
    const [lineState, setLineState] = useState(0)
    const timeoutRef = useRef()
    const justPaused = useRef(false)

    useEffect(()=>{
        
        // Create and set the array of lines to be read based on the note content
        setNoteArray(props.noteData.content.split("\n"))                 

        window.speechSynthesis.addEventListener("onend",(event)=>{
            console.log(event)
        })

    },[])
        
    function readNextLine(){
        
        // If there is no note array return
        if(!Array.isArray(noteArray))
            return

        // If the note was paused this will resume it
        if(justPaused.current){
        
            // Unpauses the paused speech synthesis
            window.speechSynthesis.resume()  
            
            // Set flat so this only happens once per resume
            justPaused.current = false              

        }
        else{
            
            // Speak the current line
            speak(noteArray[lineRef.current]).then(()=>{
                readNextLine()
            })
    
            // Increace the counter
            lineRef.current = lineRef.current + 1
            setLineState(lineRef.current - 1)
            if(lineRef.current >= noteArray.length)
                lineRef.current = 0

        }

        // // Call the function again
        // timeoutRef.current = setTimeout(() => {
        //     readNextLine()
        // }, 2000);

    }    

    async function speak(_toSpeak){
        
        // Create an utterance with the desired text
        const newUtternace = new window.SpeechSynthesisUtterance()
        //newUtternace.onend = endOfSpeechSynthesisUtteranc()
        newUtternace.text = _toSpeak        
        
        // If theres already something giong on cancel it
        window.speechSynthesis.cancel()        

        // Speak the utterance
        window.speechSynthesis.speak(newUtternace)    

        return new Promise(resolve => {
            newUtternace.onend = resolve;
          });    
    }    

    function pause(){

        // Pause the next timeout loop
        clearTimeout(timeoutRef.current)        

        // Pause the speech (with a slight delay)
        window.speechSynthesis.pause()

        // Flag so pressing start will just resume
        justPaused.current = true

    }

    function restart(){
        
        // Put the counter to the start
        lineRef.current = 0
        setLineState(0)

        // Pause what is currently being spoken
        pause()

        // Start reading from the start
        //readNextLine() user can press start again if they want it to start

    }

    function setPosition(_newPosition){
        
        // Set the position variables to the new position
        lineRef.current = _newPosition
        setLineState(_newPosition)
        
        // Cancel any lingering text
        window.speechSynthesis.cancel()
        
    }

    return (
        <div>
            <div className='noteViewTitle'>                
                {props.noteData.title}
            </div>
            <div className='buttonContainer'>
                <div onClick={()=>props.setPage("titles")}>Back</div>
                <div onClick={restart}>Restart</div>
                <div onClick={pause}>Pause</div>
                <div onClick={readNextLine}>Start</div>
            </div>
            <div className='noteLineContainer'>
                {
                    noteArray.map((noteLine, index) => (
                        <div className={'noteLine ' + (index == lineState ? "selectedLine" : "")} onClick={() => setPosition(index)}>
                            {noteLine}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default View