import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'




const NoteItem = ({ noteContent }) => {
    // console.log("noteContent")
    // console.log(noteContent)
    
    return(
    // global.workshopID = workshopID;
    <tr className="table__row user">
        <td className={`table__cell ` }>{noteContent}</td>
    </tr>
)};

const WorkshopNotes = () => {
    const [notes, setNotes] = useState([]);
    const [fetchedAgendaSession, setFetcgedAgendaSession] = useState('');

    const getNotesByWorkshop = async () => {
        const options = {
            'method': 'POST',
            'url': `http://localhost:3500/notes/workshopNotes`,
            'headers': {
              'Content-Type': 'application/json'
            },
            data: {
              workshop: global.workshopID
            }
        };
        
        try {
            const result = await axios(options);
            // console.log("getNotesByWorkshop");
            // console.log(result);
            console.log("global.workshopID");
            console.log(global.workshopID);
            console.log("result.data");
            console.log(result.data);
            setNotes(result.data);

            // console.log("notes")
            // console.log(notes)
            return result;
        } catch (e) {
            console.log(e);
        }
    };

    const getyWorkshopById = async () => {
      const options = {
          'method': 'POST',
          'url': `http://localhost:3500/workshops/workshopById`,
          'headers': {
            'Content-Type': 'application/json'
          },
          data: {
            id: global.workshopID
          }
      };
      
      try {
          const result = await axios(options);
          setFetcgedAgendaSession(result.data.workshopAgenda)
          document.getElementById("summary").innerHTML = result.data.workshopSummary;
          return result;
      } catch (e) {
          console.log(e);
      }
  };
  
    useEffect(() => {
        getNotesByWorkshop();
        getyWorkshopById();
    }, []);
  
    return (
      <section>
        {/* <button onClick={getUserWorkshops}>get workshops for you</button> */}
        <h1 id="test">Workshops: </h1>
  
        <table className="table_workshop table--users">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th user__username">Notes List:</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(note => (
                
              <NoteItem key={note._id} noteContent={note.content}/>
              
            ))}
          </tbody>
        </table>

        <h1 id="Summarisation">Summary:</h1>
        <p id="summary"></p>
        <h1 id="agenda">Agenda:</h1>
        {fetchedAgendaSession.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
        ))}
      </section>
    );

    // return (
    //     <h1>{global.workshopID}</h1>
    // )
}
export default WorkshopNotes