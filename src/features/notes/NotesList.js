// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// var socket
// var userId



// function NotesList() {
//   const [message, setMessage] = useState('');
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const [selectedRecipients, setSelectedRecipients] = useState([]);



//   const connectToServer = () => {
//     userId = global.username;
//     socket = io.connect('https://whiteboarddj-server.onrender.com', {
//       query:  {userId} 
//     }); // Adjust the URL to your server's URL
//     console.log("socket")
//     console.log(socket)
//     socket.on('receiveMessage', (message) => {
//       console.log("Received a new message: " + message)
//       setReceivedMessages(prevMessages => [...prevMessages, message]);
//     });
  
    
//   }

//   const sendMessage = () => {
//     console.log( "global.username")
//     console.log(global.username)
//     console.log("userId")
//     console.log(userId)

//     // setSelectedRecipients([document.getElementById("recepient").value])
//     console.log("document.getElementById(recepient).value")
//     console.log(document.getElementById("recepient").value)
//     console.log("selectedRecipients")
//     console.log(selectedRecipients)

//     const data = {
//       message: message,
//       recipients: selectedRecipients
//     };
//     socket.emit('sendMessage', data);
//   };

//   const createRecepients = (recepients) => {
//     console.log("recepients")
//     console.log(recepients)
//     if (recepients.charAt(recepients.length - 1) === ","){
//       recepients = recepients.slice(0, -1)
//     }
//     console.log("recepients")
//     console.log(recepients)
//     const recepientsList = recepients.split(",")
//     console.log("recepientsList")
//     console.log(recepientsList)

//     setSelectedRecipients(recepientsList)

//   };



//   return (
//     <div>
//       <br></br>
//       <label>Enter recepients names, seperated by "," E.g. you,me,us:</label>
//       <br></br>
//       <input type="text" id="recepient" onChange={(e) => createRecepients(e.target.value)}></input>

//       <h2>Send a Message</h2>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <br></br>
//       <button onClick={connectToServer}>Connect</button>
//       <button onClick={sendMessage}>Send</button>
//       {/* <button onClick={receiveMessage}>Receive</button> */}

//       <h2>Received Messages</h2>
//       <ul>
//         {receivedMessages.map((msg, index) => (
//           <li key={index}>{msg}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default NotesList;




















import React from 'react';

function NotesList() {
  const downloadText = () => {
    const text = "This is the text content that will be downloaded.";
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'downloaded_text.txt';
    document.body.appendChild(link);
    link.click();
    
    // Clean up after download
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={downloadText}>Download Text</button>
    </div>
  );
}

export default NotesList;
