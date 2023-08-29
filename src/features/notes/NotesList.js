// import React, { useState } from 'react';

// const NotesList = () => {
//   const [sessions, setSessions] = useState([]);
//   const [sessionName, setSessionName] = useState('');
//   const [sessionTime, setSessionTime] = useState('');

//   const handleAddSession = () => {
//     if (sessionName && sessionTime) {
//       const newSession = { name: sessionName, time: sessionTime };
//       setSessions([...sessions, newSession]);
//       setSessionName('');
//       setSessionTime('');
//       console.log("sessions")
//       console.log(sessions)
//       document.getElementById("addSessionName").hidden = true;
//       document.getElementById("addSessionTime").hidden = true;
//     }
//   };

//   const handleTimeChange = (index, newTime) => {
//     const updatedSessions = sessions.map((session, i) =>
//       i === index ? { ...session, time: newTime } : session
//     );
//     setSessions(updatedSessions);
//     console.log("sessions")
//     console.log(sessions)
//   };

//   const addSession = () => {
//     document.getElementById("addSessionName").hidden = false;
//     document.getElementById("addSessionTime").hidden = false;
//   }

//   return (
//     // <table className="table table--users">
//     // <thead className="table__thead">
//     //     <tr>
//     //         <th scope="col" className="table__th user__username">Username</th>
//     //         <th scope="col" className="table__th user__roles">Roles</th>
//     //         <th scope="col" className="table__th user__edit">Edit</th>
//     //     </tr>

//     <div>
//       <h2>Workshop Agenda</h2>
//       <table className="table table--users">
//         <thead className="table__thead">
//           <tr>
//             <th scope="col" className="table__th user__username">Session Name</th>
//             <th scope="col" className="table__th user__roles">Time</th>
//             <th scope="col" className="table__th user__edit">Change Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sessions.map((session, index) => (
//             <tr key={index}>
//               <td  className={`table__cell `}>{session.name}</td>
//               <td  className={`table__cell `}>{session.time}</td>
//               <td  className={`table__cell `}>
//                 <input
//                   type="text"
//                   value={session.time}
//                   onChange={e => handleTimeChange(index, e.target.value)}
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div>
//       <button onClick={addSession}>+</button>
//         <br></br>
//         <input
//           id="addSessionName"
//           type="text"
//           placeholder="Session Name"
//           value={sessionName}
//           onChange={e => setSessionName(e.target.value)} hidden
//         />
//         <input
//           id="addSessionTime"
//           type="text"
//           placeholder="Session Time"
//           value={sessionTime}
//           onChange={e => setSessionTime(e.target.value)} hidden
//         />
//         <br></br>

//         <button onClick={handleAddSession}>Save Session</button>
//       </div>
//     </div>
//   );
// };

// export default NotesList;

















import React, { useState } from 'react';

const NotesList = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [extraTimes, setExtraTimes] = useState([]);
  // const [extraTimeError, setExtraTimeError] = useState('');
  const [extraTimeErrors, setExtraTimeErrors] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleAddSession = () => {
    if (sessionName && sessionTime) {
      const newSession = { name: sessionName, time: sessionTime };
      setSessions([...sessions, newSession]);
      setSessionName('');
      setSessionTime('');
      setShowTable(false);
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
  };

  const handleUpdateSession = index => {
    // if (document.getElementById("extraTime").value == "") {
    //   document.getElementById("agendaError").innerHTML = "Please enter a number";
    // }
    // else{
    if (!extraTimes[index]) {
      const newErrors = [...extraTimeErrors];
      newErrors[index] = 'Please enter a value';
      setExtraTimeErrors(newErrors);
      return; // Stop execution if there's an error
    } else {
      const newErrors = [...extraTimeErrors];
      newErrors[index] = ''; // Clear the error message
      setExtraTimeErrors(newErrors);
      const updatedSessions = sessions.map((session, i) =>
      i === index ? { ...session, time: session.time + extraTimes[index] } : session
    );
      setSessions(updatedSessions);
      console.log("sessions")
      console.log(sessions)
    }


    // }
    
  }

  const handleClearAgenda = () => {
    setSessions([]);
  };

  const handleSaveAgenda = () => {
    // You can implement saving logic here
    console.log('Agenda saved:', sessions);
  };

  const addSession = () => {
    // document.getElementById("addSessionName").hidden = false;
    // document.getElementById("addSessionTime").hidden = false;
    setShowTable(true);
  }

  return (
    <div>
      <h2>Workshop Agenda</h2>
      <table className="table_agenda ">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th ">Session Name</th>
            <th scope="col" className="table__th ">Session Time</th>
            <th scope="col" className="table__th ">Current Time Left</th>
            <th scope="col" className="table__th ">Add minutes</th>
            <th scope="col" className="table__th ">Action</th>

          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={index}>
              <td className={`table__cell `}>{session.name}</td>
              <td  className={`table__cell `}>{session.time}</td>
              <td  className={`table__cell `}>{session.time}</td>
              <td className={`table__cell `}>
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
                />
                <button onClick={() => handleUpdateSession(index)}>Update</button>
                <p >{extraTimeErrors[index]}</p>
              </td>
              <td className={`table__cell `}>
              
                <button onClick={() => handleDeleteSession(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <div>
        
        <br></br>
        <button onClick={addSession}>+</button>
        <br></br>
        {showTable && (
        <table id="addSessionTable" className="table_agenda " hidden>
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th ">Session Name</th>
            <th scope="col" className="table__th ">Session Time</th>
            <th scope="col" className="table__th ">Current Time Left</th>
            <th scope="col" className="table__th ">Add minutes</th>
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
                  placeholder="Session Time"
                  value={sessionTime}
                  onChange={e => setSessionTime(e.target.value)} 
                />
              </td>
              <td  className={`table__cell `}></td>
              <td className={`table__cell `}></td>
              <td className={`table__cell `}>
              <button onClick={handleAddSession}>Add Session</button>
              </td>
            </tr>
          
          </tbody>
        </table>
        )}

  
        {/* <input
          id="addSessionName"
          type="text"
          placeholder="Session Name"
          value={sessionName}
          onChange={e => setSessionName(e.target.value)} hidden
        />


        <input
          id="addSessionTime"
          type="text"
          placeholder="Session Time"
          value={sessionTime}
          onChange={e => setSessionTime(e.target.value)} hidden
        /> */}
        <br></br>
        <br></br>
        <button >Start Count Down!</button>
        <br></br>
        <br></br>
        <button onClick={handleClearAgenda}>Clear Agenda</button>

        <button onClick={handleSaveAgenda}>Save Agenda</button>
      </div>
    </div>
  );
};

export default NotesList;
