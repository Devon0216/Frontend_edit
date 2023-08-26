import axios from "axios";
import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from 'react-router-dom'
import io from 'socket.io-client';

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
var sessionNumber = -1;
var socket
var userId
var coach = false;








const login = async () => {
  const loginUsername = document.getElementById("username").value
  const loginPassword = document.getElementById("password").value

  const result1 = await getUserByName(loginUsername, loginPassword );
  



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
  // console.log(result1.data[0].User)
}

const connectMiroBoard = async () => {

  if (document.getElementById("boardID").value !== ""){
    const str = window.location.href;
    const jsonCode = str.slice(str.indexOf('=') + 1,str.indexOf('&'));
  
    console.log("jsonCode")
    console.log(jsonCode)
    responseToken = await getAccessToken(jsonCode);
    console.log("responseToken")
    console.log(responseToken)
    if (responseToken === "Please check your if board ID is correct. If it is correct, please authorize again due to invalid authorization code from Miro"){
      console.log("invalid auth")
      document.getElementById("notesError").innerHTML = responseToken
    }
    else{
      console.log("connected to the miro board")
      // responseBoard = await getBoardID(responseToken.data);
      globalBoardID = document.getElementById("boardID").value
      document.getElementById("notesError").innerHTML = "You have successfully connected to the Miro board"
    }
  }
  else{
    document.getElementById("notesError").innerHTML = "Please enter a board ID to connect."
  }


        // document.getElementById("response").innerHTML = responseToken.data
    

}


/*
    ******************************************************
    ******************************************************
    Sticky notes section
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

const getBoardID = async (access_token) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/uXjVMy3XuMY=`,
        'headers': {
            'Authorization': `Bearer ${access_token}`
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



const getStickyNotes = async (access_token, boardID) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items?type=sticky_note`,
        'headers': {
            'Authorization': `Bearer ${access_token}`
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
       
const NoteItem = ({ noteContent }) => {
    return(
    // global.workshopID = workshopID;
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
        console.log("workshop")
        console.log(workshop)
        console.log("content")
        console.log(content)
        const result = await axios(options);
        console.log(result);
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
        console.log("workshop")
        console.log(workshop)
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

    console.log("timerText")
    console.log(timerText)
    console.log("timerText.status")
    console.log(timerText.status)
    // document.getElementById("timerID").textContent = timerID;
    if (timerText.status === 201){
      document.getElementById("agendaError").textContent = "Timer created successfully";
    } 
    else{
      document.getElementById("agendaError").textContent = "Timer create failed";
    }

}

// const getTimer = async () => {
//     const timerText = await getTimerAPI(responseToken.data, responseBoard.data.id, timerID);
//     document.getElementById("timerID").textContent = JSON.stringify(timerText.data.data.content); 
// }

const updateTimer = async () => {
    if (timerID !== undefined){
      
      const timerText = await updateTimerAPI(responseToken.data, globalBoardID, timerID, document.getElementById("timer").textContent);
        // const timerText = await updateTimerAPI(responseToken.data, responseBoard.data.id, timerID, document.getElementById("timer").textContent);
        document.getElementById("timerID").textContent = "changed time correctly"; 
    }

}

const updateAgendaTimer = async (time) => {
    let timerText = "Time left: " + changeTimeFormat(time)
    // console.log(responseToken)
    // console.log(responseBoard.data.id)
    // console.log(timerID)

    // const result = await updateTimerAPI(responseToken.data, responseBoard.data.id, timerID, timerText);
    const result = await updateTimerAPI(responseToken.data, globalBoardID, timerID, timerText);
}



const newTime = async () => {
    // let time = document.getElementById("newTimer").value
    let hour = parseInt( document.getElementById("hour").value )
    let minute = parseInt( document.getElementById("minute").value )
    let second = parseInt( document.getElementById("second").value )
    finalTime = hour*3600 + minute*60 + second;

    startCountdown(finalTime);
}

const startAgendaTime = async () => {
    // let time = document.getElementById("newTimer").value
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
          //  document.getElementById("workshopError").innerHTML = JSON.parse(e.request.responseText).message
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

const getUserByName = async (username, password) => {
        // const username = document.getElementById("loginUsername").value
        // const password = document.getElementById("loginPassword").value
        // console.log(username);
        // console.log(password);
        const options = {
            'method': 'POST',
            'url': `https://whiteboarddj-server.onrender.com/users/username`,
            'headers': {
                
            },
            data: {
              "username": `${username}`,
              "password": `${password}`
            }
        };
        
        try {
            const result = await axios(options);
            console.log(result.data);
            // let user;
            // user =  "Welcome: " + result.data[0].username
            // document.getElementById("test").innerHTML = user

            // console.log("username")
            // console.log(document.getElementById("loginUsername").value)
            // global.userid = result.data[0]._id
            // global.username= result.data[0].username
            // navigate('/dash')
            return result;
          } catch (e) {
                // document.getElementById("test").innerHTML = "Your entered information is wrong"
                document.getElementById("loginError").textContent = "You have entered wrong username or password"
                console.log(e);
          }
    }

const createWorkshop = async () => {
    global.workshopname = document.getElementById("workshopname").value
    global.username = document.getElementById("username").value
    global.password = document.getElementById("password").value

    const result1 = await getUserByName(global.username, global.password );
    global.userid = result1.data[0]._id
    const result2 = await createWorkshopAPI(global.userid, global.workshopname );
    console.log(result2)
    document.getElementById("notesSection").hidden = false
    document.getElementById("workshopError").innerHTML = "Workshop created successfully"
}

const joinWorkshopAsFacilitator = async () => {
  global.workshopname = document.getElementById("workshopname").value
  // global.username = document.getElementById("username").value
  // global.password = document.getElementById("password").value

  const result1 = await getWorkshopByNameAPI(global.workshopname );

  // const result1 = await getUserByName(global.username, global.password );
  // global.userid = result1.data[0]._id
  // const result2 = await createWorkshopAPI(global.userid, global.workshopname );
  const facilitatorUserId = result1.data[0].User
  console.log("facilitatorUserId")
  console.log(facilitatorUserId)

  const result2 = await getUserByName(global.username, global.password );
  // global.userid = result1.data[0].USER

  const loginUserId = result2.data[0]._id
  console.log("loginUserId")
  console.log(loginUserId)

  if (facilitatorUserId === loginUserId){
    // console.log("sucesss")
    document.getElementById("workshopError").innerHTML = "Joined as facilitator successfully"
    document.getElementById("notesSection").hidden = false
  }
  else{
    document.getElementById("workshopError").innerHTML = "Wrong username or password for facilitator"
    // console.log("wrong username or password")
  }

  

  // console.log(result1.data[0].User)
}

const joinWorkshopAsCoach = async () => {
  global.workshopname = document.getElementById("workshopname").value
  // global.username = document.getElementById("username").value
  // global.password = document.getElementById("password").value

  const result1 = await getWorkshopByNameAPI(global.workshopname );

  // const result1 = await getUserByName(global.username, global.password );
  // global.userid = result1.data[0]._id
  // const result2 = await createWorkshopAPI(global.userid, global.workshopname );
  console.log(result1)
  coach = true;
  document.getElementById("notesSection").hidden = false
  document.getElementById("saveNotesButton").hidden = true
  document.getElementById("summariseNotesButton").hidden = true
  document.getElementById("workshopError").innerHTML = "Joined as coach successfully"
  // console.log(result1.data[0].User)
}

const addNotesToWorkshop = async () => {
    global.workshopname = document.getElementById("workshopname").value
    global.username = document.getElementById("username").value
    // console.log("global.username")
    // console.log(global.username)
    // global.password = document.getElementById("password").value
    // console.log("global.password")
    // console.log(global.password)

    // const result1 = await getUserByName(global.username, global.password );
    // global.userid = result1.data[0]._id
    
    
    const result1 = await getWorkshopByNameAPI(global.workshopname );
    const workshopid = result1.data[0]._id
    const deleteResult = await deleteNotesByWorkshopAPI(workshopid );

    var notesId = []
    for  (let i = 0; i < currentNotes.length; i++) {
        console.log("currentNotes[i]")
        console.log(currentNotes[i])
        const result = await saveStickyNotes(workshopid, currentNotes[i].data.content );
        notesId.push(result.data._id);
    }
    console.log("notesId")
    console.log(notesId)


    const result2 = await updateWorkshopAPI(workshopid, global.userid, notesId );
    console.log("result2")
    console.log(result2)

    if (result2.status === 200){
      document.getElementById("notesError").innerHTML = "Notes saved successfully"
    }
    else{
      document.getElementById("notesError").innerHTML = "Notes save failed"
    }
}


const addAgenda = async () => {
    const result1 = await getWorkshopByNameAPI(global.workshopname );
    // console.log(result1.data[0])
    // global.userid = result1.data[0]._id
    const result2 = await addAgendaAPI(result1.data[0]._id, agenda );
    console.log(result2)

    if (result2.status === 200){
      document.getElementById("agendaError").innerHTML = "Agenda saved successfully"
    }
    else{
      document.getElementById("agendaError").innerHTML = "Agenda save failed"
    }

    // document.getElementById("agendaTest").value = ""
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
    console.log("currentNotes")
    console.log(currentNotes)

    var notesText = ""

    for (let i = 0;i < currentNotesLength;i++){
        notesText = notesText + notes[i].data.content + ". "
    }

    // console.log("notesText")
    // console.log(notesText)
    let sensitivityScore = 10
    var sensitivity = document.getElementById("sensitivity");
    // var value = sensitivity.options[sensitivity.selectedIndex].value;
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


    
    const result1 = await summariseAPI(notesText, sensitivityScore );
    console.log("result1.data")
    console.log(result1.data)
    document.getElementById("summarisation").textContent = "Summary:\n" + result1.data.summary;
    // // global.userid = result1.data[0]._id
    // // const result2 = await addAgendaAPI(global.userid, agenda );
    // // console.log(result2)

    // // document.getElementById("agendaTest").value = ""
    // const result2 = await getWorkshopByNameAPI(global.workshopname );
    // // global.userid = result1.data[0]._id
    // const result3 = await addSummaryAPI(result2.data[0]._id, result1.data );
    // console.log(result3)

    // if (result3.status === 200){
    //   document.getElementById("notesError").innerHTML = "Summary saved successfully"
    // }
    // else{
    //   document.getElementById("notesError").innerHTML = "Summary save failed"
    // }
}












const MiroAuthorize = () => {

    console.log(window.location.href)

    // const navigate = useNavigate();
    // useEffect(() => {
    //     async function autoLogin() {
    //       const response = await fetch("https://whiteboarddj-server.onrender.com/autoLogin", {
    //         method: "GET",
    //         credentials: "include",
    //       });
    //       if (response.status === 200) {
    //         navigate("/dash/authorize");
    //       } else {
    //         navigate("/login");
    //       }
    //     }
    //     autoLogin();
    //   }, []);





    /*
    ******************************************************
    ******************************************************
    Notes section
    ******************************************************
    ******************************************************
    */


    const [tableContent, setTableContent] = useState([]);

    const getNotes = async () => {
        // const str = window.location.href;
        // const jsonCode = str.slice(str.indexOf('=') + 1,str.indexOf('&'));

        // responseToken = await getAccessToken(jsonCode);
        // // document.getElementById("response").innerHTML = responseToken.data
    
        // responseBoard = await getBoardID(responseToken.data);
        // document.getElementById("test").innerHTML = responseBoard.data.id

        console.log("responseToken.data")
        console.log(responseToken.data)

        
        const responseNotes = await getStickyNotes(responseToken.data, globalBoardID);
        // const responseNotes = await getStickyNotes(responseToken.data, responseBoard.data.id);
        notes = responseNotes.data.data
        console.log("notes")
        console.log(notes)
        if (notes !== undefined){
            currentNotes = notes
            currentNotesLength = currentNotes.length
        }

        
        const newContent = notes.map(note => (
            <NoteItem key={note.id} noteContent={note.data.content} />
        ));
        setTableContent(newContent);

        console.log("tableContent")
        console.log(tableContent)
        
        document.getElementById("agendaSection").hidden = false
        document.getElementById("timerSection").hidden = false
        document.getElementById("messageSection").hidden = false

        if (coach === true){
          document.getElementById("agendaCoach").hidden = true
          document.getElementById("timerSection").hidden = true
        }

    }



    // const DynamicComponent = ({ id }) => {
    //     return (
    //         <div>
    //             <label>{document.getElementById("sessionName").value}</label>
    //             <br></br>
    //             <label>{"Duration:" + document.getElementById("sessionTime").value}</label>

                
    //         </div>
    //     )
    // };
    // const [componentCount, setComponentCount] = useState(0);
    // const [components, setComponents] = useState([]);

    // const addComponent = () => {
    //     const newComponentCount = componentCount + 1;
    //     setComponentCount(newComponentCount);

    //     const newComponent = <DynamicComponent key={newComponentCount} id={newComponentCount} />;
    //     setComponents([...components, newComponent]);
    // };



    /*
    ******************************************************
    ******************************************************
    Agenda section
    ******************************************************
    ******************************************************
    */


    const [agendaSession, setAgendaSession] = useState('');
    const [fetchedAgendaSession, setFetcgedAgendaSession] = useState('');

    const addSession =  () => {
        let hours = parseInt( document.getElementById("newSessionHour").value )
        let minutes = parseInt( document.getElementById("newSessionMinute").value )
        let seconds = parseInt( document.getElementById("newSessionSecond").value )

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

    const clearAgenda = async () => {
        // const result1 = await getWorkshopByNameAPI(global.workshopname );
        // global.userid = result1.data[0]._id
        // const result2 = await addAgendaAPI(global.userid, agenda );
        // console.log(result2)
        const result1 = await getWorkshopByNameAPI(global.workshopname );
        global.userid = result1.data[0]._id
        const result2 = await deleteAgendaAPI(global.userid );
        console.log(result2)
        setAgendaSession("");
        agenda = ""

        if (result2.status === 200){
          document.getElementById("agendaError").innerHTML = "Agenda cleared successfully"
        }
        else{
          document.getElementById("agendaError").innerHTML = "Agenda clear failed"
        }
    }



    const getAgenda = async () => {
        const result1 = await getWorkshopByNameAPI(global.workshopname );
        setFetcgedAgendaSession(result1.data[0].workshopAgenda)
        document.getElementById("fetchedAgenda").innerHTML = "Your Agenda:"
        // const result2 = await addAgendaAPI(global.userid, agenda );
        // console.log(result2)
    
        // document.getElementById("agendaTest").value = ""
    }

    const addItems = async () => {

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
    };

    const startNewAgendaCountdown = () => {
      if (!isRunning) {
        setIsRunning(true);
        setCurrentCountdownIndex(0);
      }
    };

    const newSessionTime = async () => {
        // let time = document.getElementById("newTimer").value
        let hour = parseInt( document.getElementById("hour").value )
        let minute = parseInt( document.getElementById("minute").value )
        let second = parseInt( document.getElementById("second").value )
        finalTime = hour*3600 + minute*60 + second;

        setCountdowns((prevCountdowns) => {
            const updatedCountdowns = [...prevCountdowns];
            const currentCountdown = updatedCountdowns[currentCountdownIndex];
            if (currentCountdown.time > 0) {
              updatedCountdowns[currentCountdownIndex] = {
                ...currentCountdown,
                time: finalTime,
              };
            //   updateAgendaTimer(currentCountdown.time-1)
                
            const data = {
              agenda: updatedCountdowns ,
              recipients: selectedRecipients
            };
            socket.emit('sendAgenda', data);

            // socket.emit('sendAgenda', updatedCountdowns);

            }
            return updatedCountdowns;
        });
    }
  
    useEffect(() => {
      let timerId;
  
      if (isRunning && currentCountdownIndex < countdowns.length && coach === true) {
        timerId = setInterval(() => {
          setCountdowns((prevCountdowns) => {
            const updatedCountdowns = [...prevCountdowns];
            const currentCountdown = updatedCountdowns[currentCountdownIndex];
            if (currentCountdown.time > 0) {
              updatedCountdowns[currentCountdownIndex] = {
                ...currentCountdown,
                time: currentCountdown.time - 1,
              };
              // updateAgendaTimer(currentCountdown.time-1)
                

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
    Message section
    ******************************************************
    ******************************************************
    */

    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState([]);


    const connectToServer = () => {
      userId = global.username;
      socket = io.connect('https://whiteboarddj-server.onrender.com', {
        query:  {userId},
        transports: ['websocket'] 
      }); // Adjust the URL to your server's URL
      console.log("socket")
      console.log(socket)
      // console.log("socket.connected")
      // console.log(socket.connected)
      // console.log("socket.id")
      // console.log(socket.id)
      //       console.log("socket.ids")
      // console.log(socket.ids)
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

      socket.on('receiveAgenda', (data) => {
        console.log("Received a new agenda: " + data.agenda)
        // console.log(agenda)
        console.log("Received a new agenda: " + data.agenda[0].name)

        setCountdowns(data.agenda);
        console.log("countdowns")
        console.log(countdowns)
        startNewAgendaCountdown()

        // setReceivedMessages(prevMessages => [...prevMessages, agenda[0].name]);
      });
    
      
    }
  
    const sendMessage = () => {
      console.log( "global.username")
      console.log(global.username)
      console.log("userId")
      console.log(userId)
  
      // setSelectedRecipients([document.getElementById("recepient").value])
      console.log("document.getElementById(recepient).value")
      console.log(document.getElementById("recepient").value)
      console.log("selectedRecipients")
      console.log(selectedRecipients)
  
      const data = {
        message: message + " (from " + global.username + ")",
        recipients: selectedRecipients
      };
      socket.emit('sendMessage', data);
      document.getElementById("messageSent").textContent = "Message sent successfully"
    };
  
    const createRecepients = (recepients) => {
      console.log("recepients")
      console.log(recepients)
      if (recepients.charAt(recepients.length - 1) === ","){
        recepients = recepients.slice(0, -1)
      }
      console.log("recepients")
      console.log(recepients)
      const recepientsList = recepients.split(",")
      console.log("recepientsList")
      console.log(recepientsList)
  
      setSelectedRecipients(recepientsList)
  
    };


    let content = (
        <section>

            <div id="loginSection">
              <h1 className="sectionHeading">Please authorize again if any unexpected behaviour occurs</h1>
              <br></br>
              <h1 className="sectionHeading">Log in:</h1>
              <label>You can sign up on the welcome Page</label>
              <br></br>
              <label>User name:</label>
              <br></br>
              <input type="text" id="username" required minLength="2" maxLength="15" size="20" />
              <br></br>
              <label>password:</label>
              <br></br>
              <input type="password" id="password" required minLength="2" maxLength="15" size="20" />
              <br></br>
              <button class="button-orange" onClick={login}>Log in</button>
              <p class="errorMessage" id="loginError"></p>
              <br></br>
              <br></br>
            </div>

            <div id="workshopSection" hidden>
              <h1 className="sectionHeading">Please create or join a workshop:</h1>
              {/* <br></br> */}
              <label>Workshop name:</label>
              <br></br>
              <input type="text" id="workshopname" required minLength="2" size="20" />
              <br></br>
              <button class="button-orange" onClick={createWorkshop}>Create a  workshop</button>
              <br></br>
              <br></br>
              <button class="button-orange" onClick={joinWorkshopAsFacilitator}>Join a workshop as facilitator</button>
              <button class="button-orange" onClick={joinWorkshopAsCoach}>Join a workshop as coach</button>
              <p class="errorMessage" id="workshopError"></p>
              <br></br>
              <br></br>
              <br></br>
            </div>







            <div id="notesSection" hidden>
              <h1 className="sectionHeading">Participants' Sticky Notes: </h1>
              <label className="sectionHeading">First step</label>
              <br></br>
              <label>Please enter your board ID. It should be in your website URL when you open a Miro board.</label>
              <br></br>
              <label>E.g. https://miro.com/app/board/uXjVMy3XuMY=/, the board ID is "uXjVMy3XuMY="</label>
              <br></br>
              <input id="boardID"></input>
              <br></br>
              <button class="button-orange" onClick={connectMiroBoard} >Connect to the Miro board</button>
              <p class="errorMessage" id="notesError"></p>
              <br></br>
              <br></br>
              <label className="sectionHeading">Second step</label>
              <br></br>
              <button class="button-orange" onClick={getNotes} >Get Participants Notes</button>
              <button class="button-orange" onClick={addNotesToWorkshop} id="saveNotesButton">Save sticky notes to workshop</button>
              <br></br>
              <br></br>
              {/* <h1 id="response">response</h1>
              <h1 id="test">test</h1>
              <h1 id="test2">test2</h1> */}
              <table className="table_workshop table--users">
                  <thead className="table__thead">
                  <tr>
                      <th scope="col" className="table__th user__username">Notes:</th>
                  </tr>
                  </thead>
                  <tbody>
                      {tableContent}
                      {/* {notes.map(note => (
                          <NoteItem key={note.id} noteContent={note.data.content} />
                          
                      ))} */}
                  </tbody>
              </table>
              <br></br>
              <label className="sectionHeading">Third step</label>
              <br></br>
              <label>Please select sensitivity for the summarisation</label>
              <br></br>
              <select id="sensitivity">
                <option value="lowSensitivity">Low</option>
                <option value="mediumSensitivity">Medium</option>
                <option value="highSensitivity">High</option>
              </select>
              <br></br>
              <button class="button-orange" onClick={summarise} id="summariseNotesButton">Summarise the notes</button>
              <br></br>
              <p id="summarisation"></p>
              <br></br>
              <br></br>
            </div>




            <div id="agendaSection" hidden>
              <h1 className="sectionHeading">Agenda: </h1>
              <div id="agendaCoach">
                  <label className="sectionHeading">First step</label>
                  <br></br>
                  <button class="button-orange" onClick={setTimer}>Create a Timer on Miro board</button>
                  <p class="errorMessage" id="agendaError"></p>
                  <br></br>
                  <br></br>
                  <label className="sectionHeading">Second step</label>
                  <br></br>
                  <label >Session name: </label>
                  <br></br>
                  <input type="text" id="newSession" required minLength="5" maxLength="15"/>
                  <br></br>
                  <label >Session time: </label>
                  <br></br>
                  <input type="text" id="newSessionHour" required minLength="5" maxLength="15" size="3" />
                  <label >: </label>
                  <input type="text" id="newSessionMinute" required minLength="5" maxLength="15" size="3" />
                  <label >: </label>
                  <input type="text" id="newSessionSecond" required minLength="5" maxLength="15" size="3"/>
                  <br></br>
                  <button class="button-orange" onClick={addSession}>Add a session</button>
                  {/* <h1 id="output"></h1> */}
                  {agendaSession.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                  ))}
                  <br></br>
                  <label className="sectionHeading">Third step</label>
                  <br></br>
                  <label >For the current workshop: </label>
                  <br></br>
                  <button class="button-orange" onClick={addAgenda}>Add agenda</button>
                  <br></br>
                  <button class="button-orange" onClick={clearAgenda}>Clear agenda</button>
                  <br></br>
              </div>

              <button class="button-orange"  onClick={getAgenda}>Get agenda</button>
              <h1 id="fetchedAgenda"></h1>
              {fetchedAgendaSession.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}

              <br></br>
              <div>
                  <label className="sectionHeading">Fourth step</label>
                  <br></br>
                  <button class="button-orange" onClick={startCountdown}>Start Countdown</button>
                  {countdowns.map((countdown, index) => (
                      <p key={countdown.id}>
                      Countdown {countdown.name}: {changeTimeFormat(countdown.time)} seconds
                      </p>
                  ))}
              </div>
              <br></br>
              <br></br>
            </div>





            <div id="timerSection" hidden>
              <h1 className="sectionHeading">Timer: </h1>

              {/* <h1 id="timer">Time left: </h1> */}
              {/* <h1 id="timer2">Time2 left: </h1> */}
              {/* <button onClick={openURL}>Authorize</button> */}
              {/* <br></br> */}
              {/* <button onClick={getTimer}>Get Timer Text: </button> */}
              <label>Please format your new time - Hours:Minutes:Seconds</label>
              <br></br>
              <input type="text" id="hour" required minLength="5" maxLength="15" size="3" />
              <label>:</label>
              <input type="text" id="minute" required minLength="5" maxLength="15" size="3" />
              <label>:</label>
              <input type="text" id="second" required minLength="5" maxLength="15" size="3" />
              <br></br>
              <button class="button-orange" onClick={newSessionTime}>Update Timer: </button>
              <h1 id="timerID"></h1>
              <br></br>
              <br></br>
            </div>








            <div id="messageSection" hidden>
              <h1 className="sectionHeading">Message: </h1>
              <label className="sectionHeading">First step</label>
              <br></br>
              <label>To send messages and synchronize time with coaches, please click the button:</label>
              <br></br>
              <button class="button-orange" onClick={connectToServer}>Connect facilitator and coaches</button>
              <br></br>
              <label class="errorMessage" id="messageError"></label>
              <br></br>
              <br></br>
              <label className="sectionHeading">Second step</label>
              <br></br>
              <label>Enter recepients names, seperated by "," E.g. Devon,Joshua,Gary:</label>
              <br></br>
              <input type="text" id="recepient" onChange={(e) => createRecepients(e.target.value)}></input>
              <br></br>
              
              <label className="sectionHeading">Third step</label>
              <br></br>
              <label>Send a Message:</label>
              <br></br>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              
              <button class="button-orange" onClick={sendMessage}>Send</button>
              <label id="messageSent"></label>
              {/* <button onClick={receiveMessage}>Receive</button> */}
              <br></br>
              <label>Received Messages:</label>
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
