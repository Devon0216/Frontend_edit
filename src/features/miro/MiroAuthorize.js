import axios from "axios";
import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from 'react-router-dom'
import io from 'socket.io-client';

// import {createUser} from '../users/Users';
import { getStickyNotes } from "../stickynotes/StickyNotes";

var responseToken;
var responseBoard;
var globalBoardID;
var timerID;
var finalTime;
let intervalID;
var notes;
var currentNotes;
var currentNotesLength;
var agenda = "";
// var sessionNumber = -1;
var socket
var userId
var coach = false;

// var intervalIds = [];
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
const getAccessToken = async (code) => {
  const options = {
      'method': 'POST',
      'url': `https://whiteboarddj-server.onrender.com/auth`,
      'headers': {
        'Content-Type': 'application/json'
      },
      data: {
        code: code
      }
  };
  
  try {
      const result = await axios(options);
      console.log("hi")
      console.log(result);
      return result;
    } catch (e) {
        console.log(e);
        return JSON.parse(e.request.responseText).message
    }
}

const getAccessTokenContext = async (access_token) => {

  const options = {
    'method': 'GET',
    'url': `https://api.miro.com/v1/oauth-token`,
    'headers': {
      'Authorization': `Bearer ${access_token}`,
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    data: {

    }
  };

  try {
    const result = await axios(options);
    return result;
  } catch (e) {
      return e;
  }
}

const getBoards = async (access_token, teamId) => {
const options = {
  'method': 'GET',
  'url': `https://api.miro.com/v2/boards?team_id=${teamId}`,
  'headers': {
    'Authorization': `Bearer ${access_token}`,
    'accept': 'application/json',
    'content-type': 'application/json'
  },
  data: {

  }
};

try {
  const result = await axios(options);
  return result;
} catch (e) {
     console.log("e.response.data");
     console.log(e.response.data);
     return e;
}
}

// const getBoardID = async (access_token, boardId) => {
//   const options = {
//       'method': 'GET',
//       'url': `https://api.miro.com/v2/boards/${boardId}`,
//       'headers': {
//           'Authorization': `Bearer ${access_token}`
//       },
//       data: {
        
//       }
//   };
  
//   try {
//       const result = await axios(options);
//       console.log(result);
//       return result;
//     } catch (e) {
//          console.log(e);
//          return e;
//     }
// }

const createBoardAPI = async (access_token, teamId) => {
  const options = {
      'method': 'POST',
      'url': `https://api.miro.com/v2/boards`,
      'headers': {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      data: {
        "teamId": `${teamId}`,
        "name": "WhiteboardDJ"
      }
  };
  
  try {
      const result = await axios(options);
      return result;
    } catch (e) {
        console.log(e);
        return JSON.parse(e.request.responseText).message
    }
}



const login = async () => {
  const loginUsername = document.getElementById("username").value
  const loginPassword = document.getElementById("password").value

  const result1 = await getUserByMiroId(loginUsername, loginPassword );
  
  if (result1.data[0].username !== undefined){
    const loginUserName = result1.data[0].username
    console.log("loginUserName")
    console.log(loginUserName)

    global.username = loginUserName
    global.password = loginPassword
    global.userid = result1.data[0]._id
    document.getElementById("workshopSection").hidden = false
    document.getElementById("loginError").textContent = "You have successfully logged in!"
  }
  else{
    document.getElementById("loginError").textContent = "You have entered wrong username or password"
  }
}

const createUser = async (username, miroId) => {
  const options = {
      'method': 'POST',
      'url': `https://whiteboarddj-server.onrender.com/users`,
      'headers': {
        'Content-Type': 'application/json'
      },
      data: {
        username: `${username}`,
        miroId: `${miroId}`
      }
  };
  
  try {
      const result = await axios(options);
      console.log("create user result")
      console.log(result);
      return result;
    } catch (e) {
        console.log(e);
        return JSON.parse(e.request.responseText).message
    }
}

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
// const getStickyNotes = async (access_token, boardID) => {
//     const options = {
//         'method': 'GET',
//         'url': `https://api.miro.com/v2/boards/${boardID}/items?limit=50&type=sticky_note`,
//         'headers': {
//             'Authorization': `Bearer ${access_token}`
//         },
//         data: {
          
//         }
//     };
    
//     try {
//         const result = await axios(options);
//         console.log(result);
        
//         return result;
//       } catch (e) {
//            console.log(e);
//       }
// }
       
const NoteItem = ({ noteContent }) => {
    return(
  <tr className="table__row user">
    <td  className={`table__cell ` }>{noteContent}</td>
  </tr>
)};



const saveStickyNotes = async (workshop, content) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/notes`,
        'headers': {
          'Content-Type': 'application/json'
        },
        data: {
          workshop: workshop,
          content: content
        }
    };
    
    try {
        const result = await axios(options);
        return result;
      } catch (e) {
           console.log(e);
      }
}

const deleteNotesByWorkshopAPI = async (workshop) => {
    const options = {
        'method': 'DELETE',
        'url': `https://whiteboarddj-server.onrender.com/notes/workshopNotes`,
        'headers': {
          'Content-Type': 'application/json'
        },
        data: {
          workshop: workshop,
        }
    };
    
    try {
        const result = await axios(options);
        return result;
      } catch (e) {
           console.log(e);
      }
}


const getFrames = async (access_token, boardID) => {
  const options = {
      'method': 'GET',
      'url': `https://api.miro.com/v2/boards/${boardID}/items?limit=50&type=frame`,
      'headers': {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      data: {
      }
  };
  
  try {
      const result = await axios(options);
      console.log(result);
      
      return result;
    } catch (e) {
         console.log(e);
    }
}


const getFrameNotes = async (access_token, boardID, frameId) => {
  const options = {
      'method': 'GET',
      'url': `https://api.miro.com/v2/boards/${boardID}/items?parent_item_id=${frameId}`,
      'headers': {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      data: {
        
      }
  };
  
  try {
      const result = await axios(options);
      console.log(result);
      
      return result;
    } catch (e) {
         console.log(e);
    }
}

/*
    ******************************************************
    ******************************************************
    timer section
    ******************************************************
    ******************************************************
*/
function startCountdown(durationInSeconds) {
    let remainingTime = durationInSeconds;
    clearInterval(intervalID);
  
    intervalID = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(intervalID); // Clear the interval when countdown is done
        document.getElementById("timer").innerHTML = "Timer expired"
      } else {
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
          document.getElementById("timer").innerHTML =  "Time left: " + hours + ":" + minutes + ":" + seconds ;
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
          document.getElementById("timer").innerHTML =  "Time left: " + hours + ":" + minutes + ":" + seconds ;
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
          document.getElementById("timer").innerHTML =  "Time left: " + hours + ":" + minutes + ":" + seconds ;
        }

        updateTimer();
        remainingTime--;
      }
    }, 1000); // Run the interval every 1000ms (1 second)
  }

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

const createTimerAPI = async (access_token, boardID, content) => {
    const options = {
        'method': 'POST',
        'url': `https://api.miro.com/v2/boards/${boardID}/texts`,
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data: {
            "data": {
                "content": `${content}`
            },
            "style": {
                "fontSize": "300"
            }
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data.id);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}

const getTimerAPI = async (access_token, boardID, itemID) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items/${itemID}`,
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'accept': 'application/json',
        },
        data: {

        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data.id);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}

const updateTimerAPI = async (access_token, boardID, itemID, content) => {
    const options = {
        'method': 'PATCH',
        'url': `https://api.miro.com/v2/boards/${boardID}/texts/${itemID}`,
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data: {
            "data": {
                "content": `${content}`
            },
            "style": {
                "fontSize": "300",
                "color": "#fa0505"
            }
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data.id);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}

const setTimer = async () => {
    let time = "Time left:"

    // const timerText = await createTimerAPI(responseToken.data, responseBoard.data.id, time );
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

const getTimer = async () => {
    const timerText = await getTimerAPI(responseToken.data, responseBoard.data.id, timerID);
    document.getElementById("timerID").textContent = JSON.stringify(timerText.data.data.content); 
}

const updateTimer = async (timeText) => {
    const timerText = await updateTimerAPI(responseToken.data, globalBoardID, timerID, timeText);

}

const updateAgendaTimer = async (time) => {
    let timerText = "Time left: " + changeTimeFormat(time)
    const result = await updateTimerAPI(responseToken.data, globalBoardID, timerID, timerText);
}



const newTime = async () => {
    let hour = parseInt( document.getElementById("hour").value )
    let minute = parseInt( document.getElementById("minute").value )
    let second = parseInt( document.getElementById("second").value )
    finalTime = hour*3600 + minute*60 + second;

    startCountdown(finalTime);
}


/*
    ******************************************************
    ******************************************************
    Workshop section
    ******************************************************
    ******************************************************
*/
const createWorkshopAPI = async (userID, workshopname) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/workshops`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            User: userID,
            workshopname: workshopname
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data);
        
        return result;
      } catch (e) {
           console.log(e);
           return JSON.parse(e.request.responseText).message
      }
}

const getWorkshopByNameAPI = async ( workshopname) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/workshops/workshopByName`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            workshopname: workshopname
        }
    };
    
    try {
        console.log("workshopname")
        console.log(workshopname)
        const result = await axios(options);
        console.log(result.data);
        
        return result;
      } catch (e) {
           console.log(e);
           document.getElementById("workshopError").innerHTML = JSON.parse(e.request.responseText).message
           return JSON.parse(e.request.responseText).message
      }
}

const updateWorkshopAPI = async (workshopID, userID, notes) => {
    const options = {
        'method': 'PATCH',
        'url': `https://whiteboarddj-server.onrender.com/workshops`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            id: workshopID,
            User: userID,
            Note: notes
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}

const addAgendaAPI = async (workshopID, workshopAgenda) => {
    const options = {
        'method': 'PATCH',
        'url': `https://whiteboarddj-server.onrender.com/workshops/userworkshop`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            id: workshopID,
            workshopAgenda: workshopAgenda
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}

const deleteAgendaAPI = async (workshopID) => {
    const options = {
        'method': 'DELETE',
        'url': `https://whiteboarddj-server.onrender.com/workshops/userworkshop`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            id: workshopID
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}

const getUserByMiroId = async (username, miroId) => {
        const options = {
            'method': 'POST',
            'url': `https://whiteboarddj-server.onrender.com/users/username`,
            'headers': {
                
            },
            data: {
              "username": `${username}`,
              "miroId": `${miroId}`
            }
        };
        
        try {
            const result = await axios(options);
            console.log(result.data);
            return result;
          } catch (e) {
                console.log(e);
                return e
          }
    }

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
      console.log(result2)
      
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

const summariseAPI = async (notes, sensitivity) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/summarise`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            notes: notes,
            sensitivity: sensitivity
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data);
        return result;
      } catch (e) {
           console.log(e);
      }
}

const addSummaryAPI = async (workshopID, workshopSummary) => {
  const options = {
      'method': 'PATCH',
      'url': `https://whiteboarddj-server.onrender.com/workshops/workshopByName`,
      'headers': {
          'content-type': 'application/json'
      },
      data: {
          id: workshopID,
          workshopSummary: workshopSummary
      }
  };
  
  try {
      const result = await axios(options);
      console.log(result.data);
      
      return result;
    } catch (e) {
         console.log(e);
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
        console.log("resultFrame Notes")
        console.log(resultFrameNotes)
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
    console.log("result1.data")
    console.log(result1.data)
    document.getElementById("summarisation").textContent =  result1.data.summary;

    let finalSummary = "Summary of the whole workshop: \n" + result1.data.summary + "\n\nSummary of clusters: \n" + summarsationText

    const result2 = await getWorkshopByNameAPI(global.workshopname );
    const result3 = await addSummaryAPI(result2.data[0]._id, finalSummary );
    console.log(result3)

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


    const [agendaSession, setAgendaSession] = useState('');
    const [fetchedAgendaSession, setFetcgedAgendaSession] = useState('');

      const addSessions=  () => {
        if (document.getElementById("newSession").value === ""){
          document.getElementById("sessionError").innerHTML = "Please enter a session name"
        }
        else{
          var hours = 0;
          var minutes = 0;
          var seconds = 0;
          if (document.getElementById("newSessionHour").value !== ""){
            hours = parseInt( document.getElementById("newSessionHour").value )
          }
          if (document.getElementById("newSessionMinute").value !== ""){
            minutes = parseInt( document.getElementById("newSessionMinute").value )
          }
          if (document.getElementById("newSessionSecond").value !== ""){
            seconds = parseInt( document.getElementById("newSessionSecond").value )
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

          agenda = agenda + document.getElementById("newSession").value + " " 
          + hours + ":" 
          + minutes + ":" 
          + seconds + '\n'
          setAgendaSession(agenda);
          
          document.getElementById("newSession").value = "";
          document.getElementById("newSessionHour").value = "";
          document.getElementById("newSessionMinute").value = "";
          document.getElementById("newSessionSecond").value = "";
        }
        
    }

    const deleteAgenda = async () => {
        document.getElementById("agendaError").innerHTML = "Deleting agenda..."
        const result1 = await getWorkshopByNameAPI(global.workshopname );
        const result2 = await deleteAgendaAPI(result1.data[0]._id );
        console.log(result2)

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

    const addItems = async () => {
      setCountdowns([]);
        var sessions = fetchedAgendaSession.split('\n')
        console.log(sessions)

        for (let i = 0;i<sessions.length-1;i++){
            let itemName = sessions[i].slice(0, sessions[i].indexOf(' ') + 1)
      
            let sessionTime = sessions[i].slice(sessions[i].indexOf(' ') + 1,sessions[i].length)
            let hour = parseInt( sessionTime.slice(0,sessionTime.indexOf(':')) )
            let minute = parseInt( sessionTime.slice(sessionTime.indexOf(':') + 1,sessionTime.lastIndexOf(':')) )
            let second = parseInt( sessionTime.slice(sessionTime.lastIndexOf(':') + 1,sessionTime.length) )
            let finalTime = hour*3600 + minute*60 + second;
      
            const newItem = { name: itemName, time: finalTime, id: i };
            setCountdowns((prevItems) => [...prevItems, newItem]);
        }

    }


    /*
    ******************************************************
    ******************************************************
    Time section
    ******************************************************
    ******************************************************
    */

    const [countdowns, setCountdowns] = useState([]);
    const [currentCountdownIndex, setCurrentCountdownIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
  
    const startCountdown = () => {
      addItems()
      if (!isRunning) {
        setIsRunning(true);
        setCurrentCountdownIndex(0);
      }
      if (coach === false){
        document.getElementById("timerSection").hidden = false
      }
    };

    const startNewAgendaCountdown = () => {
      if (!isRunning) {
        setIsRunning(true);
        setCurrentCountdownIndex(0);
      }
    };

    const updateAgendaWithTimer = async (updatedAgenda) => {
      const result1 = await getWorkshopByNameAPI(global.workshopname );
      const result2 = await addAgendaAPI(result1.data[0]._id, updatedAgenda );
    }

    const newSessionTime = async () => {
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        if (document.getElementById("hour").value !== ""){
          hours = parseInt( document.getElementById("hour").value )
        }
        if (document.getElementById("minute").value !== ""){
          minutes = parseInt( document.getElementById("minute").value )
        }
        if (document.getElementById("second").value !== ""){
          seconds = parseInt( document.getElementById("second").value )
        }
        finalTime = hours*3600 + minutes*60 + seconds;

        setCountdowns((prevCountdowns) => {
            const updatedCountdowns = [...prevCountdowns];
            const currentCountdown = updatedCountdowns[currentCountdownIndex];
            if (currentCountdown.time > 0) {
              updatedCountdowns[currentCountdownIndex] = {
                ...currentCountdown,
                time: finalTime,
              };

            let updatedAgenda = ""
            
            for (let i = 0;i<updatedCountdowns.length;i++){
              let sessionName = updatedCountdowns[i].name
              let sessionTime = changeTimeFormat(updatedCountdowns[i].time)
              updatedAgenda = updatedAgenda + sessionName + " " + sessionTime + '\n'
            }
            
            updateAgendaWithTimer(updatedAgenda);
            

            const data = {
              agenda: updatedCountdowns ,
              recipients: selectedRecipients
            };
            socket.emit('sendAgenda', data);

            }
            document.getElementById("timerError").textContent = "time updated succesfully";
            return updatedCountdowns;
        });
    }
  


    useEffect(() => {
      let timerId;
  
      if (isRunning && currentTimeIndex < countdowns.length && coach === true) {
        timerId = setInterval(() => {
          setCountdowns((prevCountdowns) => {
            const updatedCountdowns = [...prevCountdowns];
            const currentCountdown = updatedCountdowns[currentCountdownIndex];
            if (currentCountdown.time > 0) {
              updatedCountdowns[currentCountdownIndex] = {
                ...currentCountdown,
                time: currentCountdown.time - 1,
              };
                

            } else {
              clearInterval(timerId);
              setCurrentCountdownIndex(currentCountdownIndex + 1);
            }
            return updatedCountdowns;
          });
        }, 1000);
      }
      else if (isRunning && currentCountdownIndex < countdowns.length && coach === false) {
        timerId = setInterval(() => {
          setCountdowns((prevCountdowns) => {
            const updatedCountdowns = [...prevCountdowns];
            const currentCountdown = updatedCountdowns[currentCountdownIndex];
            if (currentCountdown.time > 0) {
              updatedCountdowns[currentCountdownIndex] = {
                ...currentCountdown,
                time: currentCountdown.time - 1,
              };
              updateAgendaTimer(currentCountdown.time-1)
                

            } else {
              clearInterval(timerId);
              setCurrentCountdownIndex(currentCountdownIndex + 1);
            }
            return updatedCountdowns;
          });
        }, 1000);
      }
  
      return () => {
        clearInterval(timerId);
      };
    }, [isRunning, currentCountdownIndex, countdowns]);





      /*
      ******************************************************
      ******************************************************
      New agenda section
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
  
    const handleTimeChange = (index, newTime) => {
      const updatedSessions = sessions.map((session, i) =>
        i === index ? { ...session, time: newTime } : session
      );
      setSessions(updatedSessions);
      console.log("sessions")
      console.log(sessions)
    };
  
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
        console.log("sessions")
        console.log(sessions)

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

        console.log("sessions");
        console.log(sessions);

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
      console.log('Agenda saved:', sessions);
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
      console.log("connectToServer userId")
      console.log(userId)
      socket = io.connect('https://whiteboarddj-server.onrender.com', {
        query:  {userId},
        transports: ['websocket'] 
      }); // Adjust the URL to your server's URL
      console.log("socket")
      console.log(socket)

      if (socket){
        document.getElementById("messageError").textContent = "You are connected to the server successfully"
      }
      else{
        document.getElementById("messageError").textContent = "You failed connecting to the server"
      }
      socket.on('receiveMessage', (message) => {
        console.log("Received a new message: " + message)
        setReceivedMessages(prevMessages => [...prevMessages, message]);
      });


      socket.on('receiveRunningAgenda', (data) => {
        console.log("Received a new agenda: " + data)
        setIsRunning(data.isRunning);
        setSessions(data.sessions);
        setCurrentTime(data.currentTime);
        setCurrentTimeIndex(data.currentTimeIndex);
      });

      let selectedUsers = [];
      socket.on('userList', (userList) => {

        console.log("userList")
        console.log(userList)

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
      console.log( "global.username")
      console.log(global.username)
      console.log("userId")
      console.log(userId)
  
      console.log("selectedRecipients")
      console.log(selectedRecipients)
      console.log("selectedRecipients.length")
      console.log(selectedRecipients.length)
      let sentRecipients = ""
  
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
          console.log("data")
          console.log(data)
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
              <br></br>
              <h3 class="errorMessage" id="loading"></h3>
              <br></br>
              <br></br>
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
