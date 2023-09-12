import React, { useState, useEffect } from "react";
import io from 'socket.io-client';

import {getAccessToken, getAccessTokenContext, getBoards, createBoardAPI} from '../auth/Authentication';
import {createUser, getUserByMiroId} from '../users/Users';
import {getStickyNotes, saveStickyNotes, deleteNotesByWorkshopAPI, getFrames, getFrameNotes, summariseAPI, addSummaryAPI } from "../stickynotes/StickyNotes";
import {createTimerAPI, getTimerAPI, updateTimerAPI, addAgendaAPI, deleteAgendaAPI} from '../agenda/Agenda';
import {createWorkshopAPI, getWorkshopByNameAPI, updateWorkshopAPI} from '../workshop/Workshop';

var responseToken;
// var responseBoard;
var globalBoardID;
var timerID;
// var finalTime;
// let intervalID;
var notes;
var currentNotes;
var currentNotesLength;
var agenda = "";
var socket
var userId
var coach = false;
var connected = false;
var connectedServer = false;
var inWorkshop = false;


/*
    ******************************************************
    ******************************************************
    Admin section
    ******************************************************
    ******************************************************
*/
const getUsername = async () => {
  const result1 = await getAccessTokenContext(responseToken.data);
  global.username = result1.data.createdBy.name;
  global.miroId = result1.data.createdBy.id;

  const resultGetUser = await getUserByMiroId(global.username, global.miroId );

  if (resultGetUser.status === 200){
    if (resultGetUser.data[0].username !== undefined){
      global.userid = resultGetUser.data[0]._id
    }
  }
  else{
    if (resultGetUser.response.data.message === "No user found"){
      const resultCreateUser = await createUser(global.username, global.miroId );
      global.userid = resultCreateUser.data[0]._id
  
    }
    else if (resultGetUser.response.status === 400){
      document.getElementById("loading").innerHTML = resultGetUser.response.data.message
    }
  }

  let tempboardid = "";
  const boards = await getBoards(responseToken.data, result1.data.team.id);
  for(let i =0; i < boards.data.data.length; i++){
    if (boards.data.data[i].name === "WhiteboardDJ"){
      tempboardid = boards.data.data[i].id
    }
  }
  if (tempboardid === ""){
    const result2 = await createBoardAPI(responseToken.data, result1.data.team.id);
    tempboardid = result2.data.id
    globalBoardID = tempboardid
  }
  else{
    globalBoardID = tempboardid
  }

}

const connectMiroBoard = async () => {
    const str = window.location.href;
    const jsonCode = str.slice(str.indexOf('=') + 1,str.indexOf('&'));
  
    responseToken = await getAccessToken(jsonCode);
    if (responseToken === "Please authorize again, due to invalid authorization code from Miro!!!"){
      document.getElementById("loading").innerHTML = responseToken
    }
    else if (connected === false){
      await getUsername();
      connected = true;

      if (coach === false){
        await setTimer();
      }
      document.getElementById("loading").innerHTML = "You have successfully connected to the Miro board!"
    }

}

/*
    ******************************************************
    ******************************************************
    Sticky notes section
    ******************************************************
    ******************************************************
*/
const NoteItem = ({ noteContent }) => {
    return(
  <tr className="table__row user">
    <td  className={`table__cell ` }>{noteContent}</td>
  </tr>
)};

/*
    ******************************************************
    ******************************************************
    timer section
    ******************************************************
    ******************************************************
*/
function changeTimeFormat(durationInSeconds) {
    let remainingTime = durationInSeconds;
    let result = ""

        if (remainingTime > 3600){
            let hours = Math.floor(remainingTime / (60*60));
            let minutes = Math.floor((remainingTime - 3600 * hours)/60) ;
            let seconds = remainingTime % 60;
            if (hours < 10){
            hours = "0" + hours;
            }
            if (minutes < 10){
            minutes = "0" + minutes;
            }
            if (seconds < 10){
            seconds = "0" + seconds;
            }
            result =   hours + ":" + minutes + ":" + seconds ;
        }
        else if (remainingTime > 60){
            let hours = 0 ;
            let minutes = Math.floor(remainingTime /60);
            let seconds = remainingTime % 60;
            if (minutes === 60){
            minutes = 59
            seconds = remainingTime / 60;
            }
            if (hours < 10){
            hours = "0" + hours;
            }
            if (minutes < 10){
            minutes = "0" + minutes;
            }
            if (seconds < 10){
            seconds = "0" + seconds;
            }
            result =   hours + ":" + minutes + ":" + seconds ;
        }
        else{
            let hours = 0;
            let minutes = 0;
            let seconds = remainingTime % 60;
            if (hours < 10){
            hours = "0" + hours;
            }
            if (minutes < 10){
            minutes = "0" + minutes;
            }
            if (seconds < 10){
            seconds = "0" + seconds;
            }
            result =   hours + ":" + minutes + ":" + seconds ;
        }
        return result
}

function changeTimeFormatHourMinute(time) {
  var transformedTime = time.split(":")
  var hours = parseInt(transformedTime[0])
  var minutes = parseInt(transformedTime[1])
  var finalTime = hours*3600 + minutes*60;
  let remainingTime = finalTime;
  let result = ""

      if (remainingTime > 3600){
          let hours = Math.floor(remainingTime / (60*60));
          let minutes = Math.floor((remainingTime - 3600 * hours)/60) ;
          let seconds = remainingTime % 60;
          if (hours < 10){
          hours = "0" + hours;
          }
          if (minutes < 10){
          minutes = "0" + minutes;
          }
          if (seconds < 10){
          seconds = "0" + seconds;
          }
          result =   hours + ":" + minutes + ":" + seconds ;
      }
      else if (remainingTime > 60){
          let hours = 0 ;
          let minutes = Math.floor(remainingTime /60);
          let seconds = remainingTime % 60;
          if (minutes === 60){
          minutes = 59
          seconds = remainingTime / 60;
          }
          if (hours < 10){
          hours = "0" + hours;
          }
          if (minutes < 10){
          minutes = "0" + minutes;
          }
          if (seconds < 10){
          seconds = "0" + seconds;
          }
          result =   hours + ":" + minutes + ":" + seconds ;
      }
      else{
        let hours = 0;
        let minutes = Math.floor(remainingTime /60);
        let seconds = remainingTime % 60;
        if (hours < 10){
        hours = "0" + hours;
        }
        if (minutes < 10){
        minutes = "0" + minutes;
        }
        if (seconds < 10){
        seconds = "0" + seconds;
        }
        result =   hours + ":" + minutes + ":" + seconds ;
      }

      return result
}


const setTimer = async () => {
    let time = "Time left:"
    const timerText = await createTimerAPI(responseToken.data, globalBoardID, time );
    
    timerID = JSON.stringify(timerText.data.id);
    if (timerID.indexOf('"') !== -1){
        timerID = timerID.slice(1,timerID.length-1);
    }

    if (timerText.status === 201){
      document.getElementById("agendaError").textContent = "Timer on Miro board created successfully";
    } 
    else{
      document.getElementById("agendaError").textContent = "Timer on Miro board create failed";
    }

}

// const getTimer = async () => {
//     const timerText = await getTimerAPI(responseToken.data, responseBoard.data.id, timerID);
//     document.getElementById("timerID").textContent = JSON.stringify(timerText.data.data.content); 
// }

const updateTimer = async (timeText) => {
    const timerText = await updateTimerAPI(responseToken.data, globalBoardID, timerID, timeText);

}

/*
    ******************************************************
    ******************************************************
    Workshop section
    ******************************************************
    ******************************************************
*/
const createWorkshop = async () => {
    if (document.getElementById("workshopname").value === ""){
      document.getElementById("workshopError").innerHTML = "Please enter a workshop name"
    }
    else{
      document.getElementById("loading").textContent = "Creating workshop..."
      global.workshopname = document.getElementById("workshopname").value
      if (connected === false){
        await connectMiroBoard();
      }
      else{
        document.getElementById("loading").innerHTML = "You have successfully connected to the Miro board!"
      }

      const result2 = await createWorkshopAPI(global.userid, global.workshopname );
      
      if (result2 === "Duplicate workshopname"){
        document.getElementById("workshopError").innerHTML = "Workshop name already exists"
      }
      else{
        document.getElementById("notesSection").hidden = false
        document.getElementById("agendaSection").hidden = false
        document.getElementById("messageSection").hidden = false
        document.getElementById("collapseNotesSectionHeading").hidden = false
        document.getElementById("collapseNotesSection").hidden = false
        document.getElementById("collapseAgendaSectionHeading").hidden = false
        document.getElementById("collapseAgendaSection").hidden = false
        document.getElementById("collapseMessageSectionHeading").hidden = false
        document.getElementById("collapseMessageSection").hidden = false
        document.getElementById("wholeSummary").style.display = "none";
        document.getElementById("clusterSummary").style.display = "none";
        inWorkshop = true;
        document.getElementById("workshopError").innerHTML = "Workshop created successfully"
      }      
    }

}

const joinWorkshopAsFacilitator = async () => {
  if (document.getElementById("workshopname").value === ""){
    document.getElementById("workshopError").innerHTML = "Please enter a workshop name"
  }
  else{
    document.getElementById("loading").textContent = "Joining workshop..."
    global.workshopname = document.getElementById("workshopname").value
    const result1 = await getWorkshopByNameAPI(global.workshopname );
    if (!responseToken){
      if (connected === false){
        await connectMiroBoard();
      }
      else{
        document.getElementById("loading").innerHTML = "You have successfully connected to the Miro board!"
      }
    }
    else{
      document.getElementById("loading").innerHTML = "Please authorize again after refresh!"
    }

    const facilitatorUserId = result1.data[0].User
    const result2 = await getUserByMiroId(global.username, global.miroId );
    const loginUserId = result2.data[0]._id

    if (facilitatorUserId === loginUserId){
      document.getElementById("notesSection").hidden = false
      document.getElementById("agendaSection").hidden = false
      document.getElementById("messageSection").hidden = false
      document.getElementById("collapseNotesSectionHeading").hidden = false
      document.getElementById("collapseNotesSection").hidden = false
      document.getElementById("collapseAgendaSectionHeading").hidden = false
      document.getElementById("collapseAgendaSection").hidden = false
      document.getElementById("collapseMessageSectionHeading").hidden = false
      document.getElementById("collapseMessageSection").hidden = false
      document.getElementById("wholeSummary").style.display = "none";
      document.getElementById("clusterSummary").style.display = "none";
      inWorkshop = true;
      document.getElementById("workshopError").innerHTML = "Joined as facilitator successfully"
    }
    else{
      document.getElementById("workshopError").innerHTML = "Wrong username or miroId for facilitator"
    }
  }
}

const joinWorkshopAsCoach = async () => {
  if (document.getElementById("workshopname").value === ""){
    document.getElementById("workshopError").innerHTML = "Please enter a workshop name"
  }
  else{
    document.getElementById("loading").textContent = "Joining workshop..."
    global.workshopname = document.getElementById("workshopname").value
    const result1 = await getWorkshopByNameAPI(global.workshopname );

    if (result1 !== "No workshops found"){
      if (connected === false){
        await connectMiroBoard();
      }
      else{
        document.getElementById("loading").innerHTML = "You have successfully connected to the Miro board!"
      }
      coach = true;
      document.getElementById("notesSection").hidden = false
      document.getElementById("agendaSection").hidden = false
      document.getElementById("messageSection").hidden = false
      document.getElementsByClassName("collapseSection").hidden = false
      document.getElementById("saveNotesButton").style.display = "none";
      document.getElementById("countDownAgendaButton").style.display = "none";
      document.getElementById("pauseAgendaButton").style.display = "none";
      document.getElementById("saveAgendaButton").style.display = "none";
      document.getElementById("clearAgendaButton").style.display = "none";
      document.getElementById("deleteAgendaButton").style.display = "none";
      document.getElementById("addSessionButton").style.display = "none";
      document.getElementById("wholeSummary").style.display = "none";
      document.getElementById("clusterSummary").style.display = "none";
      document.getElementById("collapseNotesSectionHeading").hidden = false
      document.getElementById("collapseNotesSection").hidden = false
      document.getElementById("collapseAgendaSectionHeading").hidden = false
      document.getElementById("collapseAgendaSection").hidden = false
      document.getElementById("collapseMessageSectionHeading").hidden = false
      document.getElementById("collapseMessageSection").hidden = false
      inWorkshop = true;
      document.getElementById("workshopError").innerHTML = "Joined as coach successfully"
    } 
  }

}

const addNotesToWorkshop = async () => {
    global.workshopname = document.getElementById("workshopname").value
    document.getElementById("notesButtonError").innerHTML = "Saving notes..."
    
    const result1 = await getWorkshopByNameAPI(global.workshopname );
    const workshopid = result1.data[0]._id
    const deleteResult = await deleteNotesByWorkshopAPI(workshopid );

    var notesId = []
    for  (let i = 0; i < currentNotes.length; i++) {
        const result = await saveStickyNotes(workshopid, currentNotes[i].data.content );
        notesId.push(result.data._id);
    }

    const result2 = await updateWorkshopAPI(workshopid, global.userid, notesId );

    if (result2.status === 200){
      document.getElementById("notesButtonError").innerHTML = "Notes saved successfully"
    }
    else{
      document.getElementById("notesButtonError").innerHTML = "Notes save failed"
    }
}


const addAgenda = async () => {
    document.getElementById("agendaError").innerHTML = "Saving agenda..."
    const result1 = await getWorkshopByNameAPI(global.workshopname );
    const result2 = await addAgendaAPI(result1.data[0]._id, agenda );

    if (result2.status === 200){
      document.getElementById("agendaError").innerHTML = "Agenda saved successfully"
    }
    else{
      document.getElementById("agendaError").innerHTML = "Agenda save failed"
    }
}


const summarise = async () => {
    document.getElementById("notesSummaryError").innerHTML = "Summarising notes..."
    var notesText = ""

    for (let i = 0;i < currentNotesLength;i++){
        notesText = notesText + notes[i].data.content + ". "
    }

    let sensitivityScore = 10
    var sensitivity = document.getElementById("sensitivity");
    var sensitivityText = sensitivity.options[sensitivity.selectedIndex].text;

    if (sensitivityText === "Low"){
      sensitivityScore = Math.floor(currentNotesLength/6);
    }
    else if (sensitivityText === "Medium"){
      sensitivityScore = Math.floor(currentNotesLength/4);
    }
    else if (sensitivityText === "High"){
      sensitivityScore = Math.floor(currentNotesLength/2);
    }

    let frameSensitivityScore = 3

    const resultFrames = await getFrames(responseToken.data, globalBoardID );
    let summarsationText = ""
    if (resultFrames.data.total !== 0){
      for (let i = 0; i<resultFrames.data.total;i++){
        const resultFrameNotes = await getFrameNotes(responseToken.data, globalBoardID, resultFrames.data.data[i].id );
        // console.log("resultFrame Notes")
        // console.log(resultFrameNotes)
        summarsationText = summarsationText + "Cluster  " + resultFrames.data.data[i].data.title + ": \n"
        let frameSummary = ""
        if (resultFrameNotes.data.total !== 0){
          for (let j = 0; j<resultFrameNotes.data.total;j++){
            resultFrameNotes.data.data[j].data.content = resultFrameNotes.data.data[j].data.content.replace(/<\/?[^>]+(>|$)/g, '');
            frameSummary = frameSummary + resultFrameNotes.data.data[j].data.content + ". "
          }
        }//if statement for each frame's notes
        if (frameSummary !== ""){
          const resultFrameSummary = await summariseAPI(frameSummary, frameSensitivityScore );
          summarsationText = summarsationText + resultFrameSummary.data.summary + "\n\n"
        }

      }//for loop for each frame
    }
    document.getElementById("wholeSummary").style.display = "block";
    document.getElementById("clusterSummary").style.display = "block";
    document.getElementById("summarisation2").textContent =  summarsationText;

    
    const result1 = await summariseAPI(notesText, sensitivityScore );
    document.getElementById("summarisation").textContent =  result1.data.summary;

    let finalSummary = "Summary of the whole workshop: \n" + result1.data.summary + "\n\nSummary of clusters: \n" + summarsationText

    const result2 = await getWorkshopByNameAPI(global.workshopname );
    const result3 = await addSummaryAPI(result2.data[0]._id, finalSummary );

    if (result3.status === 200){
      document.getElementById("notesSummaryError").innerHTML = "Summary saved successfully"
    }
    else{
      document.getElementById("notesSummaryError").innerHTML = "Summary save failed"
    }
}













const MiroAuthorize = () => {
    /*
    ******************************************************
    ******************************************************
    Notes section
    ******************************************************
    ******************************************************
    */
    const [tableContent, setTableContent] = useState([]);

    const getNotes = async () => {
        document.getElementById("notesButtonError").innerHTML = "Loading notes..."
        
        const responseNotes = await getStickyNotes(responseToken.data, globalBoardID);
        notes = responseNotes.data.data
        for (let i =0;i<notes.length;i++){
          notes[i].data.content = notes[i].data.content.replace(/<\/?[^>]+(>|$)/g, '');
        }
        if (notes !== undefined){
            currentNotes = notes
            currentNotesLength = currentNotes.length
        }

        const newContent = notes.map(note => (
            <NoteItem key={note.id} noteContent={note.data.content} />
        ));
        setTableContent(newContent);

        document.getElementById("notesButtonError").innerHTML = "Notes loaded sucessfully"
    }


    /*
    ******************************************************
    ******************************************************
    Agenda section
    ******************************************************
    ******************************************************
    */

    const [sessions, setSessions] = useState([]);
    const [sessionName, setSessionName] = useState('');
    const [sessionTime, setSessionTime] = useState('');
    const [currentTime, setCurrentTime] = useState([]);
    const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
    const [extraTimes, setExtraTimes] = useState([]);
    const [extraTimesConfirmed, setExtraTimesConfirmed] = useState([]);
    const [extraTimeErrors, setExtraTimeErrors] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const deleteAgenda = async () => {
      document.getElementById("agendaError").innerHTML = "Deleting agenda..."
      const result1 = await getWorkshopByNameAPI(global.workshopname );
      const result2 = await deleteAgendaAPI(result1.data[0]._id );

      if (result2.status === 200){
        document.getElementById("agendaError").innerHTML = "Agenda deleted successfully"
      }
      else{
        document.getElementById("agendaError").innerHTML = "Agenda delete failed"
      }
    }


    const getAgenda = async () => {
      const result1 = await getWorkshopByNameAPI(global.workshopname );
      if (result1.data[0].workshopAgenda !== ""){
        document.getElementById("agendaError").innerHTML = "Getting agenda..."
        const lines = result1.data[0].workshopAgenda.trim().split('\n');
  
        const sessionData = lines.map(line => {
          const [sessionName, sessionTime] = line.trim().split(/\s+/);
          return { name: sessionName, time: sessionTime };
        });
        setSessions(sessionData);
        const initialCurrentTime = sessionData.map(session => session.time);
        setCurrentTime(initialCurrentTime);

        document.getElementById("agendaError").innerHTML = "Retrieved agenda successfully"
      }
      else{
        document.getElementById("agendaError").innerHTML = "No agenda found for the current workshop"
      }
    }

    function isValidTimeFormat(time) {
      const parts = time.split(':'); // Split the input by colon
      // Ensure there are exactly two parts
      if (parts.length !== 2) {
        return false;
      }
    
      const hours = parseInt(parts[0]); // Parse the hours part as an integer
      const minutes = parseInt(parts[1]); // Parse the minutes part as an integer
    
      // Check if hours and minutes are valid numbers
      if (isNaN(hours) || isNaN(minutes)) {
        return false;
      }
      return true;
    }
  
    const handleAddSession = () => {
      if (isValidTimeFormat(sessionTime)){
        if (sessionName && sessionTime) {
          var transformedTime = changeTimeFormatHourMinute(sessionTime+":00")
          
          const newSession = { name: sessionName, time: transformedTime };
          setSessions([...sessions, newSession]);
          setCurrentTime([...currentTime, transformedTime]);
          setSessionName('');
          setSessionTime('');
          setShowTable(false);
          document.getElementById("sessionError").innerHTML = "Session added successfully "
        }
      }
      else{
        document.getElementById("sessionError").innerHTML = "Please enter a session time in the given format"
      }

    };
  
    // const handleTimeChange = (index, newTime) => {
    //   const updatedSessions = sessions.map((session, i) =>
    //     i === index ? { ...session, time: newTime } : session
    //   );
    //   setSessions(updatedSessions);
    // };
  
    const handleDeleteSession = index => {
      const updatedSessions = sessions.filter((session, i) => i !== index);
      setSessions(updatedSessions);
  
      const updatedCurrentTime = currentTime.filter((time, i) => i !== index);
      setCurrentTime(updatedCurrentTime);
  
      const updatedExtraTimes = extraTimes.filter((extraTime, i) => i !== index);
      setExtraTimes(updatedExtraTimes);

      const filteredRecipients = selectedRecipients.filter(user => user !== global.username);
      socket.emit('sendRunnigAgenda', {
        isRunning: false,
        sessions: [],
        currentTime: [],
        currentTimeIndex: 0,
        recipients: filteredRecipients
      });
    };
  
    const handleUpdateSession = index => {

      if (!extraTimes[index]) {
        const newErrors = [...extraTimeErrors];
        newErrors[index] = 'Please enter a value';
        setExtraTimeErrors(newErrors);
        return; // Stop execution if there's an error
      } 
      else if ( isNaN(parseInt(extraTimes[index])) ){
        const newErrors = [...extraTimeErrors];
        newErrors[index] = 'Please enter a valid number';
        setExtraTimeErrors(newErrors);
        return; // Stop execution if there's an error
      }
      else {
        const newErrors = [...extraTimeErrors];
        newErrors[index] = ''; // Clear the error message
        setExtraTimeErrors(newErrors);
        setExtraTimesConfirmed(extraTimes)

        const updatedSessions = sessions.map((session, i) => {
            var hours = parseInt(session.time.split(":")[0])
            var minutes = parseInt(session.time.split(":")[1])
            minutes = minutes + parseInt(extraTimes[index])
            if (minutes > 60){
              hours = hours + Math.floor(minutes / 60)
              minutes = minutes % 60
            }
            var newTimeText = `${hours}` + ":" + `${minutes}` + ":00"
            var newTime = changeTimeFormatHourMinute(newTimeText)

            if (i === index){
              return { ...session, time: newTime };
            }
            else{
              return session
            }
          }
        );
        setSessions(updatedSessions);

        const newExtraTimes = [...extraTimes];
        newExtraTimes[index] = ''; // Clear the value
        setExtraTimes(newExtraTimes);

        const newUpdatedErrors = [...extraTimeErrors];
        newUpdatedErrors[index] = 'Updated!'; // Clear the error message
        setExtraTimeErrors(newUpdatedErrors);
      }    
    }


    const handleReduceSession = (index) => {
      if (!extraTimes[index]) {
        const newErrors = [...extraTimeErrors];
        newErrors[index] = 'Please enter a value';
        setExtraTimeErrors(newErrors);
        return; 
      } 
      else if (isNaN(parseInt(extraTimes[index]))) {
        const newErrors = [...extraTimeErrors];
        newErrors[index] = 'Please enter a valid number';
        setExtraTimeErrors(newErrors);
        return; 
      } 
      else {
        const newErrors = [...extraTimeErrors];
        newErrors[index] = ''; 
        setExtraTimeErrors(newErrors);

        const reductionAmount = parseInt(extraTimes[index]);
        const updatedSessions = sessions.map((session, i) => {
          if (i === index) {
            var hours = parseInt(session.time.split(':')[0]);
            var minutes = parseInt(session.time.split(':')[1]);
            var seconds = parseInt(session.time.split(':')[2]);
            if ( (minutes - reductionAmount) < 0) {
              if ( (hours + Math.floor((minutes - reductionAmount) / 60)) < 0 ){
                hours = 0;
                minutes = 0;
                seconds = 0;
              }
              else{
                hours = hours + Math.floor( (minutes - reductionAmount) / 60);
                minutes = ( (minutes - reductionAmount) % 60 + 60) % 60;
              }
 
            }
            else{
              minutes = minutes - reductionAmount;
            }
            var newTimeText = `${hours}`.padStart(2, '0') + ':' + `${minutes}`.padStart(2, '0') + ':00';
            var newTime = changeTimeFormatHourMinute(newTimeText);
            return { ...session, time: newTime };
          } else {
            return session;
          }
        });

        const updatedCurrentTimes = [...currentTime];
        if (currentSessionIndex === index && isRunning) {
          // Extract current hours and minutes from currentTime[index]
          let currentHours = parseInt(updatedCurrentTimes[index].split(':')[0]);
          let currentMinutes = parseInt(updatedCurrentTimes[index].split(':')[1]);
          let currentSeconds = parseInt(updatedCurrentTimes[index].split(':')[2]);
          
          if ( (currentMinutes - reductionAmount) < 0) {
            if ( (currentHours + Math.floor((currentMinutes - reductionAmount) / 60)) < 0 ){
              currentHours = 0;
              currentMinutes = 0;
              currentSeconds = 0;
            }
            else{
              currentHours = currentHours + Math.floor( (currentMinutes - reductionAmount) / 60);
              currentMinutes = ( (currentMinutes - reductionAmount) % 60 + 60) % 60;
            }
          }
          else{
            currentMinutes -= reductionAmount;
          }
          updatedCurrentTimes[index] = `${currentHours}`.padStart(2, '0') + ':' + `${currentMinutes}`.padStart(2, '0') + ':' + `${currentSeconds}`.padStart(2, '0');
        }

        setSessions(updatedSessions);
        setCurrentTime(updatedCurrentTimes);

        const newExtraTimes = [...extraTimes];
        newExtraTimes[index] = '';
        setExtraTimes(newExtraTimes);

        const newUpdatedErrors = [...extraTimeErrors];
        newUpdatedErrors[index] = 'Updated!';
        setExtraTimeErrors(newUpdatedErrors);
      }
    };

    
  
    const handleClearAgenda = () => {
      setSessions([]);
      setCurrentTime([]);
      setIsRunning(false);

      const filteredRecipients = selectedRecipients.filter(user => user !== global.username);
      socket.emit('sendRunnigAgenda', {
        isRunning: false,
        sessions: [],
        currentTime: [],
        currentTimeIndex: 0,
        recipients: filteredRecipients
      });

      document.getElementById("agendaError").innerHTML = "Agenda cleared successfully"
    };

    const handleDeleteAgenda = () => {
      setSessions([]);
      setCurrentTime([]);
      setIsRunning(false);

      const filteredRecipients = selectedRecipients.filter(user => user !== global.username);
      socket.emit('sendRunnigAgenda', {
        isRunning: false,
        sessions: [],
        currentTime: [],
        currentTimeIndex: 0,
        recipients: filteredRecipients
      });

      deleteAgenda();
      document.getElementById("agendaError").innerHTML = "Agenda deleted successfully"
    };
  
    const handleSaveAgenda = () => {
      const updatedSessions = sessions.map((session) => {
        agenda = agenda + session.name + " " + session.time + '\n'
      });
      addAgenda();
    };
  
    const addSession = () => {
      setShowTable(true);
    }

    const handleGetAgenda = () => {
      getAgenda();
    }

    const handlePause = () => {
      setIsRunning(false);
      document.getElementById("sessionError").textContent = "Count down has paused"

      const filteredRecipients = selectedRecipients.filter(user => user !== global.username);
      socket.emit('sendRunnigAgenda', {
        isRunning: false,
        sessions: sessions,
        currentTime: currentTime,
        currentTimeIndex: currentTimeIndex,
        recipients: filteredRecipients
      });

    };

    const handleCountingDown = () => {
      if (!isRunning) {
        setIsRunning(true);
        setCurrentTimeIndex(0);
        document.getElementById("sessionError").textContent = "Count down has started"
      }
    };
    
    /*
    ******************************************************
    ******************************************************
    Message section
    ******************************************************
    ******************************************************
    */
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [usersInRoom, setUsersInRoom] = useState([]);

    const connectToServer = () => {
      userId = global.username;
      socket = io.connect('https://whiteboarddj-server.onrender.com', {
        query:  {userId},
        transports: ['websocket'] 
      }); // Adjust the URL to your server's URL

      if (socket){
        document.getElementById("messageError").textContent = "You are connected to the server successfully"
      }
      else{
        document.getElementById("messageError").textContent = "You failed connecting to the server"
      }
      socket.on('receiveMessage', (message) => {
        setReceivedMessages(prevMessages => [...prevMessages, message]);
      });


      socket.on('receiveRunningAgenda', (data) => {
        setIsRunning(data.isRunning);
        setSessions(data.sessions);
        setCurrentTime(data.currentTime);
        setCurrentTimeIndex(data.currentTimeIndex);
      });

      let selectedUsers = [];
      socket.on('userList', (userList) => {
        // Update dropdown menu with the new user list
        const dropdown = document.getElementById('userDropdown');
        dropdown.innerHTML = ''; // Clear existing options

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select users...';
        dropdown.appendChild(defaultOption);

        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'Select All';
        dropdown.appendChild(allOption);

        setUsersInRoom(userList);
        const previouslySelected = Array.from(document.querySelectorAll('#userDropdown option:checked')).map(option => option.value);
      
        userList.forEach((user) => {
          const option = document.createElement('option');
          option.value = user;
          option.textContent = user;
          if (previouslySelected.includes(user)) {
            option.selected = true; // Preserve selected options
            selectedUsers.push(user);
          }
          dropdown.appendChild(option);
        });
      });

      socket.on('disconnect', () => {
        document.getElementById("messageError").textContent = "Disconnected from the server";
        // Handle any additional UI or logic upon disconnection
      });
      
    }
  
    const sendMessage = () => {
      // let sentRecipients = ""
  
      const data = {
        message: message + " (from " + global.username + ")",
        recipients: selectedRecipients
      };
      socket.emit('sendMessage', data);
      setReceivedMessages(prevMessages => [...prevMessages, message + " (sent to " + selectedRecipients + ")"]);
      document.getElementById("messageSent").textContent = "Message sent successfully";
      setMessage("");
    };


    const handleCreateWorkshopAndConnect = async () => {
      await createWorkshop();
      if (connectedServer === false){
        connectToServer();
        connectedServer = true;
      }
    };
    
    const handleJoinWorkshopFacilitatorAndConnect = async () => {
      await joinWorkshopAsFacilitator();
      if (connectedServer === false){
        connectToServer();
        connectedServer = true;
      }
    };
    
    const handleJoinWorkshopCoachAndConnect = async () => {
      await joinWorkshopAsCoach();
      if (connectedServer === false){
        connectToServer();
        connectedServer = true;
      }
    };

  
    const handleRecipientChange = (event) => {
      const selectedOptions = Array.from(event.target.selectedOptions).map(
        (option) => option.value
      );

      if (selectedOptions.includes("all")) {
        const filteredRecipients = usersInRoom.filter(user => user !== global.username);
        setSelectedRecipients(filteredRecipients);
      } else {
        setSelectedRecipients(selectedOptions);
      }
    };

    useEffect(() => {
      setSelectedRecipients(usersInRoom);
    }, [usersInRoom]);

    useEffect(() => {
      if (isRunning) {
        setCurrentSessionIndex(currentTimeIndex);
      }
    }, [isRunning, currentTimeIndex]);


    useEffect(() => {
      let timerId;
    
      if (isRunning && currentTimeIndex < currentTime.length && coach === false) {
        let [hours, minutes, seconds] = currentTime[currentTimeIndex].split(":");
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        seconds = parseInt(seconds);
    
        timerId = setInterval(() => {
          if (seconds > 0) {
            seconds--;
          } else {
            if (minutes > 0) {
              minutes--;
              seconds = 59;
            } else {
              if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
              }
            }
          }

          if (extraTimesConfirmed[currentTimeIndex]) {
            const extraMinutes = parseInt(extraTimesConfirmed[currentTimeIndex]);
            minutes = minutes + extraMinutes;
            if (minutes < 0) {
              hours = hours - Math.floor(-minutes / 60);
              minutes = (minutes % 60 + 60) % 60; // Ensure minutes are positive
            }
            else{
              hours += Math.floor(minutes / 60);
              minutes %= 60;
            }
            extraTimesConfirmed[currentTimeIndex] = undefined;
          }
    
          const newTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
          setCurrentTime(prevCurrentTime => {
            const updatedCurrentTime = [...prevCurrentTime];
            updatedCurrentTime[currentTimeIndex] = newTime;
    
            if (hours === 0 && minutes === 0 && seconds === 0) {
              clearInterval(timerId);
              if (currentTimeIndex < currentTime.length - 1) {
                setCurrentTimeIndex(currentTimeIndex + 1);
              }
            }
            
            return updatedCurrentTime;
          });
          
          updateTimer("Time left: " + newTime);

          const filteredRecipients = selectedRecipients.filter(user => user !== global.username);

          const data = {
            isRunning: isRunning,
            sessions: sessions,
            currentTime: currentTime,
            currentTimeIndex: currentTimeIndex,
            recipients: filteredRecipients
          };
          socket.emit('sendRunnigAgenda', data);

          document.getElementById("sessionTotalTime").textContent = "Total remaining time: " + changeTimeFormat(calculateTotalTime());
        }, 1000);
      }
      else if (isRunning && currentTimeIndex < currentTime.length && coach === true) {
        let [hours, minutes, seconds] = currentTime[currentTimeIndex].split(":");
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        seconds = parseInt(seconds);
    
        timerId = setInterval(() => {
          if (seconds > 0) {
            seconds--;
          } else {
            if (minutes > 0) {
              minutes--;
              seconds = 59;
            } else {
              if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
              }
            }
          }

          if (extraTimesConfirmed[currentTimeIndex]) {
            const extraMinutes = parseInt(extraTimesConfirmed[currentTimeIndex]);
            minutes = minutes + extraMinutes;
            if (minutes < 0) {
              hours = hours - Math.floor(-minutes / 60);
              minutes = (minutes % 60 + 60) % 60; // Ensure minutes are positive
            }
            else{
              hours += Math.floor(minutes / 60);
              minutes %= 60;
            }
            extraTimesConfirmed[currentTimeIndex] = undefined;
          }
    
          const newTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
          setCurrentTime(prevCurrentTime => {
            const updatedCurrentTime = [...prevCurrentTime];
            updatedCurrentTime[currentTimeIndex] = newTime;
    
            if (hours === 0 && minutes === 0 && seconds === 0) {
              clearInterval(timerId);
              if (currentTimeIndex < currentTime.length - 1) {
                setCurrentTimeIndex(currentTimeIndex + 1);
              }
            }
            
            return updatedCurrentTime;
          });

          document.getElementById("sessionTotalTime").textContent = "Total remaining time: " + changeTimeFormat(calculateTotalTime());
        }, 1000);
      }
    
      return () => {
        clearInterval(timerId);
      };
    }, [isRunning, currentTimeIndex, currentTime]);

    const calculateTotalTime = () => {
      let [currentHours, currentMinutes, currentSeconds] = currentTime[currentTimeIndex].split(":").map(Number);
      let totalTime = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

      // Add the session times
      sessions.forEach((session, index) => {
        if (currentTimeIndex !== index){
          const [hours, minutes, seconds] = session.time.split(':').map(Number);
          totalTime += hours * 3600 + minutes * 60 + seconds;
        }
      });

      return totalTime;
    };



  const [notesSectionCollapsed, setNotesSectionCollapsed] = useState(true); // Initially, notesSection is collapsed
  const [agendaSectionCollapsed, setAgendaSectionCollapsed] = useState(true); // Initially, agendaSection is collapsed
  const [messageSectionCollapsed, setMessageSectionCollapsed] = useState(true); // Initially, messageSection is collapsed

  // Function to toggle the collapsed state of the notes section
  const toggleNotesSection = () => {
    setNotesSectionCollapsed(!notesSectionCollapsed);
  };

  // Function to toggle the collapsed state of the agenda section
  const toggleAgendaSection = () => {
    setAgendaSectionCollapsed(!agendaSectionCollapsed);
  };

  // Function to toggle the collapsed state of the message section
  const toggleMessageSection = () => {
    setMessageSectionCollapsed(!messageSectionCollapsed);
  };

    
    

    let content = (
        <section>
            <div class="section" >
              <h1 className="sectionHeading">Please authorize again if any unexpected behaviour occurs</h1>
              <h3 class="errorMessage" id="loading"></h3>
            </div>


            <div id="workshopSection" class="section" >
              <h1 className="sectionHeading">Create or join a workshop:</h1>
              <p class="errorMessage" id="workshopError"></p>
              <br></br>
              <label>Workshop name:</label>
              <br></br>
              <input type="text" id="workshopname" required minLength="2" size="20" />
              <br></br>
              <button class="button-orange" onClick={() => {handleCreateWorkshopAndConnect();}} disabled={inWorkshop}>Create a  workshop</button>
              <br></br>
              <button class="button-orange" onClick={() => {handleJoinWorkshopFacilitatorAndConnect();}} disabled={inWorkshop}>Join a workshop as facilitator</button>
              <button class="button-orange" onClick={() => {handleJoinWorkshopCoachAndConnect();}} disabled={inWorkshop}>Join a workshop as coach</button>
              <br></br>
              <br></br>
            </div>




            <h1 id="collapseNotesSectionHeading" className="sectionHeading" hidden>Participants' Sticky Notes: </h1>
            <p id="collapseNotesSection" className="collapse" onClick={toggleNotesSection} hidden>(expand/collapse section)</p>
            <div id="notesSection"  class="section"  hidden={notesSectionCollapsed}>
              <button class="button-orange" onClick={getNotes} >Get Participants Notes</button>
              <button class="button-orange" onClick={addNotesToWorkshop} id="saveNotesButton">Save sticky notes to workshop</button>
              <p class="errorMessage" id="notesButtonError"></p>
              <table className="table_workshop table--users">
                  <thead className="table__thead">
                  <tr>
                      <th scope="col" className="table__th user__username">Notes:</th>
                  </tr>
                  </thead>
                  <tbody>
                      {tableContent}
                  </tbody>
              </table>
              <br></br>
              <br></br>
              <div id="summaryCoach">
                <label className="sectionHeading">Summary</label>
                <br></br>
                <label>Sensitivity for the summarisation: </label>
                <select id="sensitivity">
                  <option value="lowSensitivity">Low</option>
                  <option value="mediumSensitivity">Medium</option>
                  <option value="highSensitivity">High</option>
                </select>
                <br></br>
                <button class="button-orange" onClick={summarise} id="summariseNotesButton">Summarise the notes</button>
                <br></br>
                <p class="errorMessage" id="notesSummaryError"></p>
                <br></br>
                <label id="wholeSummary" className="sectionHeading">Summary of the whole workshop:</label>
                <p id="summarisation" style={{ whiteSpace: 'pre-line' }}></p>
                <br></br>
                <label id="clusterSummary" className="sectionHeading">Summary of clusters: (after clustering on Miro board)</label>
                <p id="summarisation2" style={{ whiteSpace: 'pre-line' }}></p>
                <br></br>
                <br></br>
              </div>
              <br></br>
              <br></br>
            </div>





            <h1 id="collapseAgendaSectionHeading" className="sectionHeading" hidden>Workshop Agenda:</h1>
            <p id="collapseAgendaSection" className="collapse" onClick={toggleAgendaSection} hidden>(expand/collapse section)</p>
            <div id="agendaSection" class="section"  hidden={agendaSectionCollapsed}>
              <table className="table_agenda ">
                <thead className="table__thead">
                  <tr>
                    <th scope="col" className="table__th ">Session Name</th>
                    <th scope="col" className="table__th ">Session Time</th>
                    <th scope="col" className="table__th ">Current Time Left</th>
                    <th scope="col" className="table__th ">Chanege Time(Minutes)</th>
                    <th scope="col" className="table__th ">Action</th>
        
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => (
                    <tr key={index}
                    >
                      <td className={currentSessionIndex === index && isRunning ? 'runningSession' : 'table__cell'}  >{session.name}</td>
                      <td className={currentSessionIndex === index && isRunning ? 'runningSession' : 'table__cell'}>{session.time}</td>
                      <td className={currentSessionIndex === index && isRunning ? 'runningSession' : 'table__cell'}>{currentTime[index]}</td>
                      <td className={currentSessionIndex === index && isRunning ? 'runningSession' : 'table__cell'}>
                        <input
                          type="text"
                          value={extraTimes[index]}
                          placeholder="00"
                          minLength="1"
                          maxLength="5"
                          size="5"
                          onChange={e => {
                            const newExtraTimes = [...extraTimes];
                            newExtraTimes[index] = e.target.value;
                            setExtraTimes(newExtraTimes);
                          }}
                          disabled={coach}
                        />
                        <button disabled={coach} onClick={() => handleUpdateSession(index)}>Add</button>
                        <button disabled={coach} onClick={() => handleReduceSession(index)}>Reduce</button>
                        <p >{extraTimeErrors[index]}</p>
                      </td>
                      <td className={currentSessionIndex === index && isRunning ? 'runningSession' : 'table__cell'}>
                        <button disabled={coach} onClick={() => handleDeleteSession(index)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div>
                <button id="addSessionButton" class="button-orange" onClick={addSession}>+</button>
                <br></br>
                {showTable && (
                <table id="addSessionTable" className="table_session " hidden>
                <thead className="table__thead">
                  <tr>
                    <th scope="col" className="table__th ">Session Name</th>
                    <th scope="col" className="table__th ">Session Time (hour:min)</th>
                    <th scope="col" className="table__th ">Action</th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                      <td className={`table__cell `}>
                        <input
                          id="addSessionName"
                          type="text"
                          placeholder="Session Name"
                          value={sessionName}
                          onChange={e => setSessionName(e.target.value)} 
                        />
                      </td>
                      <td  className={`table__cell `}>
                        <input
                          id="addSessionTime"
                          type="text"
                          placeholder="00:00"
                          value={sessionTime}
                          onChange={e => setSessionTime(e.target.value)} 
                        />
                      </td>
                      <td className={`table__cell `}>
                      <button onClick={handleAddSession}>Add Session</button>
                      </td>
                    </tr>
                  
                  </tbody>
                </table>
                )}
                <br></br>
                <p class="sectionHeading" id="sessionTotalTime" >Total remaining time: </p>
                <br></br>
                <p class="errorMessage" id="sessionError"></p>
                <button id="countDownAgendaButton" class="button-orange" onClick={handleCountingDown} >Start Count Down!</button>
                <button id="pauseAgendaButton" class="button-orange" onClick={handlePause} >Pause!</button>
                <p class="errorMessage" id="agendaError"></p>
                <button class="button-orange" onClick={handleGetAgenda}>Retrieve Agenda</button>
                <button id="saveAgendaButton" class="button-orange" onClick={handleSaveAgenda}>Save Agenda</button>
                <button id="clearAgendaButton" class="button-orange" onClick={handleClearAgenda}>Clear Current Agenda</button>
                <button id="deleteAgendaButton" class="button-orange" onClick={handleDeleteAgenda}>Delete Agenda</button>

              </div>
              <br></br>
              <br></br>
            </div>




            <h1 id="collapseMessageSectionHeading" className="sectionHeading" hidden>Message: </h1>
            <p id="collapseMessageSection" className="collapse" onClick={toggleMessageSection} hidden>(expand/collapse section)</p>
            <div id="messageSection" class="section" hidden={messageSectionCollapsed}>
              <label class="errorMessage" id="messageError"></label>
              <br></br>
              <br></br>
              <label className="sectionHeading">(Your username is {global.username})</label>
              <br></br>
              <label>Send a Message to selected recipients:</label>
              <select
                id="userDropdown"
                value={selectedRecipients}
                multiple
                onChange={handleRecipientChange}
              >
                <option value="all">Select All</option> 
              </select>


              <br></br>
              <input
                id="inputMessage"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onfocus={() => (document.getElementById("messageSent").textContent = "")}
              />
              <button class="button-orange" onClick={sendMessage}>Send</button>
              <br></br>
              <label class="errorMessage" id="messageSent"></label>

              <br></br>
              <label className="sectionHeading">Chat History:</label>
              <br></br>
              <ul>
                {receivedMessages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>

        </section>
    )
    return content
}

export default MiroAuthorize
