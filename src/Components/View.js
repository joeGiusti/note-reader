import React, { useEffect, useRef, useState } from 'react'
import {nouns} from "../Nouns.js"

function View(props) {
  
    const [noteArray, setNoteArray] = useState([])
    
    const lineRef = useRef(0)
    const [lineState, setLineState] = useState(0)
    const timeoutRef = useRef()
    const justPaused = useRef()
    const wordArray = useRef([])
    const numberArray = useRef([])
    const nounsArray = useRef([])

    useEffect(()=>{
        
        // Create and set the array of lines to be read based on the note content
        setNoteArray(props.noteData.content.split("\n"))                 

        window.speechSynthesis.addEventListener("onend",(event)=>{
            console.log(event)
        })

        nounsArray.current = nouns.split("\n")

    },[])
        
    function parseLine(_line){
        var tempLine = _line

        console.log("parsing line "+tempLine)
        console.log('tempLine.includes("<word>")'+tempLine.includes("<word>"))
        console.log('tempLine.includes("<number>")'+tempLine.includes("<number>"))
        console.log('tempLine.includes("<number26>")'+tempLine.includes("<number26>"))

        // While line contains <word> and itterations < x
        var c = 0
        while(tempLine.includes("<word>") && (c < 10)){        
            console.log("templine includes word")    
            tempLine = tempLine.replace("<word>", randomWord())            
            c++
        }
       
        tempLine = tempLine.replace("<word-0>", wordArray.current[0])
        tempLine = tempLine.replace("<word-1>", wordArray.current[1])
        tempLine = tempLine.replace("<word-2>", wordArray.current[2])
        tempLine = tempLine.replace("<word-3>", wordArray.current[3])

        // While line contains <word> and itterations < x
        c = 0
        while(tempLine.includes("<number>") && (c < 10)){            
                tempLine = tempLine.replace("<number>", randomNumber())
                console.log("placed a number")
            c++
        }
        c = 0
        while(tempLine.includes("<number26>") && (c < 10)){            
            tempLine = tempLine.replace("<number26>", randomNumber26())
            console.log("placed a number within 26")
            c++
        }
        try{tempLine = tempLine.replace("<number-0>", numberArray.current[0])}catch{}
        try{tempLine = tempLine.replace("<number-1>", numberArray.current[1])}catch{}
        try{tempLine = tempLine.replace("<number-2>", numberArray.current[2])}catch{}
        try{tempLine = tempLine.replace("<number-3>", numberArray.current[3])}catch{}                        

        console.log("parsed line: "+tempLine)

        return tempLine
    }
    function randomWord(){

        // Generate a new word
        const wordIndex = Math.floor(Math.random() * nounsArray.current.length)

        // 100 is the number of words in the array newWord = wordArray[wordIndex]
        //const newWord = "duck"
        const newWord = nounsArray.current[wordIndex]

        // Put it a register array so it can be accessed later
        //wordArray.current = [newWord, ...wordArray.current]
        wordArray.current.push(newWord)
        console.log("word array is currently: ")
        console.log(wordArray.current)

        // Return it to be used
        return newWord
    }
    function randomNumber(){
        // Generate a new random number between 1 and 100
        const newNumber = Math.floor((Math.random() * 100) + 1)

        // Put it a register array so it can be accessed later
        numberArray.current.push(newNumber)

        // Return it to be used
        return newNumber
    }
    function randomNumber26(){
        // Generate a new random number between 1 and 100
        const newNumber = Math.floor((Math.random() * 26) + 1)

        // Put it a register array so it can be accessed later
        numberArray.current.push(newNumber)

        // Return it to be used
        return newNumber
    }
    function readNextLine(){
        console.log("reading line")
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

            // Speak the current line after a pause
            speak(parseLine(noteArray[lineRef.current])).then(()=>{
                setTimeout(() => {
                    readNextLine()
                }, 2000); 
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
                <div onClick={()=>props.setPage("edit")}>Edit</div>
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